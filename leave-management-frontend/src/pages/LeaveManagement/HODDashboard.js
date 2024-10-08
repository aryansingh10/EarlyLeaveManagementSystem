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
      setLeaves((prevLeaves) => prevLeaves.filter((leave) => leave._id !== leaveId));
    } catch (error) {
      toast.error('Error rejecting leave');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">HOD Leave Approvals</h1>
      {leaves.length > 0 ? (
        <ul className="space-y-4">
          {leaves.map((leave) => (
            <li key={leave._id} className="bg-white p-4 rounded-lg shadow-md">
              <p className="font-semibold">
                {leave.reason} (from {new Date(leave.startDate).toLocaleDateString()} to{' '}
                {new Date(leave.endDate).toLocaleDateString()}) - Status: 
                <span className={`font-bold ${leave.status === 'approved' ? 'text-green-500' : 'text-red-500'}`}>
                  {leave.status}
                </span>
                {leave.isEarlyLeave && <span className="text-yellow-600"> (Early Leave)</span>}
              </p>
              {leave.status === 'approved' || leave.status === 'rejected' ? (
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
              ) : (
                <p className="mt-2 text-gray-600">Coordinator has not approved this leave</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center mt-4">No leave requests available</p>
      )}
    </div>
  );
};

export default HODDashboard;