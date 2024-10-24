import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const CoordinatorProfile = () => {
  const { user } = useAuth();

  const firstLetter = user.user.name.charAt(0).toUpperCase();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Coordinator Profile</h1>
      <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center justify-center bg-blue-600 text-white rounded-full h-14 w-14 text-4xl font-bold">
            {firstLetter}
          </div>
        </div>
        
        <p className="text-lg font-semibold">Name: <span className="font-normal">{user.user.name}</span></p>
        <p className="text-lg font-semibold">Email: <span className="font-normal">{user.user.email}</span></p>
      </div>
    </div>
  );
};

export default CoordinatorProfile;