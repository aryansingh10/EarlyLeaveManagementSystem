import api from '../utils/api';  // Assumes you have API setup for making requests

const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    console.log('Login API Response:', response.data);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// Modified signup to include enrollmentNumber if role is 'student'
const signup = async (name, email, password, role, enrollmentNumber = null) => {
  try {
    const data = { name, email, password, role };
    
    // Include enrollmentNumber only for students
    if (role === 'student') {
      data.enrollmentNumber = enrollmentNumber;
    }

    const response = await api.post('/auth/register', data);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    console.log('Signup API Response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const logout = async () => {
  try {
    await api.post('/auth/logout');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export default { login, signup, getCurrentUser, logout };
