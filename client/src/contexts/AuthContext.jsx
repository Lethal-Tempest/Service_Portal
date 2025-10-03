// src/contexts/AuthContext.jsx
import axios from "axios";
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(undefined);

// Lazy read from localStorage so first render has the user
const readStoredUser = () => {
  try {
    const raw = localStorage.getItem("workerConnect_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  // Initialize once from storage
  const [user, setUser] = useState(readStoredUser);

  // Ensure axios Authorization is set when app starts or after login
  if (user?.token && !axios.defaults.headers.common["Authorization"]) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
  }

  const login = async (email, password, role) => {
    if (!email || !password || !role) {
      return { success: false, message: "Email, password, and role are required." };
    }

    const apiUrl =
      role === "customer"
        ? "https://service-portal-1.onrender.com/api/client/signin"
        : role === "worker"
        ? "https://service-portal-1.onrender.com/api/worker/signin"
        : "";

    if (!apiUrl) {
      return { success: false, message: "Invalid role specified." };
    }

    try {
      const response = await axios.post(apiUrl, { email, password });

      if (response.data?.success) {
        const token = response.data.token;
        const userData = response.data.user || {};
        // Build the stored user shape
        const finalUser = { ...userData, role, token };

        // Persist
        setUser(finalUser);
        localStorage.setItem("workerConnect_user", JSON.stringify(finalUser));

        // Set axios Authorization for all calls
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        return {
          success: true,
          message: "User logged in successfully",
          token,
          user: finalUser,
        };
      }

      return {
        success: false,
        message: response.data?.message || "Login failed.",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Network error or server unavailable.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("workerConnect_user");
    delete axios.defaults.headers.common["Authorization"];
  };

  const updateProfile = (updatedData) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...updatedData };
      localStorage.setItem("workerConnect_user", JSON.stringify(next));
      return next;
    });
  };

  const register = async (data, role) => {
    const apiUrl =
      role === "worker"
        ? "https://service-portal-1.onrender.com/api/worker/signup"
        : "https://service-portal-1.onrender.com/api/client/signup";

    try {
      const response = await axios.post(apiUrl, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.success) {
        const token = response.data.token;
        // Optional: If API also returns user, you can auto-login:
        // const userData = response.data.user || {};
        // const finalUser = { ...userData, role, token };
        // setUser(finalUser);
        // localStorage.setItem("workerConnect_user", JSON.stringify(finalUser));

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return true;
      }
      return false;
    } catch (error) {
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
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
