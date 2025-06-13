import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = '/api';

export default function UserManagementPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    isAdmin: false,
    status: 'active'
  });
  
  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);
  
  // Fetch users from API
  useEffect(() => {
    if (isAdmin && user?.token) {
      fetchUsers();
    }
  }, [isAdmin, user]);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const { data } = await axios.get(`${API_URL}/users`, config);
      
      // Transform API data to match our component structure
      const formattedUsers = data.map(apiUser => ({
        id: apiUser._id,
        name: apiUser.name,
        email: apiUser.email,
        role: apiUser.isAdmin ? 'admin' : 'user',
        status: !apiUser.isActive ? 'inactive' : 'active',
        createdAt: new Date(apiUser.createdAt).toISOString().split('T')[0],
        isAdmin: apiUser.isAdmin
      }));
      
      setUsers(formattedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please try again.');
      
      // Fallback to empty list or mock data if needed
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'role') {
      // Update isAdmin when role changes
      setFormData({
        ...formData,
        [name]: value,
        isAdmin: value === 'admin'
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Validate form
      if (!formData.name || !formData.email) {
        setError('Please fill in all required fields');
        return;
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      // Transform our UI model to API model
      const userData = {
        name: formData.name,
        email: formData.email,
        isAdmin: formData.role === 'admin',
      };
      
      // Add password only for new users or if password is changed
      if (!isEditing || (isEditing && formData.password)) {
        userData.password = formData.password;
      }
      
      let result;
      if (isEditing && currentUser) {
        // Update existing user
        result = await axios.put(
          `${API_URL}/users/${currentUser.id}`,
          userData,
          config
        );
        
        // Update local state
        const updatedUser = {
          id: result.data._id,
          name: result.data.name,
          email: result.data.email,
          role: result.data.isAdmin ? 'admin' : 'user',
          status: result.data.isActive ? 'active' : 'inactive',
          createdAt: new Date(result.data.createdAt).toISOString().split('T')[0],
          isAdmin: result.data.isAdmin
        };
        
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      } else {
        // Add new user
        result = await axios.post(
          `${API_URL}/users`,
          userData,
          config
        );
        
        // Add to local state
        const newUser = {
          id: result.data._id,
          name: result.data.name,
          email: result.data.email,
          role: result.data.isAdmin ? 'admin' : 'user',
          status: result.data.isActive ? 'active' : 'inactive',
          createdAt: new Date(result.data.createdAt).toISOString().split('T')[0],
          isAdmin: result.data.isAdmin
        };
        
        setUsers([...users, newUser]);
      }
      
      resetForm();
    } catch (err) {
      console.error('Error saving user:', err);
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Failed to save user. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (user) => {
    setIsEditing(true);
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Leave password empty for editing
      role: user.role,
      isAdmin: user.isAdmin,
      status: user.status
    });
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        setError(null);
        
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        
        await axios.delete(`${API_URL}/users/${id}`, config);
        
        // Remove from local state
        setUsers(users.filter(user => user.id !== id));
      } catch (err) {
        console.error(`Error deleting user ${id}:`, err);
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : 'Failed to delete user. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    }
  };
  
  const handleStatusToggle = async (id, currentStatus) => {
    try {
      setLoading(true);
      setError(null);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const targetUser = users.find(u => u.id === id);
      if (!targetUser) return;
      
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      
      // Update user with new status
      const { data } = await axios.put(
        `${API_URL}/users/${id}`,
        { isActive: newStatus === 'active' },
        config
      );
      
      // Update local state
      setUsers(users.map(user => 
        user.id === id ? { ...user, status: newStatus } : user
      ));
    } catch (err) {
      console.error(`Error updating user status ${id}:`, err);
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Failed to update user status. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setIsEditing(false);
    setCurrentUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
      isAdmin: false,
      status: 'active'
    });
  };
  
  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }
  
  if (loading && users.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-gray-500">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <button
          onClick={() => navigate('/admin')}
          className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Back to Products
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? 'Edit User' : 'Add New User'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                  <p>{error}</p>
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                  Password {isEditing ? '(Leave blank to keep current)' : '*'}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required={!isEditing}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
                  Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={loading}
                >
                  {loading ? (
                    <span>Loading...</span>
                  ) : (
                    <span>{isEditing ? 'Update' : 'Add'} User</span>
                  )}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading && users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      <div className="flex justify-center items-center">
                        <div className="text-center">Loading users...</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleStatusToggle(user.id, user.status)}
                          className={`mr-3 ${
                            user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                          }`}
                          disabled={loading}
                        >
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
                
                {!loading && users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No users available. Add your first user!
                    </td>
                  </tr>
                )}
                {error && users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-red-500">
                      Error: {error}. Please try refreshing the page.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
