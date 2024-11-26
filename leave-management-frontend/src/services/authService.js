import api from '../utils/api';  
// Login function
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

// Signup function with conditional enrollmentNumber, class, and section for students
const signup = async (name, email, password, role, enrollmentNumber = null, userClass = null, year = null) => {
  try {
    const data = { name, email, password, role, enrollmentNumber, userClass, year };

    // Include enrollmentNumber, class, and section only for students
    if (role === 'student') {
      data.enrollmentNumber = enrollmentNumber;
      data.class = userClass;  // Renamed 'class' to 'userClass' to avoid JS reserved word
      data.year = year;
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

// Get current user from local storage
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

// Logout function
const logout = async () => {
  try {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export default { login, signup, getCurrentUser, logout };
