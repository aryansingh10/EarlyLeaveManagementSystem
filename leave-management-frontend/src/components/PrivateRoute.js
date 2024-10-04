import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Destructure `allowedRoles` prop to define which roles have access
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  
  if (!user || (allowedRoles && !allowedRoles.includes(user.user.role))) {
    return <Navigate to="/login" />;
  }


  return children;
};

export default PrivateRoute;
