import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !password) {
      setError('Username and password are required');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      // Call login function from AuthContext
      const response = await login(name, password);
      
      // Store JWT token in localStorage (handled in AuthContext)
      console.log('Login successful:', response);
      
      // Redirect to profile page
      navigate('/profile');
    } catch (error) {
      console.error('Login error:', error);
      const resMessage = error.response?.data?.message || 
                        "Invalid username or password";
      setError(resMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      {/* Card with shadow */}
      <div className="w-full max-w-[800px] min-w-[600px] min-h-[500px] sm:min-h-[550px] md:min-h-[600px] bg-blue-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden mx-auto">
        <div className="flex flex-col h-full">
          {/* Login form */}
          <div className="w-full p-10 sm:p-12 md:p-16 flex items-center justify-center h-full">
            <div className="w-full max-w-[500px] mx-auto px-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-10">Welcome Back!</h2>
              
              <form onSubmit={handleLogin} className="mt-8 sm:mt-10 space-y-8 sm:space-y-10">
                {error && <Alert type="error" message={error} />}
                
                <div className="space-y-3 sm:space-y-4">
                  <label className="block text-base sm:text-lg md:text-xl font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-4 sm:py-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-blue-300 transition-all duration-300"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                
                <div className="space-y-3 sm:space-y-4 mt-6">
                  <label className="block text-base sm:text-lg md:text-xl font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-4 sm:py-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:border-blue-300 transition-all duration-300"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                <div className="flex items-center mt-6">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 sm:ml-3 block text-base sm:text-lg text-gray-700">
                    Remember Me
                  </label>
                </div>
                
                <div className="mt-10 sm:mt-12">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    loadingText="Signing In..."
                    className="text-base sm:text-lg md:text-xl py-4 sm:py-5"
                  >
                    Sign In
                  </Button>
                </div>
              </form>
              
              {/* Vertically stacked links */}
              <div className="flex flex-col items-center space-y-6 sm:space-y-8 mt-12 sm:mt-14 text-center">
                <Link to="/register" className="text-base sm:text-lg md:text-xl text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200 py-1">
                  Create an Account!
                </Link>
                <Link to="/forgot-password" className="text-base sm:text-lg md:text-xl text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200 py-1">
                  Forgot Password?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
