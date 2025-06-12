import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const loadUser = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
          setCurrentUser(user);
          
          // Fetch user profile data
          try {
            const profileData = await authService.getUserProfile();
            setUserProfile(profileData);
          } catch (profileError) {
            console.error('Error loading user profile:', profileError);
            // If token is expired or invalid, logout
            if (profileError.response?.status === 401) {
              logout();
            }
          }
        }
      } catch (err) {
        console.error('Error parsing user data from localStorage:', err);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

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
      setError(err.response?.data?.message || 'Invalid username or password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.register(userData);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout(); // This removes the user from localStorage
    setCurrentUser(null);
    setUserProfile(null);
    setError(null);
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.roles?.includes('ROLE_ADMIN')
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
