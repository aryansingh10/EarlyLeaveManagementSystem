import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const CoordinatorDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const updateLeaveStatus = async (leaveId, status) => {
    try {
      const token = localStorage.getItem('token');
      await api.put('/leave/update-status', { leaveId, status }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(`Leave ${status} successfully`);
      setLeaves((prevLeaves) => 
        prevLeaves.filter((leave) => leave._id !== leaveId)
      );
    } catch (error) {
      toast.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} leave`);
    }
  };

  const handleApprove = (leaveId) => updateLeaveStatus(leaveId, 'approved');
  const handleReject = (leaveId) => updateLeaveStatus(leaveId, 'rejected');

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Coordinator Leave Approvals</h1>
      
      {loading ? (
        <div className="text-center text-lg">Loading leave requests...</div>
      ) : leaves.length === 0 ? (
        <div className="text-center text-lg">No leave requests found.</div>
      ) : (
        <ul className="space-y-4">
          {leaves.map((leave) => (
            <li key={leave._id} className="bg-white p-4 rounded-lg shadow-md">
              <p className="font-semibold">
                Name: 
                <span className="font-semibold uppercase">{leave.studentId.name}</span> 
                <span className="text-gray-500">({leave.studentId.enrollmentNumber})</span>
              </p>
              <div className="mt-2 p-2 bg-blue-50 border-l-4 border-blue-500 rounded-md">
                <p className="font-medium text-gray-800">
                  Reason: {leave.reason}
                </p>
              </div>
              <p className="font-semibold mt-2">
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
      )}
    </div>
  );
};

export default CoordinatorDashboard;
