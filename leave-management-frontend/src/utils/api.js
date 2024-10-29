import axios from 'axios';


const api = axios.create({
  baseURL: 'http://early-leave-automation-system.vercel.app/api/', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});



export default api;
