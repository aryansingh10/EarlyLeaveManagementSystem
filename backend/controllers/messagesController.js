// controllers/messageController.js

const Message = require('../models/Message');

// Create a new message for a specific leave request
exports.addMessage = async (req, res) => {
  const { leaveId } = req.params;
  const { coordinatorMessage } = req.body;

  try {
    // Find the message by leaveId and update it, or create a new one if it doesn't exist
    const message = await Message.findOneAndUpdate(
      { leaveId }, // Find by leaveId
      { $set: { coordinatorMessage } }, // Update coordinatorMessage
      { new: true, upsert: true } // Return the updated document and create if not exists
    );

    res.status(201).json({ message: 'Message added/updated successfully', data: message });
  } catch (error) {
    console.error('Error adding/updating message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get messages by leave ID (for HOD view)
exports.getMessagesByLeaveId = async (req, res) => {
  const { leaveId } = req.params;

  try {
    const messages = await Message.find({ leaveId });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

