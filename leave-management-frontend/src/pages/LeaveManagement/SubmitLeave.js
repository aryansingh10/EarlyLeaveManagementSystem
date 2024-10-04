import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api'; // Use api instead of axios

const SubmitLeave = () => {
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        '/leave/submit', // No need for `/api` since baseURL is already set in api instance
        { reason, startDate, endDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message || 'Leave submitted successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Error submitting leave';
      toast.error(message);
    }
  };

  return (
    <div>
      <h1>Submit Leave</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Reason for Leave:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Leave</button>
      </form>
    </div>
  );
};

export default SubmitLeave;
