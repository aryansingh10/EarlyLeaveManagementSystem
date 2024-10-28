const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();


exports.auth = async (req, res, next) => {
  let token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  console.log("Token in auth middleware:", token);

  if (!token) {
    console.log("No token found");
    return res.status(401).send('Access Denied. No token provided.');
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    console.log("User verified:", req.user);
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    res.status(400).send('Invalid Token');
  }
};



exports.roleCheck = (...roles) => {
  return (req, res, next) => {
    console.log("User role:", req.user.role);
    if (!roles.includes(req.user.role)) {
      console.log("User role not allowed");
      return res.status(403).json({ message: 'Access forbidden' });
    }
    next();
  };
};
