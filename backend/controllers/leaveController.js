const Leave = require('../models/Leave');

exports.submitLeave = async (req, res) => {
  const { leaveDates, reason, supportingDocuments,isEarlyLeave } = req.body;
  try {
    const leave = new Leave({
      studentId: req.user.id,
      leaveDates,
      reason,
      supportingDocuments,
      isEarlyLeave
    });
    await leave.save();
    res.status(201).json(leave);
  } catch (err) {
    res.status(400).json({ message: 'Leave submission failed' });
  }
};


exports.updateLeaveStatus = async (req, res) => {
  const { leaveId, status } = req.body;
  try {
    const leave = await Leave.findById(leaveId);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });

    if (req.user.role === 'coordinator' && leave.status === 'pending') {
      
      leave.status = status;
      leave.coordinatorId = req.user.id;
    } 
    else if (req.user.role === 'hod') {

      if (leave.status === 'approved' || leave.status === 'pending') {
        leave.status = status;
        leave.hodId = req.user.id;
      } else {
        return res.status(403).json({ message: 'Not authorized to change this leave status' });
      }
    }
    else {
      return res.status(403).json({ message: 'Not authorized to change this leave status' });
    }

    await leave.save();
    res.status(200).json(leave);
  } catch (err) {
    res.status(400).json({ message: 'Error updating leave status' });
  }
};





exports.getStudentLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ studentId: req.user.id });
    res.status(200).json(leaves);
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch leaves' });
  }
};


exports.getCoordinatorLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ status: 'pending' });
    res.status(200).json(leaves);
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch leaves for coordinator' });
  }
};


exports.getHODLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ $or: [{ status: 'approved' }, { status: 'pending' }] });
    res.status(200).json(leaves);
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch leaves for HOD' });
  }
};

exports.getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    res.status(200).json(leave);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching leave details' });
  }
};


exports.getLeavesByDate = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const leaves = await Leave.find({
      leaveDates: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });
    res.status(200).json(leaves);
  } catch (err) {
    res.status(400).json({ message: 'Error fetching leaves' });
  }
};

exports.getLeaveHistory = async (req, res) => {
  try {
    const leaves = await Leave.find({ studentId: req.user.id });
    res.status(200).json(leaves);
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch leave history' });
  }
};

exports.deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    
    // Ensure only the student who submitted the leave can delete it
    if (leave.studentId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this leave' });
    }

    await leave.remove();
    res.status(200).json({ message: 'Leave deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete leave' });
  }
};

exports.getLeaveStats = async (req, res) => {
  try {
    const totalLeaves = await Leave.countDocuments({});
    const approvedLeaves = await Leave.countDocuments({ status: 'approved' });
    const pendingLeaves = await Leave.countDocuments({ status: 'pending' });

    res.status(200).json({
      totalLeaves,
      approvedLeaves,
      pendingLeaves
    });
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch leave statistics' });
  }
};
