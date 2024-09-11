const Leave = require('../models/Leave');

exports.submitLeave = async (req, res) => {
  const { leaveDates, reason, supportingDocuments } = req.body;
  try {
    const leave = new Leave({
      studentId: req.user.id,
      leaveDates,
      reason,
      supportingDocuments
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
      // Coordinator can approve or reject when status is 'pending'
      leave.status = status;
      leave.coordinatorId = req.user.id;
    } 
    else if (req.user.role === 'hod') {
      // HOD can approve or reject after coordinator's approval
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
