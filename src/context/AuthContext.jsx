import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();
const API_URL = 'http://localhost:8000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAdmin(parsedUser.isAdmin);
      
      // Verify token is still valid by fetching user profile
      const fetchUserProfile = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${parsedUser.token}`,
            },
          };
          
          await axios.get(`${API_URL}/users/profile`, config);
          // If request succeeds, token is valid
        } catch (error) {
          // If token is invalid or expired, log out the user
          console.error('Session expired or invalid', error);
          toast.error('Session expired. Please login again.');
          logout();
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const register = async (name, email, password) => {
    try {
      setError(null);
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        `${API_URL}/users`,
        { name, email, password },
        config
      );

      setUser(data);
      setIsAdmin(data.isAdmin);
      console.log(data);
      localStorage.setItem('user', JSON.stringify(data));
      toast.success('Registration successful');


      return data;
    } catch (error) {
      toast.error('Registration failed');
      const errorMessage = error.response && error.response.data.message
        ? error.response.data.message
        : 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      console.log(errorMessage);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Login attempt with:', email, password);
      setError(null);
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(
        `${API_URL}/users/login`,
        { email, password },
        config
      );
      
      // Ensure we're using the correct data structure from the response
      const userData = response.data || response;
      
      console.log('Login successful, user data:', userData);
      setUser(userData);
      setIsAdmin(userData.isAdmin);



      localStorage.setItem('user', JSON.stringify(userData));

      
      return userData;
    } catch (error) {
      const errorMessage = error.response && error.response.data.message
        ? error.response.data.message
        : 'Invalid email or password';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/users/profile`,
        userData,
        config
      );

      setUser(data);
      setIsAdmin(data.isAdmin);
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (error) {
      const errorMessage = error.response && error.response.data.message
        ? error.response.data.message
        : 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    isAdmin,
    isLoading,
    error,
    register,
    login,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
