import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ApproveLeave = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/leave/coordinator-leaves', {
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

  const handleUpdateStatus = async (leaveId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        '/api/leave/update-status',
        { leaveId, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Leave status updated');
      setLeaves((prevLeaves) =>
        prevLeaves.map((leave) =>
          leave._id === leaveId ? { ...leave, status } : leave
        )
      );
    } catch (error) {
      toast.error('Error updating leave status');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Approve Leave</h1>
      <ul className="space-y-4">
        {leaves.map((leave) => (
          <li key={leave._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <p className="font-semibold">{leave.reason}</p>
              <p className="text-gray-600">From: {leave.startDate} To: {leave.endDate} - Status: <span className={`font-bold ${leave.status === 'approved' ? 'text-green-500' : 'text-red-500'}`}>{leave.status}</span></p>
            </div>
            <div>
              <button 
                onClick={() => handleUpdateStatus(leave._id, 'approved')} 
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 transition duration-200 mr-2"
              >
                Approve
              </button>
              <button 
                onClick={() => handleUpdateStatus(leave._id, 'rejected')} 
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400 transition duration-200"
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

export default ApproveLeave;