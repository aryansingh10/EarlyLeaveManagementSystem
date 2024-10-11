import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { MdDelete } from "react-icons/md";

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

  const deleteLeave = async (id) => {
    try {
      console.log('Deleting leave with ID:', id); // Debugging line to check the ID
      const token = localStorage.getItem('token');
      const response = await api.delete(`/leave/leave/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response); // Debugging line to check the response 
      
      toast.success('Leave deleted successfully');
      // Filter out the deleted leave from the UI
      setLeaveHistory(leaveHistory.filter(leave => leave._id !== id));
    } catch (error) {
      console.error('Error deleting leave:', error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || 'Error deleting leave');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Leave History</h1>
      <ul className="space-y-4">
        {leaveHistory.map((leave) => (
          <li key={leave._id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <p className="font-semibold">{leave.reason}</p>
              <p className="text-gray-600">
                From: {new Date(leave.startDate).toLocaleDateString()} To: {new Date(leave.endDate).toLocaleDateString()} - Status: 
                <span className={`font-bold ${leave.status === 'approved' ? 'text-green-500' : 'text-red-500'}`}>
                  {leave.status}
                </span>
              </p>
            </div>
            <button 
              onClick={() => deleteLeave(leave._id)} 
              className="ml-4 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-500 transition duration-200 flex items-center"
            >
              <MdDelete className="mr-1" />
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeaveHistory;