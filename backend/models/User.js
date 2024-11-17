const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minlength: [8, 'Password must be at least 8 characters long.'],
  },
  role: {
    type: String,
    enum: ['student', 'coordinator', 'hod'],
    required: [true, 'Role is required.'],
  },
  enrollmentNumber: {
    type: String,
    unique: true,
    required: function () {
      return this.role === 'student';
    },
    sparse: true, // Ensures unique constraint only applies when enrollmentNumber is present
  },
  class: {
    type: String,
    enum: ['CS1', 'CS2', 'CS3', 'CS4', 'CS5'],
    required: function () {
      return this.role === 'student';
    },
  },
  department: {
    type: String,
    enum: ['CSE', 'IT', 'ECE', 'MECH', 'CIVIL', 'AIML', 'DS', 'IOT', 'CSIT'],
    required: function () {
      // Department is required for students, coordinators, and HODs
      return ['student', 'coordinator', 'hod'].includes(this.role);
    },
  },
  year: {
    type: String,
    enum: ['1', '2', '3', '4'],
    required: function () {
      return this.role === 'student';
    },
  },
});

// Hash the password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', UserSchema);
