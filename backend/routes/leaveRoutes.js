const express = require('express');
const {
  submitLeave,
  updateLeaveStatus,
  getStudentLeaves,
  getCoordinatorLeaves,
  getHODLeaves,
  getLeaveById,
  getLeaveHistory,
  getLeaveStats,
  getLeavesByDate,
  deleteLeave,
  getAllApprovedLeaves,
  fetchApprovedLeaveforaDay
} = require('../controllers/leaveController');

const { auth, roleCheck } = require('../middlewares/auth');
const router = express.Router();


router.post('/submit', auth, roleCheck('student'), submitLeave);


router.put('/update-status', auth, roleCheck('coordinator', 'hod'), updateLeaveStatus);


router.get('/student-leaves', auth, roleCheck('student'), getStudentLeaves);

router.get('/coordinator-leaves', auth, roleCheck('coordinator'), getCoordinatorLeaves);


router.get('/hod-leaves', auth, roleCheck('hod'), getHODLeaves);


router.get('/leave/:id', auth, getLeaveById);

router.get('/leaves-by-date', auth, getLeavesByDate);


router.get('/student/leave-history', auth, roleCheck('student'), getLeaveHistory);


router.delete('/leave/:id', auth, roleCheck('student'), deleteLeave);


router.get('/approved-leaves', auth, roleCheck('student', 'coordinator', 'hod'), getAllApprovedLeaves);


router.get('/stats', auth, roleCheck('coordinator', 'hod'), getLeaveStats);

router.get('/approved-leaves-for-day', fetchApprovedLeaveforaDay);


module.exports = router;
