const User = require("../models/User");
const sendEmail = require("../utils/nodemailer");

exports.getStudents = async (req, res) => {
  try {
    const { year, class: className, department } = req.query;

    // Build the query dynamically based on provided filters
    const query = { role: "student" }; // Ensure we're only fetching students

    if (year) {
      query.year = year; // Filter by year if provided
    }
    if (className) {
      query.class = className; // Filter by class if provided
    }
    if (department) {
      query.department = department; // Filter by department if provided
    }

    // Fetch students from the database
    const students = await User.find(query).select("-password"); // Exclude password field for security

    if (students.length === 0) {
      return res
        .status(404)
        .json({ message: "No students found for the given criteria." });
    }

    res.status(200).json({ success: true, studentData: students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching students.",
      error,
    });
  }
};

exports.approveStudents = async (req, res) => {
  const { id } = req.params; // Get the student's id from the request parameters

  try {
    // Find the user by ID and update the approvedStatus to true
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { approvedStatus: true },
      { new: true } // Return the updated user document
    );

    // Check if the user exists
    if (!updatedUser) {
      return res.status(404).json({ message: "Student not found" });
    }

    console.log(updatedUser)
    const subject = "Welcome to Leave Sync";
    const text = `Hello, ${updatedUser.name}! Welcome to Leave Sync. You are successfully Approved by coordinator as a ${updatedUser.role} in the ${updatedUser.department} department. So please login to access our application`;
    console.log(text)
    sendEmail(updatedUser.email, subject, text);

    res.status(200).json({
      success: true,
      message: "Student status approved successfully",
    });
  } catch (error) {
    console.error("Error approving student status:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while approving the student's status",
    });
  }
};

exports.deleteStudentById = async (req, res) => {
  const { id } = req.params; // Get the student's id from the request parameters

  try {
    // Find the user by ID and delete them
    const deletedUser = await User.findByIdAndDelete(id);

    // Check if the user exists
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the student",
    });
  }
};
