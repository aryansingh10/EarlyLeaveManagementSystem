import axios from 'axios';

const token = localStorage.getItem('authToken');  // Retrieve the token
const api = axios.create({
  baseURL: 'https://early-leave-automation-system.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  withCredentials: true
});

export default api;
