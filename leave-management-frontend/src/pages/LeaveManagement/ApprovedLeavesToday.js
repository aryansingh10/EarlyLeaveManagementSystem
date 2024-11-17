import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const ApprovedLeavesToday = () => {
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('name'); 

  useEffect(() => {
    fetchApprovedLeaves();
  }, []);

  const fetchApprovedLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/leave/approved-leaves-for-day', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApprovedLeaves(response.data);
    } catch (error) {
      toast.error('Failed to fetch approved leaves for today');
    }
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Function to handle sorting
  const handleSort = (e) => {
    setSortOption(e.target.value);
  };

  // Filter and sort leaves based on search query and sort option
  const filteredAndSortedLeaves = approvedLeaves
    .filter((leave) =>
      leave.studentId.name.toLowerCase().includes(searchQuery) ||
      leave.studentId.enrollmentNumber.toLowerCase().includes(searchQuery)
    )
    .sort((a, b) => {
      if (sortOption === 'name') {
        return a.studentId.name.localeCompare(b.studentId.name);
      } else if (sortOption === 'date') {
        return new Date(a.startDate) - new Date(b.startDate);
      } else if (sortOption === 'enrollment') {
        return a.studentId.enrollmentNumber.localeCompare(b.studentId.enrollmentNumber);
      }
      return 0;
    });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Approved Leaves for Today</h1>
      
      {/* Search Input */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by student name or enrollment number"
          value={searchQuery}
          onChange={handleSearch}
          className="px-4 py-2 border rounded-lg focus:outline-none"
        />
      </div>
      
      {/* Sort Dropdown */}
      <div className="mb-4 flex justify-center">
        <label className="mr-2">Sort by:</label>
        <select value={sortOption} onChange={handleSort} className="px-4 py-2 border rounded-lg">
          <option value="name">Name</option>
          <option value="enrollment">Enrollment Number</option>
          <option value="date">Date</option>
        </select>
      </div>

      {filteredAndSortedLeaves.length > 0 ? (
        <ul className="list-disc pl-5">
          {filteredAndSortedLeaves.map((leave) => (
            <li key={leave._id}>
              <p><strong>Student Name:</strong> {leave.studentId.name}</p>
              <p><strong>Enrollment Number:</strong> {leave.studentId.enrollmentNumber}</p>
              <p><strong>Status</strong><strong className='text-green-500'>: {leave.finalStatus}</strong></p>
              <p><strong>Date:</strong> {formatDate(leave.startDate)}</p>
              <p><strong>Class:</strong> {leave.studentId.class}</p>
              <p><strong>Year:</strong> {leave.studentId.year}</p>
              <hr className="my-4" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center">No approved leaves for today.</p>
      )}
    </div>
  );
};

export default ApprovedLeavesToday;
