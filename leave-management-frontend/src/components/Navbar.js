import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-white text-xl font-bold" > <Link to="/">Leave Sync </Link></div>
        <ul className="flex space-x-4">

          {/* Show user-specific links based on authentication status */}
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
              <li>
                <Link
                  to="/signup"
                  className="text-white hover:text-blue-300 transition duration-200">
                  Signup
                </Link>
              </li>

            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;