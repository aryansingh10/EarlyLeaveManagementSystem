import axios from 'axios';

const api = axios.create({
  baseURL: 'https://earlyleavemanagementsystem.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});



export default api;
