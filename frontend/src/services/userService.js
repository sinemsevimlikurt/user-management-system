import axios from 'axios';
import authHeader from './authHeader';

const API_URL = 'http://localhost:8080/api/users/';

const userService = {
  getAllUsers: async () => {
    const response = await axios.get(API_URL, { headers: authHeader() });
    return response.data;
  },
  
  getUserById: async (id) => {
    const response = await axios.get(API_URL + id, { headers: authHeader() });
    return response.data;
  },
  
  updateUser: async (id, userData) => {
    const response = await axios.put(API_URL + id, userData, { headers: authHeader() });
    return response.data;
  },
  
  deleteUser: async (id) => {
    const response = await axios.delete(API_URL + id, { headers: authHeader() });
    return response.data;
  }
};

export default userService;
