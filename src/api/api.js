import axios from 'axios';

const baseURL = (typeof import.meta !== 'undefined' ? import.meta.env.VITE_API_URL : undefined) || 
                'https://progression-tracker-mern.onrender.com/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data && typeof config.data !== 'string') {
      config.data = JSON.stringify(config.data);
    }
    console.log('Request:', config.method.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;