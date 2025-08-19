import React, { useState, useEffect } from 'react';
import BottomNavigation from '../components/BottomNavigation';

const Profile = () => {
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    // Load saved customer data from localStorage
    const storedPhone = localStorage.getItem('customerPhone');
    const storedName = localStorage.getItem('customerName');
    
    if (storedPhone) setCustomerPhone(storedPhone);
    if (storedName) setCustomerName(storedName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('customerPhone');
    localStorage.removeItem('customerName');
    setCustomerPhone('');
    setCustomerName('');
  };

  const profileMenuItems = [
    {
      icon: '📋',
      title: 'My Orders',
      subtitle: 'View your surprise bag orders',
      path: '/my-orders'
    },
    {
      icon: '❤️',
      title: 'Favorites',
      subtitle: 'Your favorite vendors',
      path: '/favorites',
      comingSoon: true
    },
    {
      icon: '🔔',
      title: 'Notifications',
      subtitle: 'Manage your notifications',
      path: '/notifications',
      comingSoon: true
    },
    {
      icon: '💳',
      title: 'Payment Methods',
      subtitle: 'Manage payment options',
      path: '/payment',
      comingSoon: true
    },
    {
      icon: '🌍',
      title: 'Language',
      subtitle: 'Change app language',
      path: '/language',
      comingSoon: true
    },
    {
      icon: '❓',
      title: 'Help & Support',
      subtitle: 'Get help and contact us',
      path: '/support',
      comingSoon: true
    },
    {
      icon: 'ℹ️',
      title: 'About OkaBakkie',
      subtitle: 'Learn more about our mission',
      path: '/about',
      comingSoon: true
    }
  ];

  return (
    <div className="mobile-container">
      <div className="content-wrapper">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {customerName ? customerName.charAt(0).toUpperCase() : '👤'}
          </div>
          <div className="profile-name">
            {customerName || 'Welcome to OkaBakkie'}
          </div>
          <div className="profile-email">
            {customerPhone || 'Please add your phone number in My Orders'}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Your Impact</h3>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr', 
            gap: 'var(--spacing-md)',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: 'var(--primary-color)' 
              }}>
                0
              </div>
              <div style={{ 
                fontSize: '0.8rem', 
                color: 'var(--text-secondary)' 
              }}>
                Bags Saved
              </div>
            </div>
            <div>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: 'var(--accent-color)' 
              }}>
                N$0
              </div>
              <div style={{ 
                fontSize: '0.8rem', 
                color: 'var(--text-secondary)' 
              }}>
                Money Saved
              </div>
            </div>
            <div>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                color: 'var(--danger-color)' 
              }}>
                0kg
              </div>
              <div style={{ 
                fontSize: '0.8rem', 
                color: 'var(--text-secondary)' 
              }}>
                Waste Reduced
              </div>
            </div>
          </div>
        </div>

        {/* Profile Menu */}
        <div className="profile-menu">
          {profileMenuItems.map((item, index) => (
            <div key={index} className="profile-menu-item">
              <div className="profile-menu-icon">{item.icon}</div>
              <div className="profile-menu-content">
                <div className="profile-menu-title">
                  {item.title}
                  {item.comingSoon && (
                    <span style={{ 
                      marginLeft: 'var(--spacing-sm)',
                      fontSize: '0.7rem',
                      background: 'var(--text-secondary)',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      Soon
                    </span>
                  )}
                </div>
                <div className="profile-menu-subtitle">{item.subtitle}</div>
              </div>
              <div className="profile-menu-arrow">›</div>
            </div>
          ))}
        </div>

        {/* App Info */}
        <div className="card" style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
          <div style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '0.9rem',
            marginBottom: 'var(--spacing-md)'
          }}>
            <div style={{ marginBottom: 'var(--spacing-sm)' }}>
              <strong>OkaBakkie v1.0</strong>
            </div>
            <div>Rescuing Food, Empowering Namibia</div>
          </div>
          
          {customerPhone && (
            <button 
              onClick={handleLogout}
              className="btn btn-outline"
              style={{ marginTop: 'var(--spacing-md)' }}
            >
              Clear My Data
            </button>
          )}
        </div>

        {/* Environmental Message */}
        <div style={{ 
          background: 'linear-gradient(135deg, var(--accent-color), #45A049)',
          color: 'white',
          padding: 'var(--spacing-lg)',
          borderRadius: 'var(--border-radius)',
          textAlign: 'center',
          margin: 'var(--spacing-lg) 0'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>🌱</div>
          <div style={{ fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>
            Fighting Food Waste Together
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Every surprise bag you buy helps reduce food waste and supports local businesses
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
