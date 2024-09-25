import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role is 'student'
  const { signup } = useAuth(); // Hook to access signup function
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Pass the correct parameters for signup (name, email, password, role)
      await signup(name, email, password, role);
      // extract role from the response and navigate to the respective dashboard// Navigate to the respective dashboard based on the role
      if (role === 'student') {
        console.log('Navigating to student-dashboard');
        navigate('/student-dashboard');
      } else if (role === 'coordinator') {
        console.log('Navigating to coordinator-dashboard');
        navigate('/coordinator-dashboard');
      } else if (role === 'hod') {
        console.log('Navigating to hod-dashboard');
        navigate('/hod-dashboard');
      }
      
    } catch (error) {
      console.error('Signup error: ', error);
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="coordinator">Coordinator</option>
          <option value="hod">HOD</option>
        </select>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
