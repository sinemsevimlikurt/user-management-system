import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import userService from '../services/userService';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser) {
          const data = await userService.getUserById(currentUser.id);
          setUserData({
            username: data.username,
            email: data.email,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
          });
        }
      } catch (error) {
        setMessage('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      await userService.updateUser(currentUser.id, userData);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setMessage('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">User Profile</h2>
          
          {message && (
            <div className={`p-4 mb-4 text-sm rounded-lg ${message.includes('successfully') ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  className="w-full px-4 py-2 border rounded-md bg-gray-100"
                  value={userData.username}
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 border rounded-md bg-gray-100"
                  value={userData.email}
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className={`w-full px-4 py-2 border rounded-md ${!isEditing ? 'bg-gray-100' : 'focus:outline-none focus:ring-1 focus:ring-blue-600'}`}
                  value={userData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className={`w-full px-4 py-2 border rounded-md ${!isEditing ? 'bg-gray-100' : 'focus:outline-none focus:ring-1 focus:ring-blue-600'}`}
                  value={userData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
