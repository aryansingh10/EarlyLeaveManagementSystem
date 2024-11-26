const Leave = require('../models/Leave');
const User = require('../models/User');
const dotenv = require('dotenv');
const sendEmail = require('../utils/nodemailer');
dotenv.config();

// Submit Leave
exports.submitLeave = async (req, res) => {
  const { startDate, endDate, reason, supportingDocuments, isEarlyLeave, parentsNumber, coordinatorId } = req.body;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if a leave request has already been submitted today
    const existingLeave = await Leave.findOne({
      studentId: req.user.id,
      createdAt: { $gte: today }
    });

    if (existingLeave) {
      return res.status(400).json({ message: 'You have already applied for leave today.' });
    }

    // Create new leave request
    const leave = new Leave({
      studentId: req.user.id,
      startDate,
      endDate,
      reason,
      supportingDocuments,
      isEarlyLeave,
      parentsNumber,
      coordinatorId // Assign the selected coordinator
    });

    await leave.save();
    res.status(201).json(leave);

    // Notify HOD and coordinator by email
    const hod = await User.findOne({ role: 'hod' });
    const coordinator = await User.findById(coordinatorId); // Get the selected coordinator
    const user = await User.findById(req.user.id);

    const subject = 'Early Leave Application Submitted';

// Email for Coordinator
const textCord = `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Dear ${coordinator.name || 'Coordinator'},</p>
      <p>An early leave application has been submitted by <strong>${user.name}</strong> (Enrollment Number: <strong>${user.enrollmentNumber}</strong>) from <strong>Class ${user.class}, Year ${user.year}</strong>.</p>
      <p><strong>Reason for leave:</strong> ${leave.reason}</p>
      <p>Please log in to the portal to review and take the necessary action.</p>
      <br>
      <p>Best regards,</p>
      <p><strong>Leave Sync Team</strong></p>
    </body>
  </html>
`;

// Email for HOD
const textHod = `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Dear ${hod.name || 'HOD'},</p>
      <p>An early leave application has been submitted by <strong>${user.name}</strong> (Enrollment Number: <strong>${user.enrollmentNumber}</strong>) from <strong>Class ${user.class}, Year ${user.year}</strong>.</p>
      <p><strong>Reason for leave:</strong> ${leave.reason}</p>
      <p>Please log in to the portal to review and take the necessary action.</p>
      <br>
      <p>Best regards,</p>
      <p><strong>Leave Sync Team</strong></p>
    </body>
  </html>
`;


    if (hod) sendEmail(hod.email, subject, textHod);
    if (coordinator) sendEmail(coordinator.email, subject, textCord);

  } catch (err) {
    console.error("Error submitting leave or sending email:", err);
    res.status(400).json({ message: 'Leave submission failed', error: err.message });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  const { leaveId, status } = req.body;

  try {
    const leave = await Leave.findById(leaveId).populate('studentId'); // Populate to get student's email
    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    // Coordinator approval
    if (req.user.role === 'coordinator' && leave.coordinatorApprovalStatus === 'pending') {
      leave.coordinatorApprovalStatus = status;
      leave.coordinatorId = req.user.id;

      // If coordinator rejects, immediately set finalStatus to 'rejected'
      if (status === 'rejected') {
        leave.finalStatus = 'rejected';
      }
    } 
    // HOD approval
    else if (req.user.role === 'hod') {
      if (leave.coordinatorApprovalStatus === 'approved') {
        leave.hodApprovalStatus = status;
        leave.hodId = req.user.id;

        // Final approval only if both HOD and Coordinator approve
        leave.finalStatus = status === 'approved' && leave.coordinatorApprovalStatus === 'approved' ? 'approved' : 'rejected';

        // Send email to student if the final status is updated
        if (leave.finalStatus !== 'pending') {
          const emailSubject = `Leave Request ${leave.finalStatus === 'approved' ? 'Approved' : 'Rejected'}`;
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
              <h2 style="color: #0056b3;">Leave Request Update</h2>
              <p>Dear <strong>${leave.studentId.name}</strong>,</p>
              <p>Your leave request from <strong>${leave.startDate.toDateString()}</strong> to <strong>${leave.endDate.toDateString()}</strong> has been <span style="color: ${leave.finalStatus === 'approved' ? '#28a745' : '#dc3545'}; font-weight: bold;">${leave.finalStatus}</span>.</p>
              <p><strong>Reason for Leave:</strong> ${leave.reason}</p>
              <p>If you have any questions, feel free to reach out to the Coordinator or HOD.</p>
              <br>
              <p>Best Regards,</p>
              <p><strong>Leave Sync</strong></p>
              <hr style="border-top: 1px solid #eee;">
              <p style="font-size: 0.9em; color: #666;">Please do not reply to this email. This is an automated notification.</p>
            </div>
          `;

          await sendEmail(leave.studentId.email, emailSubject, emailHtml);
        }
      } else {
        return res.status(403).json({ message: 'Coordinator approval is required first' });
      }
    } else {
      return res.status(403).json({ message: 'Not authorized to update this leave status' });
    }

    await leave.save();
    res.status(200).json(leave);
  } catch (err) {
    res.status(400).json({ message: 'Error updating leave status', error: err.message });
  }
};
// Get leaves submitted by the student
exports.getStudentLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ studentId: req.user.id });
    res.status(200).json(leaves);
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch leaves', error: err.message });
  }
};

// Get leaves for HOD review (approved by coordinator)
exports.getHODLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ $and: [{ coordinatorApprovalStatus: 'approved' }, { finalStatus: 'pending' }] })
      .populate('studentId', 'name enrollmentNumber')
      .populate('coordinatorId', 'name');
    res.status(200).json(leaves);
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch leaves for HOD', error: err.message });
  }
};

exports.getCoordinatorLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({
      coordinatorApprovalStatus: 'pending',
      coordinatorId: req.user.id  
    })
      .populate('studentId', 'name enrollmentNumber');
    res.status(200).json(leaves);
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch leaves for coordinator', error: err.message });
  }
};



exports.getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    res.status(200).json(leave);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching leave details', error: err.message });
  }
};

// Get leaves within a date range
exports.getLeavesByDate = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const leaves = await Leave.find({
      startDate: { $gte: new Date(startDate) },
      endDate: { $lte: new Date(endDate) }
    });
    res.status(200).json(leaves);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching leaves by date', error: err.message });
  }
};


exports.getLeaveHistory = async (req, res) => {
  try {
    const leaves = await Leave.find({ studentId: req.user.id });
    res.status(200).json(leaves);
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch leave history', error: err.message });
  }
};

// Delete a leave request
exports.deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    if (leave.studentId.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized to delete this leave' });
    await leave.deleteOne();
    res.status(200).json({ message: 'Leave deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete leave', error: err.message });
  }
};

// Get leave statistics (rejected, approved, pending)
exports.getLeaveStats = async (req, res) => {
  try {
    const rejected = await Leave.find({ finalStatus: 'rejected' }).populate('studentId', 'name enrollmentNumber class year department');
    const approvedLeaves = await Leave.find({ finalStatus: 'approved' }).populate('studentId', 'name enrollmentNumber class year department');
    const pendingLeaves = await Leave.find({ finalStatus: 'pending' }).populate('studentId', 'name enrollmentNumber class year department');
    const totalLeaves = rejected.length + approvedLeaves.length + pendingLeaves.length;

    res.status(200).json({ totalLeaves, approvedLeaves, pendingLeaves });
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch leave statistics', error: err.message });
  }
};

// Get all approved leaves for HOD and Coordinator
exports.getAllApprovedLeaves = async (req, res) => {

  try {
    const leaves = await Leave.find({ finalStatus: 'approved' })
      .populate('studentId', 'name enrollmentNumber')
      .populate('coordinatorId', 'name');
    res.status(200).json(leaves);
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch approved leaves', error: err.message });
  }
};

exports.fetchApprovedLeaveforaDay=async(req,res)=>{
  const today=new Date().toISOString().split('T')[0];
  const approvedLeaves=await Leave.find({
    finalStatus: 'approved',
    $or: [{ startDate: today }, { endDate: today }],

  })
  .populate('studentId', 'name enrollmentNumber class year');
  res.status(200).json(approvedLeaves);

}