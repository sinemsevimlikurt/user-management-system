import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { currentUser, isAuthenticated, isAdmin } = useContext(AuthContext);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If admin route but user is not admin, redirect to profile
  if (adminOnly && !isAdmin) {
    return <Navigate to="/profile" />;
  }
  
  return children;
};

export default PrivateRoute;
