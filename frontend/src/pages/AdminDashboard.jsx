import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import userService from '../services/userService';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, isAdmin } = useContext(AuthContext);

  useEffect(() => {
    // Only fetch data if user is authenticated and admin
    if (isAuthenticated && isAdmin) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, isAdmin]);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Kullanıcılar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  // Access Denied component
  const AccessDenied = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl">
          <div className="p-8">
            <div className="flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center text-red-600 mb-2">Erişim Reddedildi</h2>
            <p className="text-gray-600 text-center mb-6">
              Bu sayfaya erişmek için admin yetkilerine sahip olmanız gerekmektedir.
            </p>
            <div className="flex justify-center">
              <Link to="/profile" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Profil Sayfasına Dön
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading spinner
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

  // Access denied if not admin
  if (!isAdmin) {
    return <AccessDenied />;
  }

  // Admin dashboard content
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Admin Panel
            </span>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Toplam Kullanıcı</h3>
                  <p className="text-3xl font-bold">{users.length}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Admin Kullanıcılar</h3>
                  <p className="text-3xl font-bold">
                    {users.filter(user => user.roles?.includes('ROLE_ADMIN')).length}
                  </p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Normal Kullanıcılar</h3>
                  <p className="text-3xl font-bold">
                    {users.filter(user => !user.roles?.includes('ROLE_ADMIN')).length}
                  </p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link to="/admin/users" className="block bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 transition-colors p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Kullanıcı Yönetimi</h3>
                  <p className="text-gray-600">Tüm kullanıcıları görüntüle, düzenle veya sil</p>
                </div>
              </div>
            </Link>
            
            <div className="block bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 transition-colors p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Sistem Ayarları</h3>
                  <p className="text-gray-600">Sistem ayarlarını yapılandır (Yakında)</p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 mb-6 text-sm rounded-lg text-red-700 bg-red-100">
              {error}
            </div>
          )}

          {/* Recent Users Table */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Son Eklenen Kullanıcılar</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı Adı</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roller</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.slice(0, 5).map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 whitespace-nowrap">{user.id}</td>
                      <td className="py-4 px-4 whitespace-nowrap">{user.name}</td>
                      <td className="py-4 px-4 whitespace-nowrap">{user.email}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {user.roles?.map((role, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded">
                              {role.replace('ROLE_', '')}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-4 px-4 text-center text-gray-500">
                        Kullanıcı bulunamadı
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <Link to="/admin/users" className="text-blue-600 hover:underline">
                Tüm kullanıcıları görüntüle →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
