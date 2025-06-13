import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAdmin(parsedUser.role === 'admin');
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    // In a real app, you would validate credentials with an API
    // For this demo, we'll just store the user data
    const userWithRole = { ...userData, role: userData.email === 'admin@example.com' ? 'admin' : 'user' };
    setUser(userWithRole);
    setIsAdmin(userWithRole.role === 'admin');
    localStorage.setItem('user', JSON.stringify(userWithRole));
    return userWithRole;
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isAdmin,
    isLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
