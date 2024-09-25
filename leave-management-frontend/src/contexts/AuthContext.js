import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in on component mount
  useEffect(() => {
    const storedUser = authService.getCurrentUser();
    console.log('Stored user:', storedUser);  // Debugging stored user
    
    if (storedUser.user) {
      setUser(storedUser.user);
    }
    setLoading(false);
  }, []);
  
  // AuthContext.js

const login = async (email, password) => {
  try {
    const loggedInUser = await authService.login(email, password);
    console.log('Login response:', loggedInUser);  // Debugging response
    setUser(loggedInUser);  // Set the user state

    if (loggedInUser.user.role === 'student') {
      console.log('Navigating to student-dashboard');
      navigate('/student-dashboard');
    } else if (loggedInUser.user.role === 'coordinator') {
      console.log('Navigating to coordinator-dashboard');
      navigate('/coordinator-dashboard');
    } else if (loggedInUser.user.role === 'hod') {
      console.log('Navigating to hod-dashboard');
      navigate('/hod-dashboard');
    }
  } catch (error) {
    console.error('Login error:', error);  // Log any errors
  }
};

const signup = async (name, email, password, role) => {
  try {
    const signedUpUser = await authService.signup(name, email, password, role);
    console.log('Signup response:', signedUpUser);  // Debugging response
    setUser(signedUpUser);  // Set the user state

    // Ensure navigation happens after signup
    if (signedUpUser.role === 'student') {
      console.log('Navigating to student-dashboard');
      navigate('/student-dashboard');
    } else if (signedUpUser.role === 'coordinator') {
      console.log('Navigating to coordinator-dashboard');
      navigate('/coordinator-dashboard');
    } else if (signedUpUser.role === 'hod') {
      console.log('Navigating to hod-dashboard');
      navigate('/hod-dashboard');
    }
  } catch (error) {
    console.error('Signup error:', error);  // Log any errors
  }
};

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children} {/* Wait until loading is done */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
