import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Determine the route for LeaveSync based on user's login status
  const leaveSyncRedirect = user && user.user ? `/${user.user.role}-dashboard` : '/';

  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-white text-xl font-bold">
        <Link to={leaveSyncRedirect}>LeaveSync</Link>
        </div>

        {/* Hamburger Icon */}
        <button
          onClick={toggleMobileMenu}
          className="text-white text-2xl md:hidden focus:outline-none"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-4">
          {user && user.user ? (
            <>
              {user.user.role === 'student' && (
                <>
                  <li>
                    <Link to="/student-dashboard" className="text-white hover:text-blue-300 transition duration-200">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/student-profile" className="text-white hover:text-blue-300 transition duration-200">Profile</Link>
                  </li>
                </>
              )}
              {user.user.role === 'coordinator' && (
                <>
                  <li>
                    <Link to="/coordinator-dashboard" className="text-white hover:text-blue-300 transition duration-200">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/coordinator-profile" className="text-white hover:text-blue-300 transition duration-200">Profile</Link>
                  </li>
                  <li>
                    <Link to="/approved-leaves-today" className="text-white hover:text-blue-300 transition duration-200">Approved Leaves</Link>
                  </li>
                  <li>
                    <Link to="/leave-stats" className="text-white hover:text-blue-300 transition duration-200">Leave Stats</Link>
                  </li>
                  <li>
                    <Link to="/get-students" className="text-white hover:text-blue-300 transition duration-200">Approve Student</Link>
                  </li>
                </>
              )}
              {user.user.role === 'hod' && (
                <>
                  <li>
                    <Link to="/hod-dashboard" className="text-white hover:text-blue-300 transition duration-200">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/hod-profile" className="text-white hover:text-blue-300 transition duration-200">Profile</Link>
                  </li>
                  <li>
                    <Link to="/approved-leaves-today" className="text-white hover:text-blue-300 transition duration-200">Approved Leaves</Link>
                  </li>
                  <li>
                    <Link to="/leave-stats" className="text-white hover:text-blue-300 transition duration-200">Leave Stats</Link>
                  </li>
                </>
              )}
              <li>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition duration-200"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/" className="text-white hover:text-blue-300 transition duration-200">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-white hover:text-blue-300 transition duration-200">About</Link>
              </li>
              <li>
                <Link to="/login" className="text-white hover:text-blue-300 transition duration-200">Login</Link>
              </li>
              {/* <li>
                <Link to="/signup" className="text-white hover:text-blue-300 transition duration-200">Signup</Link>
              </li> */}
            </>
          )}
        </ul>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <ul className="md:hidden px-4 py-3 space-y-2 bg-blue-600">
          {user && user.user ? (
            <>
              {user.user.role === 'student' && (
                <>
                  <li>
                    <Link to="/student-dashboard" className="text-white block hover:text-blue-300 transition duration-200">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/student-profile" className="text-white block hover:text-blue-300 transition duration-200">Profile</Link>
                  </li>
                </>
              )}
              {user.user.role === 'coordinator' && (
                <>
                  <li>
                    <Link to="/coordinator-dashboard" className="text-white block hover:text-blue-300 transition duration-200">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/coordinator-profile" className="text-white block hover:text-blue-300 transition duration-200">Profile</Link>
                  </li>
                  <li>
                    <Link to="/approved-leaves-today" className="text-white block hover:text-blue-300 transition duration-200">Approved Leaves</Link>
                  </li>
                  <li>
                    <Link to="/leave-stats" className="text-white block hover:text-blue-300 transition duration-200">Leave Stats</Link>
                  </li>
                </>
              )}
              {user.user.role === 'hod' && (
                <>
                  <li>
                    <Link to="/hod-dashboard" className="text-white block hover:text-blue-300 transition duration-200">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/hod-profile" className="text-white block hover:text-blue-300 transition duration-200">Profile</Link>
                  </li>
                  <li>
                    <Link to="/approved-leaves-today" className="text-white block hover:text-blue-300 transition duration-200">Approved Leaves</Link>
                  </li>
                  <li>
                    <Link to="/leave-stats" className="text-white block hover:text-blue-300 transition duration-200">Leave Stats</Link>
                  </li>
                </>
              )}
              <li>
                <button
                  onClick={logout}
                  className="bg-red-500 w-full text-white py-2 rounded hover:bg-red-400 transition duration-200"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/" className="text-white block hover:text-blue-300 transition duration-200">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-white block hover:text-blue-300 transition duration-200">About</Link>
              </li>
              <li>
                <Link to="/login" className="text-white block hover:text-blue-300 transition duration-200">Login</Link>
              </li>
              <li>
                <Link to="/signup" className="text-white block hover:text-blue-300 transition duration-200">Signup</Link>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
