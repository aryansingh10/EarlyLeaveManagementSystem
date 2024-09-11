const express = require('express');
const { submitLeave, updateLeaveStatus } = require('../controllers/leaveController');
const { auth, roleCheck } = require('../middlewares/auth');
const router = express.Router();

router.post('/submit', auth, roleCheck('student'), submitLeave);
router.put('/update-status', auth, roleCheck('coordinator', 'hod'), updateLeaveStatus);

module.exports = router;
