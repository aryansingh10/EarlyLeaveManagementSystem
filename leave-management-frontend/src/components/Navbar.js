import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Leave Management System</h1>
        <ul className="flex space-x-4">
          {!user ? (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
            </>
          ) : (
            <>
              {user.role === 'student' && (
                <>
                  <li>
                    <Link to="/submit-leave">Submit Leave</Link>
                  </li>
                  <li>
                    <Link to="/leave-history">Leave History</Link>
                  </li>
                </>
              )}

              {user.role === 'coordinator' && (
                <>
                  <li>
                    <Link to="/coordinator-leaves">Pending Leaves</Link>
                  </li>
                  <li>
                    <Link to="/approve-leave">Approve Leave</Link>
                  </li>
                </>
              )}

              {user.role === 'hod' && (
                <>
                  <li>
                    <Link to="/hod-leaves">Approved/Pending Leaves</Link>
                  </li>
                  <li>
                    <Link to="/approve-leave">Approve Leave</Link>
                  </li>
                </>
              )}

              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
