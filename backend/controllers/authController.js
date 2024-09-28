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

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = new User({ name, email, password, role });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    
    res.cookie('token', token, cookieOptions).status(201).json({
      message: 'Registration successful',
      user: {
        id: user._id,
        role: user.role,  
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(400).json({ message: 'Registration failed' });
  }
};

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
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(400).json({ message: 'Login failed' });
  }
};


exports.logout = async (req, res) => {

  res.clearCookie('token').json({ message: 'Logout successful' });

}
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};
