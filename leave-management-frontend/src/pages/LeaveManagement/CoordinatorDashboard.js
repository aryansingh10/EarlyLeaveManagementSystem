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
        console.log(response.data);
        
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
      setLeaves(leaves.filter((leave) => leave._id !== leaveId));
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
      setLeaves(leaves.filter((leave) => leave._id !== leaveId));
    } catch (error) {
      toast.error('Error rejecting leave');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Coordinator Leave Approvals</h1>
      <ul className="space-y-4">
      {leaves.map((leave) => (
  <li key={leave._id} className="bg-white p-4 rounded-lg shadow-md">
    <p className="font-semibold">Name: {leave.studentId.name}</p>
    <p className="font-semibold">
      {leave.reason} (from {leave.startDate ? new Date(leave.startDate).toLocaleDateString() : 'N/A'} to{' '}
      {leave.endDate ? new Date(leave.endDate).toLocaleDateString() : 'N/A'}) - Status: 
      <span className={`font-bold ${leave.status === 'approved' ? 'text-green-500' : 'text-red-500'}`}>
        {leave.status}
      </span>
      {leave.isEarlyLeave && <span className="text-yellow-600"> (Early Leave)</span>}
    </p>
    <div className="flex space-x-2 mt-4">
      <button 
        onClick={() => handleApprove(leave._id)} 
        className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-500 transition duration-200"
      >
        Approve
      </button>
      <button 
        onClick={() => handleReject(leave._id)} 
        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-500 transition duration-200"
      >
        Reject
      </button>
      
    </div>
  </li>
))}

      </ul>
    </div>
  );
};

export default CoordinatorDashboard;