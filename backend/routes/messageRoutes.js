// routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');

// Route to add a message for a specific leave
router.post('/leave/:leaveId/message', messagesController.addMessage);

// Route to get messages for a specific leave
router.get('/leave/:leaveId/messages', messagesController.getMessagesByLeaveId);

module.exports = router;
