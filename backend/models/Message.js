// models/Message.js

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  leaveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Leave', required: true },
  coordinatorMessage: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

});

module.exports = mongoose.model('Message', messageSchema);
