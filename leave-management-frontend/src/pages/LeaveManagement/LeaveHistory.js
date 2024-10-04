import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const LeaveHistory = () => {
  const [leaveHistory, setLeaveHistory] = useState([]);

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/leave/student/leave-history', {
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
    <div>
      <h1>Leave History</h1>
      <ul>
        {leaveHistory.map((leave) => (
          <li key={leave._id}>
            {leave.reason} (from {leave.startDate} to {leave.endDate}) - Status: {leave.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaveHistory;
