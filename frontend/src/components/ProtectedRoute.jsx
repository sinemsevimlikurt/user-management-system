import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * ProtectedRoute bileşeni - Kimlik doğrulama gerektiren rotaları korur
 * Kullanıcı giriş yapmamışsa login sayfasına yönlendirir
 * Yönetici erişimi gerektiren rotalar için adminOnly parametresi kullanılabilir
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);
  const location = useLocation();
  
  // Eğer kimlik doğrulama durumu hala yükleniyor ise
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Eğer kullanıcı giriş yapmamışsa, login sayfasına yönlendir
  // Giriş yaptıktan sonra mevcut sayfaya dönebilmek için state'e mevcut konumu ekle
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Eğer admin rotası ise ve kullanıcı admin değilse, profil sayfasına yönlendir
  if (adminOnly && !isAdmin) {
    return <Navigate to="/profile" replace />;
  }
  
  // Kimlik doğrulama başarılı, çocuk bileşenleri göster
  return children;
};

export default ProtectedRoute;
