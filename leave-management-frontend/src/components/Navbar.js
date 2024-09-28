import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        {/* Show user-specific links based on authentication status */}
        {user && user.user ? (
          <>
            {user.user.role === 'student' && (
              <>
                <li><Link to="/student-dashboard">Dashboard</Link></li>
                <li><Link to="/student-profile">Profile</Link></li>
              </>
            )}
            {user.user.role === 'coordinator' && (
              <>
                <li><Link to="/coordinator-dashboard">Dashboard</Link></li>
                <li><Link to="/coordinator-profile">Profile</Link></li>
              </>
            )}
            {user.user.role === 'hod' && (
              <>
                <li><Link to="/hod-dashboard">Dashboard</Link></li>
                <li><Link to="/hod-profile">Profile</Link></li>
              </>
            )}
            <li><button onClick={logout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
