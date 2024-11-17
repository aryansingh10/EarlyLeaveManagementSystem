import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('student');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [year, setYear] = useState('');
  const [classSection, setClassSection] = useState('');
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    // Regex to validate email ending in .com
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.endsWith('.com');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Invalid email format. Please enter a valid .com email.');
      toast.error('Invalid email format. Please enter a valid .com email.');
      return;
    }

    if (role === 'student' && (!enrollmentNumber || !year || !classSection)) {
      setError('Enrollment number, year, and class/section are required for students.');
      toast.error('Enrollment number, year, and class/section are required for students.');
      return;
    }

    try {
      await signup(name, email, password, role, enrollmentNumber, classSection, year);
      navigate(`/${role}-dashboard`);
    } catch (error) {
      console.error('Signup error: ', error);
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-blue-500 hover:text-blue-700"
              >
                {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
              </button>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-600 mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">Student</option>
              <option value="coordinator">Coordinator</option>
              <option value="hod">HOD</option>
            </select>
          </div>

          {role === 'student' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Enrollment Number</label>
                <input
                  type="text"
                  value={enrollmentNumber}
                  onChange={(e) => setEnrollmentNumber(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your enrollment number"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Class/Section</label>
                <select
                  value={classSection}
                  onChange={(e) => setClassSection(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Class/Section</option>
                  <option value="CS1">CS1</option>
                  <option value="CS2">CS2</option>
                  <option value="CS3">CS3</option>
                  <option value="CS4">CS4</option>
                  <option value="CS5">CS5</option>
                </select>
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition duration-200"
          >
            Sign Up
          </button>
        </form>

        {/* Link to login */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
