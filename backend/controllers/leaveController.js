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

    const subject = 'New Leave Application';
    const text = `A new leave application has been submitted by ${user.name} (${user.enrollmentNumber}) for ${leave.reason}. Please login to the portal to view the application.`;

    // if (hod) sendEmail(hod.email, subject, text);
    // if (coordinator) sendEmail(coordinator.email, subject, text);

  } catch (err) {
    console.error("Error submitting leave or sending email:", err);
    res.status(400).json({ message: 'Leave submission failed', error: err.message });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  const { leaveId, status } = req.body;

  try {
    const leave = await Leave.findById(leaveId);
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
    const rejected = await Leave.find({ finalStatus: 'rejected' });
    const approvedLeaves = await Leave.find({ finalStatus: 'approved' });
    const pendingLeaves = await Leave.find({ finalStatus: 'pending' });
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
  .populate('studentId', 'name enrollmentNumber');
  res.status(200).json(approvedLeaves);

}
