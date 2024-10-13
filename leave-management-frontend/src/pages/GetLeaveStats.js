import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

function GetLeaveStats() {
  const { user } = useAuth();
  const [leaveStats, setLeaveStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaveStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/leave/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLeaveStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leave statistics:', error);
        setError('Error fetching leave statistics');
        setLoading(false);
      }
    };

    fetchLeaveStats();
  }, []);

  // Loading state
  if (loading) {
    return <div className="text-center text-lg">Loading leave statistics...</div>;
  }

  // Error state
  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Leave Statistics</h1>
      {leaveStats && leaveStats.length > 0 ? (
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-2 px-4 border-b">Student Name</th>
              <th className="py-2 px-4 border-b">Enrollment Number</th>
              <th className="py-2 px-4 border-b">Reason</th>
              <th className="py-2 px-4 border-b">Start Date</th>
              <th className="py-2 px-4 border-b">End Date</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveStats.map((leave) => (
              <tr key={leave._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{leave.studentId?.name}</td>
                <td className="py-2 px-4 border-b">{leave.studentId?.enrollmentNumber}</td>
                <td className="py-2 px-4 border-b">{leave.reason}</td>
                <td className="py-2 px-4 border-b">{new Date(leave.startDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{new Date(leave.endDate).toLocaleDateString()}</td>
                <td className={`py-2 px-4 border-b font-bold ${leave.finalStatus === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                  {leave.finalStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-lg">No leave statistics available.</div>
      )}
    </div>
  );
}

export default GetLeaveStats;