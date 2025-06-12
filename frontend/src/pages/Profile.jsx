import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { currentUser, userProfile, logout, isAuthenticated } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        // If we already have the user profile in context, use it
        if (userProfile) {
          setUserData(userProfile);
          setLoading(false);
          return;
        }

        // Otherwise fetch it from the API
        const data = await authService.getUserProfile();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage('Failed to load user data. Please try again later.');
        
        // If unauthorized, logout and redirect
        if (error.response?.status === 401) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, navigate, userProfile, logout]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {currentUser?.roles?.includes('ROLE_ADMIN') ? 'Admin' : 'User'}
              </span>
            </div>
          </div>
          
          {message && (
            <div className={`p-4 mb-6 text-sm rounded-lg ${message.includes('successfully') ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
              {message}
            </div>
          )}
          
          {userData && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                    <div className="text-gray-900 font-semibold">{userData.id}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <div className="text-gray-900 font-semibold">{userData.name}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="text-gray-900 font-semibold">{userData.email}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Roles</label>
                    <div className="flex flex-wrap gap-2">
                      {userData.roles?.map((role, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded">
                          {role.replace('ROLE_', '')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="px-6 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors duration-300"
                >
                  Logout
                </button>
                
                {currentUser?.roles?.includes('ROLE_ADMIN') && (
                  <button
                    type="button"
                    onClick={() => navigate('/admin/users')}
                    className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
                  >
                    Manage Users
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
