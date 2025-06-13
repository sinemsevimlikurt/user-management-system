import axios from 'axios';

// Create a new axios instance specifically for auth requests
const authAxios = axios.create({
  baseURL: '/api',  // Use relative URL with Vite proxy
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,  // Include credentials in requests
  timeout: 15000 // 15 seconds timeout
});

// Create a separate instance for authenticated requests
const api = axios.create({
  baseURL: '/api',  // Use relative URL with Vite proxy
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,  // Include credentials in requests
  timeout: 15000 // 15 seconds timeout
});

// Add a request interceptor to include JWT token in requests
api.interceptors.request.use(
  (config) => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.token) {
          // Make sure the Authorization header is set correctly
          config.headers['Authorization'] = `Bearer ${user.token}`;
          console.log('Adding auth token to request:', config.url);
        } else {
          console.warn('No token found in user object');
        }
      } else {
        console.warn('No user found in localStorage');
      }
    } catch (error) {
      console.error('Error processing auth token:', error);
      // Clear invalid user data
      localStorage.removeItem('user');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors globally
    if (error.response && error.response.status === 401) {
      // Token might be expired or invalid
      console.log('Unauthorized request detected');
      // We don't logout here to avoid circular dependencies
      // The AuthContext will handle logout when it catches 401 errors
    }
    return Promise.reject(error);
  }
);

const authService = {
  login: async (name, password) => {
    try {
      console.log('Attempting login with username:', name);
      
      let responseData = null;
      
      try {
        // Make direct request without using the intercepted instance
        const response = await authAxios.post('/auth/signin', { 
          name: name, 
          password: password 
        });
        
        console.log('Login response from standard endpoint:', response);
        responseData = response.data;
      } catch (firstError) {
        console.log('First login attempt failed, trying alternative endpoint...', firstError.message);
        
        // Try the alternative endpoint
        const altResponse = await axios.post('http://localhost:8080/api/auth/signin', {
          name: name,
          password: password
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        
        console.log('Login response from alternative endpoint:', altResponse);
        responseData = altResponse.data;
      }
      
      if (responseData && responseData.token) {
        console.log('Login successful, token received');
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(responseData));
        
        // Set the token in the default headers for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${responseData.token}`;
        api.defaults.headers.common['Authorization'] = `Bearer ${responseData.token}`;
        
        console.log('Token stored in localStorage and set in axios headers');
        
        return responseData;
      } else {
        console.error('Invalid response format:', responseData);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Login error details:', error.response ? error.response.data : error.message);
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await authAxios.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },
  
  // Get user profile
  getUserProfile: async () => {
    try {
      console.log('Attempting to fetch user profile from /api/users/me');
      
      // Get the user token from localStorage
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.error('No user found in localStorage');
        throw new Error('User not authenticated');
      }
      
      const user = JSON.parse(userStr);
      if (!user || !user.token) {
        console.error('No token found in user object');
        throw new Error('Invalid authentication token');
      }
      
      console.log('Token found in localStorage:', user.token.substring(0, 20) + '...');
      
      try {
        // First try the standard endpoint with our configured API instance
        console.log('Trying standard endpoint with api instance');
        const response = await api.get('/users/me');
        console.log('User profile fetched successfully:', response.data);
        return response.data;
      } catch (firstError) {
        console.log('First attempt failed, trying alternative endpoint...', firstError.message);
        
        // Try with direct URL and explicit headers
        console.log('Trying direct URL with explicit token');
        const directResponse = await axios.get('http://localhost:8080/api/users/me', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        
        console.log('Direct profile endpoint response:', directResponse.data);
        return directResponse.data;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // If we get a 500 error, it might be due to authentication issues
      if (error.response?.status === 500) {
        console.log('Server error when fetching profile, might be an authentication issue');
      }
      
      throw error;
    }
  },
  
  // Admin only - get all users
  getAllUsers: async () => {
    try {
      const response = await api.get('/users/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }
};

export { api }; // Export the configured axios instance for other services
export default authService;
