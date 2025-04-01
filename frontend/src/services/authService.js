import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const register = (username, email, password) => {
  return axios.post(`${API_URL}/register`, { username, email, password })
    .then(response => response.data);
};

const login = (email, password) => {
  return axios.post(`${API_URL}/login`, { email, password })
    .then(response => response.data);
};

export default {
  register,
  login
};