import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Destructure `allowedRoles` prop to define which roles have access
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // Check if user is authenticated and has an allowed role
  if (!user || (allowedRoles && !allowedRoles.includes(user.user.role))) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated or role not allowed
  }


  return children;
};

export default PrivateRoute;
