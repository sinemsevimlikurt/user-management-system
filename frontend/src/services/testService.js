import axios from 'axios';

// Create a simple axios instance for testing
const testAxios = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 15000
});

const testService = {
  testDebugEndpoint: async () => {
    try {
      console.log('Testing debug endpoint...');
      try {
        // First try with /api prefix
        const response = await testAxios.get('/test/debug');
        console.log('Debug endpoint response:', response.data);
        return response.data;
      } catch (firstError) {
        console.log('First attempt failed, trying direct URL...');
        // If that fails, try direct URL
        const directResponse = await axios.get('http://localhost:8080/test/debug', {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        console.log('Direct debug endpoint response:', directResponse.data);
        return directResponse.data;
      }
    } catch (error) {
      console.error('Debug endpoint error:', error.response ? error.response.data : error.message);
      throw error;
    }
  },
  
  testAllAccess: async () => {
    try {
      console.log('Testing public endpoint...');
      try {
        // First try with /api prefix
        const response = await testAxios.get('/test/all');
        console.log('Public endpoint response:', response.data);
        return response.data;
      } catch (firstError) {
        console.log('First attempt failed, trying direct URL...');
        // If that fails, try direct URL
        const directResponse = await axios.get('http://localhost:8080/test/all', {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });
        console.log('Direct public endpoint response:', directResponse.data);
        return directResponse.data;
      }
    } catch (error) {
      console.error('Public endpoint error:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
};

export default testService;
