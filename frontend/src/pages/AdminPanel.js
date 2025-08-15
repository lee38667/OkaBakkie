import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { adminService } from '../services/api';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [activeTab, setActiveTab] = useState('vendors');
  const [vendors, setVendors] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [vendorForm, setVendorForm] = useState({
    name: '',
    description: '',
    foodType: 'restaurant',
    surpriseBag: {
      price: '',
      availableCount: '',
      originalPrice: ''
    },
    pickupWindow: {
      start: '',
      end: ''
    },
    address: {
      street: '',
      city: 'Windhoek',
      region: 'Khomas'
    },
    location: {
      coordinates: [-22.5609, 17.0658] // Default Windhoek coordinates
    },
    pickupInstructions: 'Please ask for your OkaBakkie surprise bag at the counter.'
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, activeTab]);

  const fetchData = async () => {
    if (!authToken) return;
    
    try {
      setLoading(true);
      setError(null);
      
      if (activeTab === 'vendors') {
        const vendorData = await adminService.getAllVendors(authToken);
        setVendors(vendorData);
      } else if (activeTab === 'reservations') {
        const reservationData = await adminService.getAllReservations(authToken);
        setReservations(reservationData);
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminService.login(loginData.email, loginData.password);
      setAuthToken(response.token);
      setIsAuthenticated(true);
      setSuccess('Login successful!');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVendorSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Format the data properly
      const vendorData = {
        ...vendorForm,
        location: {
          type: 'Point',
          coordinates: [17.0658, -22.5609] // [longitude, latitude] for Windhoek
        },
        surpriseBag: {
          price: parseFloat(vendorForm.surpriseBag.price),
          availableCount: parseInt(vendorForm.surpriseBag.availableCount),
          originalPrice: parseFloat(vendorForm.surpriseBag.originalPrice)
        }
      };
      
      await adminService.createVendor(vendorData, authToken);
      setSuccess('Vendor created successfully!');
      
      // Reset form
      setVendorForm({
        name: '',
        description: '',
        foodType: 'restaurant',
        surpriseBag: { price: '', availableCount: '', originalPrice: '' },
        pickupWindow: { start: '', end: '' },
        address: { street: '', city: 'Windhoek', region: 'Khomas' },
        location: { coordinates: [-22.5609, 17.0658] },
        pickupInstructions: 'Please ask for your OkaBakkie surprise bag at the counter.'
      });
      
      // Refresh vendors list
      if (activeTab === 'vendors') {
        fetchData();
      }
    } catch (err) {
      setError('Failed to create vendor. Please check all fields and try again.');
      console.error('Error creating vendor:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateVendorStock = async (vendorId, newCount) => {
    try {
      const updatedVendor = {
        surpriseBag: {
          availableCount: parseInt(newCount)
        }
      };
      
      await adminService.updateVendor(vendorId, updatedVendor, authToken);
      setSuccess('Stock updated successfully!');
      fetchData();
    } catch (err) {
      setError('Failed to update stock. Please try again.');
      console.error('Error updating vendor:', err);
    }
  };

  const formatCurrency = (amount) => `N$${amount}`;
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div>
        <Navigation />
        <div className="container">
          <div className="admin-header">
            <h1>Admin Panel</h1>
            <p>Please login to access the admin dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="form" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Admin Login</h3>
            
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                placeholder="admin@okabakkie.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                placeholder="Enter password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
              Demo credentials: admin@okabakkie.com / admin123
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      
      <div className="container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage vendors and view reservations</p>
          <button 
            onClick={() => {
              setIsAuthenticated(false);
              setAuthToken(null);
            }}
            className="btn btn-secondary"
          >
            Logout
          </button>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem',
          borderBottom: '2px solid #F5F5DC'
        }}>
          <button 
            onClick={() => setActiveTab('vendors')}
            className={`btn ${activeTab === 'vendors' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Manage Vendors
          </button>
          <button 
            onClick={() => setActiveTab('reservations')}
            className={`btn ${activeTab === 'reservations' ? 'btn-primary' : 'btn-secondary'}`}
          >
            View Reservations
          </button>
          <button 
            onClick={() => setActiveTab('add-vendor')}
            className={`btn ${activeTab === 'add-vendor' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Add New Vendor
          </button>
        </div>

        {/* Vendors Tab */}
        {activeTab === 'vendors' && (
          <div className="admin-section">
            <h3>Vendor Management</h3>
            
            {loading && <div className="loading">Loading vendors...</div>}
            
            {!loading && vendors.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Available</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.map(vendor => (
                      <tr key={vendor._id}>
                        <td>{vendor.name}</td>
                        <td style={{ textTransform: 'capitalize' }}>{vendor.foodType}</td>
                        <td>{formatCurrency(vendor.surpriseBag.price)}</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            value={vendor.surpriseBag.availableCount}
                            onChange={(e) => updateVendorStock(vendor._id, e.target.value)}
                            style={{ width: '80px', padding: '0.25rem' }}
                          />
                        </td>
                        <td>
                          <span style={{ 
                            color: vendor.isActive ? '#155724' : '#721c24',
                            fontWeight: 'bold'
                          }}>
                            {vendor.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-secondary"
                            style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                            onClick={() => updateVendorStock(vendor._id, vendor.surpriseBag.availableCount)}
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <div className="admin-section">
            <h3>Recent Reservations</h3>
            
            {loading && <div className="loading">Loading reservations...</div>}
            
            {!loading && reservations.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Reservation #</th>
                      <th>Customer</th>
                      <th>Vendor</th>
                      <th>Bags</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map(reservation => (
                      <tr key={reservation._id}>
                        <td>{reservation.reservationNumber}</td>
                        <td>
                          {reservation.customerName}<br />
                          <small style={{ color: '#666' }}>{reservation.customerPhone}</small>
                        </td>
                        <td>{reservation.vendorId.name}</td>
                        <td>{reservation.bagCount}</td>
                        <td>{formatCurrency(reservation.totalPrice)}</td>
                        <td style={{ textTransform: 'capitalize' }}>
                          {reservation.status.replace('_', ' ')}
                        </td>
                        <td>{formatDate(reservation.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {!loading && reservations.length === 0 && (
              <div className="loading">No reservations found.</div>
            )}
          </div>
        )}

        {/* Add Vendor Tab */}
        {activeTab === 'add-vendor' && (
          <div className="admin-section">
            <h3>Add New Vendor</h3>
            
            <form onSubmit={handleVendorSubmit} style={{ maxWidth: '600px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Vendor Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={vendorForm.name}
                    onChange={(e) => setVendorForm({...vendorForm, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Food Type *</label>
                  <select
                    className="form-input"
                    value={vendorForm.foodType}
                    onChange={(e) => setVendorForm({...vendorForm, foodType: e.target.value})}
                  >
                    <option value="restaurant">Restaurant</option>
                    <option value="cafe">Café</option>
                    <option value="bakery">Bakery</option>
                    <option value="grocery">Grocery</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-input"
                  value={vendorForm.description}
                  onChange={(e) => setVendorForm({...vendorForm, description: e.target.value})}
                  rows="3"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Surprise Bag Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={vendorForm.surpriseBag.price}
                    onChange={(e) => setVendorForm({
                      ...vendorForm, 
                      surpriseBag: {...vendorForm.surpriseBag, price: e.target.value}
                    })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Original Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={vendorForm.surpriseBag.originalPrice}
                    onChange={(e) => setVendorForm({
                      ...vendorForm, 
                      surpriseBag: {...vendorForm.surpriseBag, originalPrice: e.target.value}
                    })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Available Count *</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={vendorForm.surpriseBag.availableCount}
                    onChange={(e) => setVendorForm({
                      ...vendorForm, 
                      surpriseBag: {...vendorForm.surpriseBag, availableCount: e.target.value}
                    })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Pickup Start Time *</label>
                  <input
                    type="time"
                    className="form-input"
                    value={vendorForm.pickupWindow.start}
                    onChange={(e) => setVendorForm({
                      ...vendorForm, 
                      pickupWindow: {...vendorForm.pickupWindow, start: e.target.value}
                    })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pickup End Time *</label>
                  <input
                    type="time"
                    className="form-input"
                    value={vendorForm.pickupWindow.end}
                    onChange={(e) => setVendorForm({
                      ...vendorForm, 
                      pickupWindow: {...vendorForm.pickupWindow, end: e.target.value}
                    })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Street Address *</label>
                <input
                  type="text"
                  className="form-input"
                  value={vendorForm.address.street}
                  onChange={(e) => setVendorForm({
                    ...vendorForm, 
                    address: {...vendorForm.address, street: e.target.value}
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pickup Instructions</label>
                <textarea
                  className="form-input"
                  value={vendorForm.pickupInstructions}
                  onChange={(e) => setVendorForm({...vendorForm, pickupInstructions: e.target.value})}
                  rows="2"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Creating Vendor...' : 'Create Vendor'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
