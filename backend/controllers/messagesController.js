// controllers/messageController.js

const Message = require('../models/Message');

// Create a new message for a specific leave request
exports.addMessage = async (req, res) => {
  const { leaveId } = req.params;
  const { coordinatorMessage } = req.body;

  try {
    const message = new Message({ leaveId, coordinatorMessage });
    await message.save();

    res.status(201).json({ message: 'Message added successfully', data: message });
  } catch (error) {
    console.error('Error adding message:', error);
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
