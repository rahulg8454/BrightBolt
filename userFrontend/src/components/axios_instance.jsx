// axios-instance.jsx
import axios from 'axios';

const API = axios.create({
  baseURL: "https://brightbolt-backend.onrender.com/api"
});


instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
