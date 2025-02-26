// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

// Function to check authentication status from localStorage
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; // Returns true if token exists, otherwise false
};

const AdminPrivateRoute = ({ children }) => {
    console.log(isAuthenticated());
    
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default AdminPrivateRoute;
