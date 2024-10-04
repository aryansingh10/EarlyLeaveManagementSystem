import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const CoordinatorDashboard = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/leave/coordinator-leaves', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLeaves(response.data);
      } catch (error) {
        toast.error('Error fetching leave requests');
      }
    };

    fetchLeaves();
  }, []);

  const handleApprove = async (leaveId) => {
    try {
      const token = localStorage.getItem('token');
      await api.put('/leave/update-status', { leaveId, status: 'approved' }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Leave approved successfully');
      setLeaves(leaves.map((leave) => leave._id === leaveId ? { ...leave, status: 'approved' } : leave));
    } catch (error) {
      toast.error('Error approving leave');
    }
  };

  const handleReject = async (leaveId) => {
    try {
      const token = localStorage.getItem('token');
      await api.put('/leave/update-status', { leaveId, status: 'rejected' }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Leave rejected successfully');
      setLeaves(leaves.map((leave) => leave._id === leaveId ? { ...leave, status: 'rejected' } : leave));
    } catch (error) {
      toast.error('Error rejecting leave');
    }
  };

  return (
    <div>
      <h1>Coordinator Leave Approvals</h1>
      <ul>
        {leaves.map((leave) => (
          <li key={leave._id}>
            {leave.reason} (from {leave.startDate} to {leave.endDate}) - Status: {leave.status}
            <button onClick={() => handleApprove(leave._id)}>Approve</button>
            <button onClick={() => handleReject(leave._id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoordinatorDashboard;
