import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { Link } from 'react-router-dom';

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
        { leaveId, status: 'approved', role: 'hod' },
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
        { leaveId, status: 'rejected', role: 'hod' },
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
                <span className="font-semibold uppercase">
                  {leave.studentId?.name} 
                  <span className="text-gray-500"> ({leave.studentId?.enrollmentNumber})</span>
                </span>
              </p>
              <div className="mt-2 p-2 bg-blue-50 border-l-4 border-blue-500 rounded-md">
                <p className="font-medium text-gray-800">
                  Reason: <span className="font-normal">{leave.reason}</span>
                </p>
              </div>
              <p className="mt-2">
                From {new Date(leave.startDate).toLocaleDateString()} to{' '}
                {new Date(leave.endDate).toLocaleDateString()}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                  leave.finalStatus === 'approved' ? 'bg-green-100 text-green-800' : 
                  leave.finalStatus === 'rejected' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  Status: {leave.finalStatus}
                </span>
                <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                  leave.coordinatorApprovalStatus === 'approved' ? 'bg-green-100 text-green-800' : 
                  leave.coordinatorApprovalStatus === 'rejected' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  Coordinator: {leave.coordinatorApprovalStatus}
                </span>
                {leave.coordinatorId && (
                  <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
                    By: {leave.coordinatorId?.name}
                  </span>
                )}
                {leave.isEarlyLeave && (
                  <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-semibold">
                    Early Leave
                  </span>
                )}
              </div>
              <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-500 rounded-md">
                <p className="font-medium text-gray-800">
                  HOD Status: 
                  <span className={`ml-2 font-bold ${
                    leave.hodApprovalStatus === 'approved' ? 'text-green-600' : 
                    leave.hodApprovalStatus === 'rejected' ? 'text-red-600' : 
                    'text-yellow-600'
                  }`}>
                    {leave.hodApprovalStatus}
                  </span>
                </p>
              </div>
              {leave.hodApprovalStatus === 'pending' ? (
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
                <p className="mt-2 text-gray-600">Leave already processed by HOD</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center mt-4">No leave requests available</p>
      )}

  <button>
    <Link to="/approved-leaves" className="w-full max-w-xs">
      <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-500 transition duration-200">
        View Approved Leaves
      </button>
    </Link>
  </button>
    </div>
  );
};

export default HODDashboard;