import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const HODDashboard = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/leave/hod-leaves', {
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
      await api.put(
        '/leave/update-status',
        { leaveId, status: 'approved' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Leave approved successfully by HOD');
      // Remove the approved leave from the list
      setLeaves((prevLeaves) => prevLeaves.filter((leave) => leave._id !== leaveId));
    } catch (error) {
      toast.error('Error approving leave');
    }
  };

  const handleReject = async (leaveId) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(
        '/leave/update-status',
        { leaveId, status: 'rejected' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Leave rejected successfully by HOD');
      // Remove the rejected leave from the list
      setLeaves((prevLeaves) => prevLeaves.filter((leave) => leave._id !== leaveId));
    } catch (error) {
      toast.error('Error rejecting leave');
    }
  };

  return (
    <div>
      <h1>HOD Leave Approvals</h1>
      {leaves.length > 0 ? (
        <ul>
          {leaves.map((leave) => (
            <li key={leave._id}>
              <p>
                {leave.reason} (from {new Date(leave.startDate).toLocaleDateString()} to{' '}
                {new Date(leave.endDate).toLocaleDateString()}) - Status: {leave.status}
              </p>
              {leave.status === 'approved' ? (
                <>
                  <button onClick={() => handleApprove(leave._id)}>Approve</button>
                  <button onClick={() => handleReject(leave._id)}>Reject</button>
                </>
              ) : (
                <p>Coordinator has not approved this leave</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No leave requests available</p>
      )}
    </div>
  );
};

export default HODDashboard;
