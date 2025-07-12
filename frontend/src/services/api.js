import axios from 'axios';

// Create a new instance of axios with a base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // This points to your local backend server
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
  This is a special function (an interceptor) that runs before every API request.
  It checks if we have a token in localStorage and, if so, adds it to the
  'Authorization' header. This is how we'll access protected routes later.
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // The backend expects the token in the format 'Bearer <token>'
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;