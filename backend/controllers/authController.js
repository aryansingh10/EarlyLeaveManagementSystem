const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const sendEmail = require('../utils/nodemailer');
dotenv.config();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Use Secure only in production
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // Use SameSite=None only in production
  maxAge: 3600000,
};

// Register Function
exports.register = async (req, res) => {
  const { name, email, password, role, enrollmentNumber, class: userClass, year, department } = req.body;

  if (!name || !email || !password || !role || !department) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }

  try {
    // If the role is HOD, check if an HOD already exists for the department
    if (role === 'hod') {
      const existingHOD = await User.findOne({ role: 'hod', department });
      if (existingHOD) {
        return res.status(400).json({
          message: `HOD already exists for the ${department} department. Only one HOD can be registered per department.`,
        });
      }
    }

    // Prepare user data, including role-specific fields
    const userData = { name, email, password, role, department };
    if (role === 'student') {
      userData.enrollmentNumber = enrollmentNumber;
      userData.class = userClass;
      userData.year = year;
    }

    // Create new user
    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set cookie and respond with user info
    res.cookie('token', token, cookieOptions).status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        enrollmentNumber: user.role === 'student' ? user.enrollmentNumber : undefined,
        class: user.role === 'student' ? user.class : undefined,
        year: user.role === 'student' ? user.year : undefined,
        department: user.department,
      },
      token: token,
    });

    // Optionally send welcome email
    const subject = 'Welcome to Leave Sync';
    const text = `Hello, ${name}! Welcome to Leave Sync. You have successfully registered as a ${role} in the ${department} department.`;
    sendEmail(email, subject, text);

  } catch (err) {
    console.error('Registration Error:', err);
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
        enrollmentNumber: user.role === 'student' ? user.enrollmentNumber : undefined,
        class: user.role === 'student' ? user.class : undefined,
        year: user.role === 'student' ? user.year : undefined,
        department: user.department,
      },
      token: token,
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
        enrollmentNumber: user.role === 'student' ? user.enrollmentNumber : undefined,
        class: user.role === 'student' ? user.class : undefined,
        year: user.role === 'student' ? user.year : undefined,
        department: user.department,
      },
    });
  } catch (err) {
    console.error('GetMe Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get All Coordinators Function
exports.getAllCoordinators = async (req, res) => {
  try {
    const coordinators = await User.find({ role: 'coordinator' }).select('-password');
    res.status(200).json(coordinators);
  } catch (err) {
    console.error('GetAllCoordinators Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
