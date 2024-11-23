import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const CoordinatorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState({}); // For storing messages entered for each leave

  useEffect(() => {
    const fetchLeaves = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/leave/coordinator-leaves', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLeaves(response.data);
      } catch (err) {
        console.error("Error fetching leaves: ", err);
        setError('Error fetching leave requests');
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
    } catch (err) {
      console.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} leave: `, err);
      toast.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} leave`);
    }
  };

  const handleApprove = (leaveId) => updateLeaveStatus(leaveId, 'approved');
  const handleReject = (leaveId) => updateLeaveStatus(leaveId, 'rejected');

  const handleMessageChange = (leaveId, message) => {
    setMessages((prevMessages) => ({ ...prevMessages, [leaveId]: message }));
  };

  const handleAddMessage = async (leaveId) => {
    try {
      const token = localStorage.getItem('token');
      const message = messages[leaveId]; // Get the message for this leave request
      await api.post(`/messages/leave/${leaveId}/message`, { coordinatorMessage: message }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Message added successfully');
      setMessages((prevMessages) => ({ ...prevMessages, [leaveId]: `${message}` })); 

    } catch (err) {
      console.error('Error adding message: ', err);
      toast.error('Error adding message');
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center text-lg">Loading leave requests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Coordinator Leave Approvals</h1>

      {leaves.length === 0 ? (
        <div className="text-center text-lg">No leave requests found.</div>
      ) : (
        <ul className="space-y-4">
          {leaves.map((leave) => (
            <li key={leave._id} className="bg-white p-4 rounded-lg shadow-md">
              <p className="font-semibold">
                <span className="uppercase">{leave.studentId?.name}</span>
                <span className="text-gray-500"> ({leave.studentId?.enrollmentNumber})</span>
              </p>
              <div className="mt-2 p-2 bg-blue-50 border-l-4 border-blue-500 rounded-md">
                <p className="font-medium text-gray-800">
                  Reason: <span className="font-normal">{leave.reason}</span>
                </p>
              </div>

              {/* Display Parents Number with +91 Prefix */}
              <p className="mt-2">
                Parents Number: <span className="font-semibold">{leave.parentsNumber}</span>
              </p>

              <p className="mt-2">
                Date: {new Date(leave.startDate).toLocaleDateString('en-GB')}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                <span className={`px-2 py-1 rounded-full text-sm font-semibold ${leave.coordinatorApprovalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                    leave.coordinatorApprovalStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                  }`}>
                  Coordinator Status: {leave.coordinatorApprovalStatus}
                </span>
                {leave.isEarlyLeave && (
                  <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-semibold">
                    Early Leave
                  </span>
                )}
              </div>

              {/* Message Input and Button Above Approval Actions */}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder={
                    messages && messages[leave._id]
                      ? `Remark: ${messages[leave._id]}`
                      : "Enter a Remark regarding this leave"
                  }
                  value={messages && messages[leave._id] ? messages[leave._id] : ""}
                  onChange={(e) => handleMessageChange(leave._id, e.target.value)}
                  className="w-full p-2 border rounded"
                />

                <button
                  onClick={() => handleAddMessage(leave._id)}
                  className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-200"
                >
                  Add Remark
                </button>
              </div>

              {leave.coordinatorApprovalStatus === 'pending' ? (
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
                <p className="mt-2 text-gray-600">This leave request has been {leave.coordinatorApprovalStatus}.</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CoordinatorDashboard;