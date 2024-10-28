import axios from 'axios';


const api = axios.create({
  baseURL: 'https://early-leave-automation-system.vercel.app/api', 
  headers: {
    'Content-Type': 'application/json',
  }
});



export default api;
