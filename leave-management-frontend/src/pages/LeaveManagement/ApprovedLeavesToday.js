import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const ApprovedLeavesToday = () => {
  const [approvedLeaves, setApprovedLeaves] = useState([]);

  useEffect(() => {
    fetchApprovedLeaves();
  }, []);

  const fetchApprovedLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/leave/approved-leaves-for-day', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApprovedLeaves(response.data);
    } catch (error) {
      toast.error('Failed to fetch approved leaves for today');
    }
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Approved Leaves for Today</h1>

      {approvedLeaves.length > 0 ? (
        <ul className="list-disc pl-5">
          {approvedLeaves.map((leave) => (
            <li key={leave._id}>
              <p><strong>Student Name:</strong> {leave.studentId.name}</p>
              <p><strong>Enrollment Number:</strong> {leave.studentId.enrollmentNumber}</p>
              <p ><strong>Status</strong><strong className='text-green-500'>:{leave.finalStatus}</strong></p>
              {/* Format the start date using the formatDate function */}
              <p><strong>Start Date:</strong> {formatDate(leave.startDate)}</p>
              {/* Uncomment if needed: <p><strong>Coordinator:</strong> {leave.coordinator.name}</p> */}
              <hr className="my-4" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">No approved leaves for today.</p>
      )}
    </div>
  );
};

export default ApprovedLeavesToday;
