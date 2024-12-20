import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';  // Updated import for authService
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser)); 
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);

      localStorage.setItem('user', JSON.stringify(loggedInUser));

      navigate(`/${loggedInUser.user.role}-dashboard`);

      toast.success(`Welcome back, ${loggedInUser.user.name}!`);
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error);
    }
  };

  // Updated signup to include class and section fields for students
  const signup = async (name, email, password, role, enrollmentNumber = null, userClass = null, year = null,department) => {
    try {
      const signedUpUser = await authService.signup(name, email, password, role, enrollmentNumber, userClass, year,department);
      // setUser(signedUpUser);

      // localStorage.setItem('user', JSON.stringify(signedUpUser));

      // navigate(`/${signedUpUser.user.role}-dashboard`);
      navigate("/login");

      toast.success(`Welcome, ${signedUpUser.user.name}!`);
    } catch (error) {
      navigate('/signup');

      if (role === 'hod' && error.response?.status === 400) {
        toast.error('HOD already exists');
      } else if (error.response?.status === 500) {
        toast.error('Server error');
      } else if (error.response?.status === 401) {
        toast.error('Unauthorized');
      } else {
        toast.error(error.response?.data?.message || 'Signup error');
      }
      console.error('Signup error:', error);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      navigate('/login');
      toast.success('Logout successful');
    } catch (error) {
      toast.error('Logout failed');
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {!loading ? children : <p>Loading...</p>} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
