import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const { register, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    
    // Form validation
    if (!formData.name.trim()) {
      setMessage("Username is required");
      return;
    }
    
    if (!formData.email.trim()) {
      setMessage("Email is required");
      return;
    }
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }
    
    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = formData;
      
      // Make sure we're sending the expected format
      const registerData = {
        name: userData.name,
        email: userData.email,
        password: userData.password
      };
      
      console.log('Registering user:', registerData);
      await register(registerData);
      
      setMessage('Registration successful! You can now login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Registration error:', error);
      const resMessage = error.response?.data?.message || 
                        "An error occurred during registration";
      setMessage(resMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8">
      <div className="px-8 py-10 mx-4 text-left bg-white shadow-xl rounded-xl w-full max-w-md">
        <div className="flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-center text-gray-800">User Management System</h3>
        <h4 className="text-xl font-medium text-center text-gray-600 mt-2">Create a new account</h4>
        
        <form onSubmit={handleRegister} className="mt-6">
          {message && (
            <Alert 
              type={message.includes('successful') ? 'success' : 'error'}
              message={message}
            />
          )}
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Username*</label>
              <input
                type="text"
                name="name"
                placeholder="Username"
                className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm hover:border-blue-300 transition-all duration-300"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Email*</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm hover:border-blue-300 transition-all duration-300"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Password*</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm hover:border-blue-300 transition-all duration-300"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Confirm Password*</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm hover:border-blue-300 transition-all duration-300"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-8">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              loadingText="Creating Account..."
            >
              Register
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
