import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const HODProfile = () => {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <h1>HOD Profile</h1>
      <p>Name: {user.user.name}</p>
      <p>Email: {user.user.email}</p>
   
    </div>
  );
};

export default HODProfile;
