const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();
const { getMe } = require('../controllers/authController');
const { auth } = require('../middlewares/auth');


router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);

module.exports = router;
