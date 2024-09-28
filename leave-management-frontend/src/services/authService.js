import api from '../utils/api';


const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    console.log('Login API Response:', response.data);
    
    return response.data; 
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

const signup = async (name, email, password, role) => {
  try {
    const response = await api.post('/auth/register', { name, email, password, role });
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
