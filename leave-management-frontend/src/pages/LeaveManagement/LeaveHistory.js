import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const LeaveHistory = () => {
  const [leaveHistory, setLeaveHistory] = useState([]);

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/leave/student/leave-history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLeaveHistory(response.data);
      } catch (error) {
        toast.error('Error fetching leave history');
      }
    };

    fetchLeaveHistory();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Leave History</h1>
      <ul className="space-y-4">
        {leaveHistory.map((leave) => (
          <li key={leave._id} className="bg-white p-4 rounded-lg shadow-md">
            <p className="font-semibold">{leave.reason}</p>
            <p className="text-gray-600">From: {leave.startDate} To: {leave.endDate} - Status: <span className={`font-bold ${leave.status === 'approved' ? 'text-green-500' : 'text-red-500'}`}>{leave.status}</span></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaveHistory;