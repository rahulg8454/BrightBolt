// axios_instance.jsx
import axios from "axios";

const instance = axios.create({
  baseURL: "https://brightbolt-backend.onrender.com",
});

// Attach token automatically if present
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
