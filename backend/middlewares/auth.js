const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

// Protect routes middleware
exports.auth = async (req, res, next) => {
  let token;

  // Check for token in cookies
  if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).send('Access Denied. No token provided.');
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

// Role check middleware
exports.roleCheck = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden' });
    }
    next();
  };
};
