import api from '../utils/api';

// Login
// authService.js

const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const userData = response.data;  // Ensure this contains the user object with the role
    console.log('Login API Response:', userData);  // Verify the structure here
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);  // Save JWT token
    return userData;  // Ensure the user data is returned
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

const signup = async (name, email, password, role) => {
  try {
    const response = await api.post('/auth/register', { name, email, password, role });
    console.log('Signup API Response:', response.data);  // Check the response data
    const userData = response.data;
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);  // Save JWT token
    return userData;
  } catch (error) {
    console.error('Error during signup:', error);  // Log error during signup
    throw error;
  }
};



// Get current user from localStorage
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

// Logout
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export default { login, signup, getCurrentUser, logout };
