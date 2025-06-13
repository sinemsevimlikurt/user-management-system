import React, { useState } from 'react';
import testService from '../services/testService';
import authService from '../services/authService';

const TestConnection = () => {
  const [debugResponse, setDebugResponse] = useState('');
  const [publicResponse, setPublicResponse] = useState('');
  const [loginResponse, setLoginResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const testDebugEndpoint = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await testService.testDebugEndpoint();
      setDebugResponse(response);
    } catch (err) {
      setError(`Debug endpoint error: ${err.message}`);
      console.error('Debug test error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testPublicEndpoint = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await testService.testAllAccess();
      setPublicResponse(response);
    } catch (err) {
      setError(`Public endpoint error: ${err.message}`);
      console.error('Public test error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setError('');
    setLoginResponse('');
    try {
      const response = await authService.login('user', 'password');
      setLoginResponse(JSON.stringify(response, null, 2));
    } catch (err) {
      setError(`Login error: ${err.message}`);
      console.error('Login test error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Connection Test Page</h1>
      
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Debug Endpoint Test</h2>
        <button 
          onClick={testDebugEndpoint}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Test Debug Endpoint
        </button>
        {debugResponse && (
          <div className="mt-2 p-2 bg-gray-100 rounded">
            <p><strong>Response:</strong> {debugResponse}</p>
          </div>
        )}
      </div>

      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Public Endpoint Test</h2>
        <button 
          onClick={testPublicEndpoint}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Test Public Endpoint
        </button>
        {publicResponse && (
          <div className="mt-2 p-2 bg-gray-100 rounded">
            <p><strong>Response:</strong> {publicResponse}</p>
          </div>
        )}
      </div>

      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Login Test</h2>
        <button 
          onClick={testLogin}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Test Login (user/password)
        </button>
        {loginResponse && (
          <div className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
            <pre>{loginResponse}</pre>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {loading && (
        <div className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default TestConnection;
