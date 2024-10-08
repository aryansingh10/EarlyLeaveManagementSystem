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
import Navbar from './components/Navbar'; 
import SubmitLeave from './pages/LeaveManagement/SubmitLeave';
import LeaveHistory from './pages/LeaveManagement/LeaveHistory';
import About from './pages/About';

// Simple Error Page for 404
const NotFound = () => <h1>404 - Page Not Found</h1>;

// Home and About pages can be added separately if needed
const Home = () => <h1>Welcome to the Leave Management System</h1>;

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />

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

            {/* Submit Leave Route for students */}
            <Route
            path="/submit-leave"
            element={
              <PrivateRoute allowedRoles={['student']}>
                <SubmitLeave />
              </PrivateRoute>
            }
          />

          <Route
            path="/leave-history"
            element={
              <PrivateRoute allowedRoles={['student']}>
                <LeaveHistory />
              </PrivateRoute>
            }
          />


          {/* Fallback route for unauthorized access */}
          <Route path="/unauthorized" element={<h2>Unauthorized Access</h2>} />

          {/* Fallback route for undefined routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
