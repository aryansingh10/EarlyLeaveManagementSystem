import axios from 'axios';


const api = axios.create({
  baseURL: 'https://early-leave-automation-system.vercel.app/api', 
  withCredentials: true,
});



export default api;
