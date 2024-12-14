import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";

const SubmitLeave = () => {
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isEarlyLeave, setIsEarlyLeave] = useState(false);
  const [parentsNumber, setParentsNumber] = useState("+91 "); // Start with +91 followed by a space
  const [coordinators, setCoordinators] = useState([]);
  const [selectedCoordinator, setSelectedCoordinator] = useState("");
  const { user } = useAuth();
  console.log(user.user.department);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setStartDate(today);
    setEndDate(today);
    fetchCoordinators();
  }, [today]);

  const fetchCoordinators = async () => {
    try {
      const response = await api.get("/auth/coordinators");
      setCoordinators(response.data);
    } catch (error) {
      toast.error("Failed to load coordinators");
    }
  };
  const token = localStorage.getItem("token");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/leave/submit", {
        reason,
        startDate,
        endDate,
        isEarlyLeave,
        parentsNumber,
        coordinatorId: selectedCoordinator,
        department: user.user.department,
      });
      toast.success("Leave submitted successfully");
      // Reset form fields
      setReason("");
      setStartDate(today);
      setEndDate(today);
      setIsEarlyLeave(false);
      setParentsNumber("+91 "); // Reset to default with space
      setSelectedCoordinator("");
    } catch (error) {
      const message = error.response?.data?.message || "Error submitting leave";
      toast.error(message);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Submit Leave</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto"
      >
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

        {!isEarlyLeave && (
          <>
            <div className="mb-4">
              <label className="block text-gray-600 mb-2"> Date:</label>
              <input
                type="date"
                value={startDate}
                min={today}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Parents Number:</label>
          <input
            type="text"
            value={parentsNumber}
            onChange={(e) => {
              // Allow only digits after +91 and space
              const inputValue = e.target.value;
              if (/^\+91\s\d*$/.test(inputValue)) {
                setParentsNumber(inputValue);
              }
            }}
            required
            minLength={14} // +91 followed by a space and 10 digits
            maxLength={14} // +91 followed by a space and 10 digits
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <small className="text-gray-500">Format: +91 XXXXXXXXXX</small>
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 mb-2">
            Select Coordinator:
          </label>
          <select
            value={selectedCoordinator}
            onChange={(e) => setSelectedCoordinator(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Coordinator</option>
            {coordinators.map((coordinator) => (
              <option key={coordinator._id} value={coordinator._id}>
                {coordinator.name} ({coordinator.email})
              </option>
            ))}
          </select>
        </div>

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
