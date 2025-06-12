import { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Logout function defined early to avoid dependency issues
  const logout = useCallback(() => {
    authService.logout(); // This removes the user from localStorage
    setCurrentUser(null);
    setUserProfile(null);
    setError(null);
  }, []);

  // Check if token is expired
  const isTokenExpired = useCallback((token) => {
    try {
      // JWT token is base64 encoded with 3 parts separated by dots
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      const expirationTime = decodedPayload.exp * 1000; // Convert to milliseconds
      
      return Date.now() >= expirationTime;
    } catch (err) {
      console.error('Error checking token expiration:', err);
      return true; // If there's an error, consider the token expired
    }
  }, []);

  // Load user from localStorage on app initialization
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (user && user.token) {
          // Check if token is expired
          if (isTokenExpired(user.token)) {
            console.log('Token expired, logging out');
            logout();
            setLoading(false);
            setInitialLoadComplete(true);
            return;
          }
          
          setCurrentUser(user);
          
          // Fetch user profile data
          try {
            const profileData = await authService.getUserProfile();
            setUserProfile(profileData);
          } catch (profileError) {
            console.error('Error loading user profile:', profileError);
            // If token is expired or invalid, logout
            if (profileError.response?.status === 401 || profileError.response?.status === 403) {
              logout();
            }
          }
        }
      } catch (err) {
        console.error('Error parsing user data from localStorage:', err);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    };
    
    loadUser();
  }, [logout, isTokenExpired]);

  // Login function
  const login = async (name, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const data = await authService.login(name, password);
      setCurrentUser(data);
      
      // Fetch user profile after successful login
      try {
        const profileData = await authService.getUserProfile();
        setUserProfile(profileData);
      } catch (profileError) {
        console.error('Error loading user profile after login:', profileError);
      }
      
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Giriş başarısız. Lütfen kullanıcı adı ve şifrenizi kontrol edin.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.register(userData);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Kayıt işlemi başarısız oldu. Lütfen tekrar deneyin.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh user profile
  const refreshUserProfile = async () => {
    if (!currentUser) return null;
    
    try {
      const profileData = await authService.getUserProfile();
      setUserProfile(profileData);
      return profileData;
    } catch (err) {
      console.error('Error refreshing user profile:', err);
      if (err.response?.status === 401) {
        logout();
      }
      return null;
    }
  };

  // Check if user has specific role
  const hasRole = (roleName) => {
    return currentUser?.roles?.includes(roleName) || false;
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    initialLoadComplete,
    login,
    register,
    logout,
    refreshUserProfile,
    hasRole,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.roles?.includes('ROLE_ADMIN')
  };

  return (
    <AuthContext.Provider value={value}>
      {initialLoadComplete ? children : (
        <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-50 to-blue-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};
