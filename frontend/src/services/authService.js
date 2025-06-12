import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

const authService = {
  login: async (username, password) => {
    const response = await axios.post(API_URL + 'signin', { username, password });
    return response.data;
  },
  
  register: async (userData) => {
    const response = await axios.post(API_URL + 'signup', userData);
    return response.data;
  },
  
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  }
};

export default authService;
