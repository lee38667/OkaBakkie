import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';

const Profile = () => {
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+264 61 123 4567',
    joinDate: 'January 2024',
    stats: {
      totalOrders: 12,
      savedMoney: 245,
      bagsRescued: 18
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserProfile(prev => ({
      ...prev,
      ...editForm
    }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="App">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Manage your account and preferences</p>
        </div>

        <div className="profile-section">
          <div className="profile-header">
            <div className="profile-avatar">
              {userProfile.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h3>{userProfile.name}</h3>
              <p>Member since {userProfile.joinDate}</p>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-number">{userProfile.stats.totalOrders}</div>
              <div className="stat-label">Total Orders</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">N${userProfile.stats.savedMoney}</div>
              <div className="stat-label">Money Saved</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{userProfile.stats.bagsRescued}</div>
              <div className="stat-label">Bags Rescued</div>
            </div>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <>
                <button className="btn btn-primary" onClick={handleEdit}>
                  Edit Profile
                </button>
                <button className="btn btn-secondary">
                  View Order History
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={editForm.phone}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        )}

        <div className="profile-section">
          <h3>Account Settings</h3>
          <div className="profile-actions">
            <button className="btn btn-secondary">
              Change Password
            </button>
            <button className="btn btn-secondary">
              Notification Settings
            </button>
            <button className="btn btn-danger">
              Delete Account
            </button>
          </div>
        </div>
      </div>
      
      <Navigation />
    </div>
  );
};

export default Profile;
