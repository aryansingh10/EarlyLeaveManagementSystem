const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  reason: { type: String, required: true },
  supportingDocuments: String,
  isEarlyLeave: { type: Boolean, default: false },
  parentsNumber: { type: String, required: true , minlength: 10, maxlength: 15},
  
  // Select coordinatorId field added back
  coordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Coordinator assigned to this leave request

  department: {
    type: String,
    enum: ['CSE', 'IT', 'ECE', 'MECH', 'CIVIL', 'AIML', 'DS', 'IOT', 'CSIT'],
    required: function () {
      // Department is required for students, coordinators, and HODs
      return ['student', 'coordinator', 'hod'].includes(this.role);
    },
  },
  
  // Coordinator and HOD approval statuses
  coordinatorApprovalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  hodApprovalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  
  // Final status based on both approvals
  finalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  
  hodId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // HOD responsible for approval
}, { timestamps: true });

const Leave = mongoose.model('Leave', leaveSchema);
module.exports = Leave;