import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const StudentProfile = () => {
  const { user } = useAuth();

  if (!user.user) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Loading...</div>; 
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Student Profile</h1>
      <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto">
        <p className="text-lg font-semibold">Name: <span className="font-normal">{user.user.name}</span></p>
        <p className="text-lg font-semibold">Email: <span className="font-normal">{user.user.email}</span></p>
      </div>
    </div>
  );
};

export default StudentProfile;