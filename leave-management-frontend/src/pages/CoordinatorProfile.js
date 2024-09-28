import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const CoordinatorProfile = () => {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <h1>Coordinator Profile</h1>
      <p>Name: {user.user.name}</p>
      <p>Email: {user.user.email}</p>
      {/* Add any coordinator-specific information here */}
    </div>
  );
};

export default CoordinatorProfile;
