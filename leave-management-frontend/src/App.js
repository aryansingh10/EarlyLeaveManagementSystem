import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import PrivateRoute from './components/PrivateRoute';
import StudentDashboard from './pages/LeaveManagement/StudentDashboard';
import CoordinatorDashboard from './pages/LeaveManagement/CoordinatorDashboard';
import HODDashboard from './pages/LeaveManagement/HODDashboard';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Private routes */}
          <Route path="/student-dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
          <Route path="/coordinator-dashboard" element={<PrivateRoute><CoordinatorDashboard /></PrivateRoute>} />
          <Route path="/hod-dashboard" element={<PrivateRoute><HODDashboard /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
