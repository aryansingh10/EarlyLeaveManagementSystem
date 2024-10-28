import axios from 'axios';

const token = localStorage.getItem('authToken');
const api = axios.create({
  baseURL: 'https://early-leave-automation-system.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
});

export default api;
