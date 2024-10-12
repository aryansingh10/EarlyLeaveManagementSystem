import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const StudentDashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Welcome to the Student Dashboard!</h1>
      
      <div className="flex flex-col items-center space-y-4">
        {/* Button to redirect to the leave submission page */}
        <Link to="/submit-leave" className="w-full max-w-xs">
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition duration-200">
            Submit a Leave Request
          </button>
        </Link>
        
        <Link to="/leave-history" className="w-full max-w-xs">
          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-500 transition duration-200">
            View Leave History
          </button>
        </Link>

     
      </div>
    </div>
  );
};

export default StudentDashboard;