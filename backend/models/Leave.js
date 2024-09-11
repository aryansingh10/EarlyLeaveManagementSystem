const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  leaveDates: { type: [Date], required: true },
  reason: { type: String, required: true },
  supportingDocuments: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  coordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hodId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
