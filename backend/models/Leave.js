const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  reason: { type: String, required: true },
  supportingDocuments: String,
  isEarlyLeave: { type: Boolean, default: false },
  parentsNumber: { type: String, required: true },
  coordinatorApprovalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  hodApprovalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  finalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, // Based on both approvals
  coordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hodId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const Leave = mongoose.model('Leave', leaveSchema);
module.exports = Leave;
