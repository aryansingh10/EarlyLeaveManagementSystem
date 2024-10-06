import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api'; // Use api instead of axios

const SubmitLeave = () => {
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isEarlyLeave, setIsEarlyLeave] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        '/leave/submit', 
        { reason, startDate, endDate,isEarlyLeave},
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
            
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <label>
          <br />
        <br />
        <input
          type="checkbox"
          checked={isEarlyLeave}
          onChange={(e) => setIsEarlyLeave(e.target.checked)}
        />
        <br />
        Early Leave
      </label>
        </div>
        <button type="submit">Submit Leave</button>
      </form>
    </div>
  );
};

export default SubmitLeave;
