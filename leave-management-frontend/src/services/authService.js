import api from "../utils/api"; // Assumes you have API setup for making requests

// Login function
const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    console.log("Login API Response:", response);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("Error during login:", error.response.data.message);
      throw error.response.data.message; // Pass backend message to the caller
    } else {
      console.error("Unexpected error:", error);
      throw new Error("Something went wrong. Please try again.");
    }
  }
};

// Signup function with conditional enrollmentNumber, class, and section for students
const signup = async (
  name,
  email,
  password,
  role,
  enrollmentNumber = null,
  userClass = null,
  year = null,
  department
) => {
  try {
    const data = {
      name,
      email,
      password,
      role,
      enrollmentNumber,
      userClass,
      year,
      department,
    };

    // Include enrollmentNumber, class, and section only for students
    if (role === "student") {
      data.enrollmentNumber = enrollmentNumber;
      data.class = userClass; // Renamed 'class' to 'userClass' to avoid JS reserved word
      data.year = year;
    }
    if (role === "coordinator") {
      data.class = userClass; // Renamed 'class' to 'userClass' to avoid JS reserved word
      data.year = year;
    }

    const response = await api.post("/auth/register", data);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    console.log("Signup API Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};

// Get current user from local storage
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

// Logout function
const logout = async () => {
  try {
    await api.post("/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export default { login, signup, getCurrentUser, logout };
