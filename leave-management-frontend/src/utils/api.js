import axios from 'axios';

const api = axios.create({
  baseURL: 'https://early-leave-automation-system.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending cookies
});

export default api;
