import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('workerConnect_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // attach token to axios for future requests
      if (parsedUser?.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
      }
    }
  }, []);

  const login = async (email, password, role) => {
    if (!email || !password || !role) {
      return { success: false, message: "Email, password, and role are required." };
    }

    let apiUrl = '';
    if (role === 'customer') {
      apiUrl = 'http://localhost:5000/api/client/signin';
    } else if (role === 'worker') {
      apiUrl = 'http://localhost:5000/api/worker/signin';
    } else {
      return { success: false, message: "Invalid role specified." };
    }

    try {
      const response = await axios.post(apiUrl, { email, password });

      if (response.data.success) {
        const userData = response.data.user || {};
        const token = response.data.token;

        const finalUser = {
          ...userData,
          role,
          token
        };

        // Save user state
        setUser(finalUser);

        // Save whole user in localStorage
        localStorage.setItem('workerConnect_user', JSON.stringify(finalUser));

        // Set token for all axios calls
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        return {
          success: true,
          message: 'User logged in successfully',
          token,
          user: finalUser
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Login failed.'
        };
      }
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      return {
        success: false,
        message: error.response ? error.response.data.message : 'Network error or server unavailable.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('workerConnect_user');
    delete axios.defaults.headers.common['Authorization']; // clear token from axios
  };

  const updateProfile = (updatedData) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('workerConnect_user', JSON.stringify(updatedUser));
  };

  const register = async (data, role) => {
    let apiUrl = '';
    if (role === 'worker') {
      apiUrl = 'http://localhost:5000/api/worker/signup';
    } else {
      apiUrl = 'http://localhost:5000/api/client/signup';
    }

    try {
      const response = await axios.post(apiUrl, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        const token = response.data.token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration failed', error.response?.data?.message || error.message);
      return false;
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        updateProfile,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
