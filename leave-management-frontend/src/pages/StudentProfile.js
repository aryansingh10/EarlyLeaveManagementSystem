import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const StudentProfile = () => {
  const { user } = useAuth();

  // Handle the case where the user is not available
  if (!user.user) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-100">Loading...</div>; 
  }

  // Extract the first letter of the user's name
  const firstLetter = user.user.name.charAt(0).toUpperCase();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Student Profile</h1>
      
      <div className="bg-white p-4 rounded-lg shadow-md max-w-md mx-auto">
        {/* Profile Icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center justify-center bg-blue-600 text-white rounded-full h-14 w-14 text-4xl font-bold">
            {firstLetter}
          </div>
        </div>

        {/* Student Information */}
        <p className="text-lg font-semibold">Name: <span className="font-normal">{user.user.name}</span></p>
        <p className="text-lg font-semibold">Email: <span className="font-normal">{user.user.email}</span></p>
        <p className="text-lg font-semibold">Enrollment Number: <span className="font-normal">{user.user.enrollmentNumber}</span></p>
        <p className="text-lg font-semibold">Year: <span className="font-normal">{user.user.year}</span></p>
        <p className="text-lg font-semibold">Class/Section: <span className="font-normal">{user.user.class}</span></p>
      </div>
    </div>
  );
};

export default StudentProfile;
