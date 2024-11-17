import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

function GetLeaveStats() {
  const { user } = useAuth();
  const [leaveStats, setLeaveStats] = useState(null);
  const [filteredLeaveStats, setFilteredLeaveStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');

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
        setFilteredLeaveStats(response.data); // Initially, filtered stats match the fetched data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leave statistics:', error);
        setError('Error fetching leave statistics');
        setLoading(false);
      }
    };

    fetchLeaveStats();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Filter by search term
    if (leaveStats) {
      const filteredStats = {
        approvedLeaves: leaveStats.approvedLeaves.filter((leave) => {
          const student = leave.studentId;
          return (
            (student && student.name.toLowerCase().includes(term.toLowerCase())) ||
            (student && student.enrollmentNumber && student.enrollmentNumber.includes(term)) ||
            (student && student.class && student.class.toLowerCase().includes(term.toLowerCase())) ||
            (student && student.year && student.year.toString().includes(term))
          );
        }),
        pendingLeaves: leaveStats.pendingLeaves.filter((leave) => {
          const student = leave.studentId;
          return (
            (student && student.name.toLowerCase().includes(term.toLowerCase())) ||
            (student && student.enrollmentNumber && student.enrollmentNumber.includes(term)) ||
            (student && student.class && student.class.toLowerCase().includes(term.toLowerCase())) ||
            (student && student.year && student.year.toString().includes(term))
          );
        }),
      };
      setFilteredLeaveStats(filteredStats);
    }
  };

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);

    if (filteredLeaveStats) {
      const sortData = (leaves) => {
        return leaves.sort((a, b) => {
          if (option === 'name') {
            return (a.studentId?.name || '').localeCompare(b.studentId?.name || '');
          } else if (option === 'date') {
            return new Date(a.startDate) - new Date(b.startDate);
          } else if (option === 'class') {
            return (a.studentId?.class || '').localeCompare(b.studentId?.class || '');
          } else if (option === 'year') {
            return (a.studentId?.year || 0) - (b.studentId?.year || 0);
          }
          return 0;
        });
      };
      

      setFilteredLeaveStats({
        approvedLeaves: sortData([...filteredLeaveStats.approvedLeaves]),
        pendingLeaves: sortData([...filteredLeaveStats.pendingLeaves]),
      });
    }
  };

  if (loading) {
    return <div className="text-center text-lg">Loading leave statistics...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

  if (!filteredLeaveStats) {
    return <div className="text-center text-lg">No leave statistics available.</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Leave Statistics</h1>

      <div className="mb-6 flex justify-center space-x-4">
        {/* Search input */}
        <input
          type="text"
          placeholder="Search by name, enrollment number, class, or year"
          value={searchTerm}
          onChange={handleSearch}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
        />

        {/* Sort dropdown */}
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="">Sort By</option>
          <option value="name">Student Name</option>
          <option value="date">Date</option>
          <option value="class">Class</option>
          <option value="year">Year</option>
        </select>
      </div>

      {/* Approved Leaves Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Approved Leaves</h2>
        {filteredLeaveStats.approvedLeaves && filteredLeaveStats.approvedLeaves.length > 0 ? (
          <table className="min-w-full bg-white rounded-lg shadow-md mb-6">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-2 px-4 border-b">Student Name</th>
                <th className="py-2 px-4 border-b">Enrollment Number</th>
                <th className="py-2 px-4 border-b">Reason</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Class</th>
                <th className="py-2 px-4 border-b">Year</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaveStats.approvedLeaves.map((leave) => (
                <tr key={leave._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{leave.studentId.name}</td>
                  <td className="py-2 px-4 border-b">{leave.studentId?.enrollmentNumber}</td>
                  <td className="py-2 px-4 border-b">{leave.reason}</td>
                  <td className="py-2 px-4 border-b">{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td className='py-2 px-4 border-b'> {leave.studentId.class} </td>
                  <td className='py-2 px-4 border-b'> {leave.studentId.year} </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-lg">No approved leaves available.</div>
        )}
      </div>

      {/* Pending Leaves Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Pending Leaves</h2>
        {filteredLeaveStats.pendingLeaves && filteredLeaveStats.pendingLeaves.length > 0 ? (
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-2 px-4 border-b">Student Name</th>
                <th className="py-2 px-4 border-b">Enrollment Number</th>
                <th className="py-2 px-4 border-b">Reason</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Class</th>
                <th className="py-2 px-4 border-b">Year</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaveStats.pendingLeaves.map((leave) => (
                <tr key={leave._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{leave.studentId?.name}</td>
                  <td className="py-2 px-4 border-b">{leave.studentId?.enrollmentNumber}</td>
                  <td className="py-2 px-4 border-b">{leave.reason}</td>
                  <td className="py-2 px-4 border-b">{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td className='py-2 px-4 border-b'> {leave.studentId.class} </td>
                  <td className='py-2 px-4 border-b'> {leave.studentId.year} </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-lg">No pending leaves available.</div>
        )}
      </div>
    </div>
  );
}

export default GetLeaveStats;
