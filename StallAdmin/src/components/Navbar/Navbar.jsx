import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ stallOwner, onLogout }) => {
  const location = useLocation();

  return (
    <nav className="stall-navbar">
      <div className="stall-navbar-brand">
        <h2>{stallOwner?.stallName || 'Stall Admin'}</h2>
      </div>
      <div className="stall-navbar-links">
        <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
          Dashboard
        </Link>
        <Link to="/orders" className={location.pathname === '/orders' ? 'active' : ''}>
          Orders
        </Link>
        <Link to="/menu" className={location.pathname === '/menu' ? 'active' : ''}>
          Menu
        </Link>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;

