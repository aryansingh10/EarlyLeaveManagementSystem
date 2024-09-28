import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const { signup } = useAuth(); 
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      await signup(name, email, password, role);
      navigate(`/${role}-dashboard`);
      
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
