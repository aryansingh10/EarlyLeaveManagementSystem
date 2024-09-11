const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Middleware to authenticate token
exports.auth = (req, res, next) => {
  //
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) return res.status(401).send('Access Denied. No token provided.');

  try {
    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};


exports.roleCheck = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden' });
    }
    next();
  };
};
