import React from "react";
import { Navigate } from "react-router-dom";

const isAdminAuthenticated = () => {
  const token = localStorage.getItem("token");
  const isStaff = localStorage.getItem("Stafftoken");
  const isManager = localStorage.getItem("Managertoken");
  return token && !isStaff && !isManager;
};

const AdminPrivateRoute = ({ children }) => {
  
  
  return isAdminAuthenticated() ? children : <Navigate to="/login" />;
};

export default AdminPrivateRoute;
