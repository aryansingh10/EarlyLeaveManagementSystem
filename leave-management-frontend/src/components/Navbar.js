import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaBars, FaTimes, FaCog } from 'react-icons/fa'; // Added FaCog for settings
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const leaveSyncRedirect = user && user.user ? `/${user.user.role}-dashboard` : '/';

  return (
    <nav className="bg-blue-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-white text-xl font-bold">
          <Link to={leaveSyncRedirect}>LeaveSync</Link>
        </div>

        <button
          onClick={toggleMobileMenu}
          className="text-white text-2xl md:hidden focus:outline-none"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className="hidden md:flex space-x-4 items-center">
          {user && user.user ? (
            <>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger className="text-white hover:text-blue-300 focus:outline-none">
                  <FaBars /> {/* Settings Icon */}
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="bg-white shadow-md rounded-md p-2">
                  {user.user.role === 'student' && (
                    <>
                      <DropdownMenu.Item className="px-2 py-1 hover:bg-blue-100 rounded">
                        <Link to="/student-dashboard">Dashboard</Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="px-2 py-1 hover:bg-blue-100 rounded">
                        <Link to="/student-profile">Profile</Link>
                      </DropdownMenu.Item>
                    </>
                  )}

                  {user.user.role === 'coordinator' && (
                    <>
                      <DropdownMenu.Item className="px-2 py-1 hover:bg-blue-100 hover:border-2 rounded">
                        <Link to="/coordinator-dashboard">Dashboard</Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="px-2 py-1 hover:bg-blue-100 rounded">
                        <Link to="/coordinator-profile">Profile</Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="px-2 py-1 hover:bg-blue-100 rounded">
                        <Link to="/approved-leaves-today">Approved Leaves</Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="px-2 py-1 hover:bg-blue-100 rounded">
                        <Link to="/leave-stats">Leave Stats</Link>
                      </DropdownMenu.Item>
                    </>
                  )}

                  {user.user.role === 'hod' && (
                    <>
                      <DropdownMenu.Item className="px-2 py-1 hover:bg-blue-100 rounded">
                        <Link to="/hod-dashboard">Dashboard</Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="px-2 py-1 hover:bg-blue-100 rounded">
                        <Link to="/hod-profile">Profile</Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="px-2 py-1 hover:bg-blue-100 rounded">
                        <Link to="/approved-leaves-today">Approved Leaves</Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="px-2 py-1 hover:bg-blue-100 rounded">
                        <Link to="/leave-stats">Leave Stats</Link>
                      </DropdownMenu.Item>
                    </>
                  )}
                  <DropdownMenu.Item className="px-2 py-1 hover:bg-red-400 rounded">
                    <button onClick={logout} className="w-full text-white py-2 rounded hover:bg-red-400 bg-red-600 transition duration-200">
                      Logout
                    </button>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
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
            </>
          )}
        </ul>
      </div>

      {isMobileMenuOpen && (
        <ul className="md:hidden px-4 py-3 space-y-2 bg-blue-700">
          {user && user.user ? (
            <>
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
            </>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
