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
} = require('../controllers/leaveController');

const { auth, roleCheck } = require('../middlewares/auth');
const router = express.Router();

// Route for submitting a leave
router.post('/submit', auth, roleCheck('student'), submitLeave);

// Route for updating leave status (accessible to coordinator or HOD)
router.put('/update-status', auth, roleCheck('coordinator', 'hod'), updateLeaveStatus);

// Route for fetching student leaves
router.get('/student-leaves', auth, roleCheck('student'), getStudentLeaves);

// Route for fetching coordinator leaves
router.get('/coordinator-leaves', auth, roleCheck('coordinator'), getCoordinatorLeaves);

// Route for fetching HOD leaves
router.get('/hod-leaves', auth, roleCheck('hod'), getHODLeaves);

// Route for fetching leave by ID
router.get('/leave/:id', auth, getLeaveById);

// Route for fetching leaves by a date range
router.get('/leaves-by-date', auth, getLeavesByDate);

// Route for fetching student's leave history
router.get('/student/leave-history', auth, roleCheck('student'), getLeaveHistory);

// Route for deleting a leave (student-specific)
router.delete('/leave/:id', auth, roleCheck('student'), deleteLeave);

// Route for fetching all approved leaves
router.get('/approved-leaves', auth, roleCheck('student', 'coordinator', 'hod'), getAllApprovedLeaves);

// Route for fetching leave statistics (accessible to coordinator or HOD)
router.get('/stats', auth, roleCheck('coordinator', 'hod'), getLeaveStats);


module.exports = router;
