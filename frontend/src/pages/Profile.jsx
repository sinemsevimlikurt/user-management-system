import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { currentUser, userProfile, logout, isAuthenticated, refreshUserProfile } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error'); // 'error' or 'success'
  const navigate = useNavigate();

  // JWT token'dan alınan bilgileri çöz ve göster
  const decodeJwtToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  };

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
        setMessage('Kullanıcı bilgileri yüklenemedi. Lütfen daha sonra tekrar deneyin.');
        setMessageType('error');
        
        // If unauthorized, logout and redirect
        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, navigate, userProfile, logout]);
  
  // Kullanıcı bilgilerini yenile
  const handleRefreshProfile = async () => {
    setRefreshing(true);
    setMessage('');
    
    try {
      const refreshedData = await refreshUserProfile();
      if (refreshedData) {
        setUserData(refreshedData);
        setMessage('Kullanıcı bilgileri başarıyla güncellendi.');
        setMessageType('success');
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
      setMessage('Kullanıcı bilgileri güncellenemedi.');
      setMessageType('error');
    } finally {
      setRefreshing(false);
    }
  };

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

  // JWT token bilgilerini çöz
  const jwtData = currentUser?.token ? decodeJwtToken(currentUser.token) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Kullanıcı Profili</h2>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {currentUser?.roles?.includes('ROLE_ADMIN') ? 'Admin' : 'Kullanıcı'}
              </span>
              <button
                onClick={handleRefreshProfile}
                disabled={refreshing}
                className="p-1 rounded-full hover:bg-gray-100"
                title="Profil bilgilerini yenile"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
          
          {message && (
            <div className={`p-4 mb-6 text-sm rounded-lg ${messageType === 'success' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
              {message}
            </div>
          )}
          
          {userData && (
            <div className="space-y-6">
              {/* Kullanıcı Bilgileri */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Kullanıcı Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı ID</label>
                    <div className="text-gray-900 font-semibold">{userData.id}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
                    <div className="text-gray-900 font-semibold">{userData.name}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                    <div className="text-gray-900 font-semibold">{userData.email}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Roller</label>
                    <div className="flex flex-wrap gap-2">
                      {userData.roles?.map((role, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded">
                          {typeof role === 'string' ? role.replace('ROLE_', '') : role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* JWT Token Bilgileri */}
              {jwtData && (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">JWT Token Bilgileri</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject (sub)</label>
                      <div className="text-gray-900 font-mono text-sm bg-gray-100 p-2 rounded">{jwtData.sub}</div>
                    </div>
                    
                    {jwtData.roles && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Roller</label>
                        <div className="text-gray-900 font-mono text-sm bg-gray-100 p-2 rounded">
                          {JSON.stringify(jwtData.roles)}
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Oluşturulma Zamanı (iat)</label>
                        <div className="text-gray-900 font-mono text-sm bg-gray-100 p-2 rounded">
                          {jwtData.iat ? new Date(jwtData.iat * 1000).toLocaleString() : 'N/A'}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Geçerlilik Süresi (exp)</label>
                        <div className="text-gray-900 font-mono text-sm bg-gray-100 p-2 rounded">
                          {jwtData.exp ? new Date(jwtData.exp * 1000).toLocaleString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Token (kısaltılmış)</label>
                      <div className="text-gray-900 font-mono text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                        {currentUser?.token.substring(0, 20)}...{currentUser?.token.substring(currentUser.token.length - 20)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Butonlar */}
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="px-6 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors duration-300"
                >
                  Çıkış Yap
                </button>
                
                {currentUser?.roles?.includes('ROLE_ADMIN') && (
                  <button
                    type="button"
                    onClick={() => navigate('/admin/users')}
                    className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
                  >
                    Kullanıcıları Yönet
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
