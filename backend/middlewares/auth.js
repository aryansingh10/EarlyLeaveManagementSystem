const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

// Middleware to authenticate user based on JWT token in cookies
exports.auth = async (req, res, next) => {
  const token = req.cookies?.token; // Retrieve token from cookies

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    // Verify token and attach the user payload to the request
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Token expired. Please log in again.' });
    } else {
      res.status(400).json({ message: 'Invalid Token' });
    }
  }
};

// Middleware for role-based access control
exports.roleCheck = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden: Insufficient privileges.' });
    }
    next();
  };
};
