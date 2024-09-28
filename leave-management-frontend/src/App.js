import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import PrivateRoute from './components/PrivateRoute';
import StudentDashboard from './pages/LeaveManagement/StudentDashboard';
import CoordinatorDashboard from './pages/LeaveManagement/CoordinatorDashboard';
import HODDashboard from './pages/LeaveManagement/HODDashboard';
import StudentProfile from './pages/StudentProfile';
import CoordinatorProfile from './pages/CoordinatorProfile';
import HODProfile from './pages/HODProfile';
import Navbar from './components/Navbar'; // Import the Navbar component

const App = () => {
  return (
    <Router>
      <AuthProvider>
        {/* Navbar is always visible */}
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<h1>Home</h1>} />

          {/* Private routes with role-based access control */}
          <Route
            path="/student-dashboard"
            element={
              <PrivateRoute allowedRoles={['student']}>
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/coordinator-dashboard"
            element={
              <PrivateRoute allowedRoles={['coordinator']}>
                <CoordinatorDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/hod-dashboard"
            element={
              <PrivateRoute allowedRoles={['hod']}>
                <HODDashboard />
              </PrivateRoute>
            }
          />

          {/* Profile routes */}
          <Route
            path="/student-profile"
            element={
              <PrivateRoute allowedRoles={['student']}>
                <StudentProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/coordinator-profile"
            element={
              <PrivateRoute allowedRoles={['coordinator']}>
                <CoordinatorProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/hod-profile"
            element={
              <PrivateRoute allowedRoles={['hod']}>
                <HODProfile />
              </PrivateRoute>
            }
          />

          {/* Fallback route for unauthorized access */}
          <Route path="/unauthorized" element={<h2>Unauthorized Access</h2>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
