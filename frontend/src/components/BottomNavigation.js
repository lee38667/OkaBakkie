import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    {
      path: '/',
      icon: '🏠',
      label: 'Home',
      active: location.pathname === '/'
    },
    {
      path: '/my-orders',
      icon: '📋',
      label: 'Orders',
      active: location.pathname === '/my-orders'
    },
    {
      path: '/profile',
      icon: '👤',
      label: 'Profile',
      active: location.pathname === '/profile'
    },
    {
      path: '/admin',
      icon: '⚙️',
      label: 'Admin',
      active: location.pathname === '/admin'
    }
  ];

  return (
    <nav className="bottom-nav">
      <div className="nav-container">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${item.active ? 'active' : ''}`}
          >
            <div className="nav-icon">{item.icon}</div>
            <div className="nav-label">{item.label}</div>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
