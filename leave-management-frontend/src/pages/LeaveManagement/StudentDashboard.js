import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth from AuthContext

const StudentDashboard = () => {
  return (
    <div>
      <h1>Welcome to the Student Dashboard!</h1>
      
      {/* Button to redirect to the leave submission page */}
      <Link to="/submit-leave">
        <button style={{ marginTop: '20px', padding: '10px 20px' }}>
          Submit a Leave Request
        </button>
        <Link to="/leave-history">
        <button style={{ marginTop: '20px', padding: '10px 20px' }}>
          View Leave History
        </button>
        </Link>
  
      </Link>
    </div>
  );
};

export default StudentDashboard;
