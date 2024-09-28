const express = require('express');
const { register, login,logout } = require('../controllers/authController');
const router = express.Router();
const { getMe } = require('../controllers/authController');
const { auth } = require('../middlewares/auth');


router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.post('/logout', logout);
module.exports = router;
