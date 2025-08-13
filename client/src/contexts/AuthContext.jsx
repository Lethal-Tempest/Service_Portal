import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('workerConnect_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password, role) => {
    if (!email || !password || !role) {
      // Indicate failure if inputs are missing
      return { success: false, message: "Email, password, and role are required." };
    }

    let apiUrl = '';
    if (role === 'customer') {
      apiUrl = 'http://localhost:5000/api/client/signin';
    } else if (role === 'worker') {
      apiUrl = 'http://localhost:5000/api/worker/signin';
    } else {
      // Handle invalid role if necessary
      return { success: false, message: "Invalid role specified." };
    }
    console.log(role, apiUrl)

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

        // Assuming 'setUser' is a state setter function (e.g., from useState in React)
        // This updates your client-side application's user state.
        setUser(finalUser);
        localStorage.setItem('role', JSON.stringify(finalUser.role)); // Storing the whole user object is usually better
        localStorage.setItem('token', token);

        // Return success status and data for the caller of the login function
        return {
          success: true,
          message: 'User logged in successfully',
          token: token,
          user: finalUser // Optionally return the user data as well
        };
      } else {
        // If the API call was successful but the server indicated login failure
        console.log(role, apiUrl); // Still log for debugging if needed
        console.log(response)
        return {
          success: false,
          message: response.data.message || 'Login failed.'
        };
      }
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      // Return failure status and error message
      return {
        success: false,
        message: error.response ? error.response.data.message : 'Network error or server unavailable.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('workerConnect_user');
  };

  const updateProfile = (updatedData) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('workerConnect_user', JSON.stringify(updatedUser));
  };



  const register = async (data, role) => {
    let apiUrl = '';
    console.log(role, data)
    if (role === 'worker') {
      apiUrl = 'http://localhost:5000/api/worker/signup';
    } else {
      apiUrl = 'http://localhost:5000/api/client/signup';
    }

    try {
      const response = await axios.post(apiUrl, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      localStorage.setItem('token', response.data.token);
      return response.status === 201 || response.data.success;
    } catch (error) {
      console.log(error.message);
      console.error('Registration failed', error);
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
