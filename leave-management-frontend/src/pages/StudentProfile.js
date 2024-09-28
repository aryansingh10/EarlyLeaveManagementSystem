import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const StudentProfile = () => {
  const { user } = useAuth();


  if (!user.user) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="profile-page">
      <h1>Student Profile</h1>
      <p>Name: {user.user.name}</p>
      <p>Email: {user.user.email}</p>

    </div>
  );
};

export default StudentProfile;
