import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const SubmitLeave = () => {
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isEarlyLeave, setIsEarlyLeave] = useState(false);

  const today = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

  useEffect(() => {
    setStartDate(today);
    setEndDate(today);
  }, [today]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        '/leave/submit', 
        { reason, startDate, endDate, isEarlyLeave },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message || 'Leave submitted successfully');
      setReason('');
      setStartDate(today);
      setEndDate(today);
      setIsEarlyLeave(false);
    } catch (error) {
      const message = error.response?.data?.message || 'Error submitting leave';
      
      if (message === 'You have already applied for leave today.') {
        toast.error('You have already applied for leave today. Please try again tomorrow.');
      } else {
        toast.error(message);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Submit Leave</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Reason for Leave:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            rows="4"
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {!isEarlyLeave && ( // Conditionally render the date inputs based on isEarlyLeave
          <>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">Start Date:</label>
              <input
                type="date"
                value={startDate}
                min={today}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2">End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={isEarlyLeave}
            onChange={(e) => setIsEarlyLeave(e.target.checked)}
            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-gray-600">Early Leave</label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500 transition duration-200"
        >
          Submit Leave
        </button>
      </form>
    </div>
  );
};

export default SubmitLeave;