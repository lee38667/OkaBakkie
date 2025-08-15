import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-content">
        <Link 
          to="/" 
          className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
        >
          <div className="nav-icon">🏠</div>
          <div className="nav-label">Home</div>
        </Link>
        
        <Link 
          to="/my-orders" 
          className={`nav-item ${location.pathname === '/my-orders' ? 'active' : ''}`}
        >
          <div className="nav-icon">📋</div>
          <div className="nav-label">Orders</div>
        </Link>
        
        <Link 
          to="/profile" 
          className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
        >
          <div className="nav-icon">👤</div>
          <div className="nav-label">Profile</div>
        </Link>
        
        <Link 
          to="/admin" 
          className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}
        >
          <div className="nav-icon">⚙️</div>
          <div className="nav-label">Admin</div>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
