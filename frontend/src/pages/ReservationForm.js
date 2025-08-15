import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { vendorService, reservationService } from '../services/api';

const ReservationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    bagCount: 1
  });

  useEffect(() => {
    fetchVendor();
  }, [id]);

  const fetchVendor = async () => {
    try {
      setLoading(true);
      const data = await vendorService.getVendorById(id);
      setVendor(data);
      setError(null);
    } catch (err) {
      setError('Failed to load vendor details. Please try again.');
      console.error('Error fetching vendor:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) {
      setError('Please enter your name');
      return false;
    }
    
    if (!formData.customerPhone.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    
    if (formData.bagCount < 1 || formData.bagCount > vendor.surpriseBag.availableCount) {
      setError(`Please select between 1 and ${vendor.surpriseBag.availableCount} bags`);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      const reservationData = {
        vendorId: id,
        ...formData,
        bagCount: parseInt(formData.bagCount)
      };
      
      const response = await reservationService.createReservation(reservationData);
      
      setSuccess(response);
      
      // Store phone number for later use in My Orders
      localStorage.setItem('customerPhone', formData.customerPhone);
      
      // Redirect to success page or my orders after 3 seconds
      setTimeout(() => {
        navigate('/my-orders');
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create reservation. Please try again.');
      console.error('Error creating reservation:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount) => `N$${amount}`;
  const calculateTotal = () => {
    if (!vendor) return 0;
    return vendor.surpriseBag.price * parseInt(formData.bagCount || 1);
  };

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="container">
          <div className="loading">Loading reservation form...</div>
        </div>
      </div>
    );
  }

  if (error && !vendor) {
    return (
      <div>
        <Navigation />
        <div className="container">
          <div className="error">
            <p>Failed to load vendor details</p>
            <Link to="/" className="btn btn-primary">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div>
        <Navigation />
        <div className="container">
          <div className="success">
            <h2 style={{ marginBottom: '1rem' }}>🎉 Reservation Confirmed!</h2>
            <p><strong>Reservation Number:</strong> {success.reservation.reservationNumber}</p>
            <p><strong>Vendor:</strong> {success.reservation.vendorId.name}</p>
            <p><strong>Total:</strong> {formatCurrency(success.reservation.totalPrice)}</p>
            <p><strong>Pickup Time:</strong> {success.reservation.vendorId.pickupWindow.start} - {success.reservation.vendorId.pickupWindow.end}</p>
            
            <div style={{ 
              background: '#fff3cd', 
              padding: '1rem', 
              borderRadius: '8px',
              margin: '1rem 0',
              color: '#856404'
            }}>
              <p><strong>WhatsApp Confirmation:</strong></p>
              <p style={{ fontSize: '0.9rem' }}>{success.whatsappMessage}</p>
            </div>
            
            <p style={{ marginTop: '1rem' }}>Redirecting to your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  const isAvailable = vendor && vendor.surpriseBag.availableCount > 0;

  return (
    <div>
      <Navigation />
      
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Reserve Your Surprise Bag</h1>
          <p className="page-subtitle">
            Complete your reservation for {vendor?.name}
          </p>
        </div>

        {!isAvailable && (
          <div className="error">
            <p>Sorry, this vendor is currently out of stock.</p>
            <Link to="/" className="btn btn-primary">Browse Other Vendors</Link>
          </div>
        )}

        {isAvailable && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
            {/* Reservation Form */}
            <form onSubmit={handleSubmit} className="form">
              <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Your Details</h3>
              
              {error && (
                <div className="error" style={{ marginBottom: '1rem' }}>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="customerName"
                  className="form-input required"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="customerPhone"
                  className="form-input required"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  placeholder="e.g., +264 81 123 4567"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email (Optional)</label>
                <input
                  type="email"
                  name="customerEmail"
                  className="form-input"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Number of Bags</label>
                <select
                  name="bagCount"
                  className="form-input"
                  value={formData.bagCount}
                  onChange={handleInputChange}
                >
                  {Array.from({ length: vendor.surpriseBag.availableCount }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} bag{i > 0 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0'
                }}>
                  💳 Cash on Collection
                  <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                    Pay when you collect your surprise bag
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-full"
                disabled={submitting}
                style={{ fontSize: '1.1rem', padding: '1rem' }}
              >
                {submitting ? 'Creating Reservation...' : 'Confirm Reservation'}
              </button>
            </form>

            {/* Order Summary */}
            <div className="form" style={{ position: 'sticky', top: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Order Summary</h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <strong>{vendor.name}</strong>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>
                  {vendor.foodType} • {vendor.pickupWindow.start} - {vendor.pickupWindow.end}
                </div>
              </div>

              <div style={{ 
                background: '#f8f9fa', 
                padding: '1rem', 
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Surprise Bag × {formData.bagCount}</span>
                  <span>{formatCurrency(vendor.surpriseBag.price)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ color: '#666' }}>Original price</span>
                  <span style={{ textDecoration: 'line-through', color: '#999' }}>
                    {formatCurrency(vendor.surpriseBag.originalPrice * parseInt(formData.bagCount))}
                  </span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '1rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  <span>Total</span>
                  <span style={{ color: '#FFA500' }}>{formatCurrency(calculateTotal())}</span>
                </div>
              </div>

              <div style={{ 
                background: '#d4edda', 
                color: '#155724',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '0.9rem'
              }}>
                You're saving {formatCurrency(
                  (vendor.surpriseBag.originalPrice - vendor.surpriseBag.price) * parseInt(formData.bagCount)
                )} and helping reduce food waste! 🌱
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link to={`/vendor/${id}`} className="btn btn-secondary">
            ← Back to Vendor Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;
