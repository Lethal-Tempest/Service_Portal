// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const stored = !user && localStorage.getItem("workerConnect_user");
  if (user || stored) return children;
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
