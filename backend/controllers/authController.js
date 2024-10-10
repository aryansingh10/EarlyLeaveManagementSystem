const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

// Set cookie options
const cookieOptions = {
  httpOnly: true, 
  secure: process.env.NODE_ENV === 'production', 
  sameSite: 'Lax', 
  maxAge: 3600000 
};

// Register Function
exports.register = async (req, res) => {
  const { name, email, password, role, enrollmentNumber } = req.body;

  try {
    // Only include enrollmentNumber if the role is student
    const userData = { name, email, password, role };

    if (role === 'student') {
      userData.enrollmentNumber = enrollmentNumber;
    }

    const user = new User(userData);
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, cookieOptions).status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        enrollmentNumber: user.role === 'student' ? user.enrollmentNumber : undefined,  // Include enrollmentNumber for students
      },
    });
  } catch (err) {
    res.status(400).json({ message: 'Registration failed' });
  }
};

// Login Function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, cookieOptions).json({
      message: 'Login successful',
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        enrollmentNumber: user.role === 'student' ? user.enrollmentNumber : undefined,  // Include enrollmentNumber for students
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(400).json({ message: 'Login failed' });
  }
};

// Logout Function
exports.logout = async (req, res) => {
  res.clearCookie('token').json({ message: 'Logout successful' });
};

// GetMe Function
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        enrollmentNumber: user.role === 'student' ? user.enrollmentNumber : undefined,  // Include enrollmentNumber for students
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
