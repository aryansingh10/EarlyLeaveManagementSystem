import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";

const StudentsTable = () => {
  const { user } = useAuth();

  // const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [notApprovedStudents, setNotApprovedStudents] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      console.log(user);
      setLoading(true);
      setError(null);

      const response = await api.get(
        `/user/get-students?department=${user.user.department}&class=${user.user.class}&year=${user.user.year}`
      );
      console.log(response);
      // setStudents(response.data.studentData);
      console.log(response.data.studentData);
      // console.log(students)
      if (response) {
        const {studentData} = response.data;
        // console.log(students)
        setNotApprovedStudents(
          studentData.filter((student) => !student.approvedStatus)
        );

        setApprovedStudents(
          studentData.filter((student) => student.approvedStatus)
        );
        console.log(notApprovedStudents);
        console.log(approvedStudents);
      } else {
        throw new Error("Failed to fetch students.");
      }
    } catch (err) {
      setError("Failed to fetch students.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.patch(`/user/approve-student/${id}`);

      // Find the approved student in the notApprovedStudents list
      const approvedStudent = notApprovedStudents.find(
        (student) => student._id === id
      );

      // Update the states
      setNotApprovedStudents(
        (prev) => prev.filter((student) => student._id !== id) // Remove from notApprovedStudents
      );
      setApprovedStudents((prev) => [
        ...prev,
        { ...approvedStudent, approvedStatus: true },
      ]); // Add to approvedStudents

      toast.success("Student approved successfully.");
      // fetchStudents(); // Refresh the list
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve the student.");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.delete(`/user/delete-student/${id}`);
      toast.success("Student rejected successfully.");
      fetchStudents(); // Refresh the list
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject the student.");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Students List: {user.user.class} {user.user.year}th Year
      </h1>

      {/* Table for Not Approved Students */}
      <h2 className="text-xl font-semibold mb-2">Pending Approval</h2>
      {notApprovedStudents.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300 mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Enrollment Number</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notApprovedStudents.map((student) => (
              <tr key={student._id} className="text-center">
                <td className="border border-gray-300 p-2">{student.name}</td>
                <td className="border border-gray-300 p-2">{student.email}</td>
                <td className="border border-gray-300 p-2">
                  {student.enrollmentNumber}
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleApprove(student._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(student._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No students pending approval.</p>
      )}

      {/* Table for Approved Students */}
      <h2 className="text-xl font-semibold mb-2">Approved Students</h2>
      {approvedStudents.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Enrollment Number</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvedStudents.map((student) => (
              <tr key={student._id} className="text-center">
                <td className="border border-gray-300 p-2">{student.name}</td>
                <td className="border border-gray-300 p-2">{student.email}</td>
                <td className="border border-gray-300 p-2">
                  {student.enrollmentNumber}
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleReject(student._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No approved students found.</p>
      )}
      <br>

      </br>
      <br>

      </br><br>

</br><br>

</br><br>

</br><br>

</br><br>

</br><br>

</br><br>

</br><br>

</br><br>

</br>

    </div>
  );
};

export default StudentsTable;
