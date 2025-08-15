import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { reservationService } from '../services/api';

const MyOrders = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showSearch, setShowSearch] = useState(true);

  useEffect(() => {
    // Check if phone number is stored in localStorage
    const storedPhone = localStorage.getItem('customerPhone');
    if (storedPhone) {
      setPhoneNumber(storedPhone);
      fetchReservations(storedPhone);
      setShowSearch(false);
    }
  }, []);

  const fetchReservations = async (phone = phoneNumber) => {
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await reservationService.getReservationsByPhone(phone);
      setReservations(data);
      setShowSearch(false);
      
      // Store phone number for future use
      localStorage.setItem('customerPhone', phone);
    } catch (err) {
      setError('Failed to fetch your orders. Please check your phone number and try again.');
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      await reservationService.cancelReservation(reservationId);
      // Refresh the reservations list
      fetchReservations();
    } catch (err) {
      setError('Failed to cancel reservation. Please try again.');
      console.error('Error cancelling reservation:', err);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return 'status-pending';
      case 'ready_for_pickup':
        return 'status-confirmed';
      case 'completed':
        return 'status-confirmed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'ready_for_pickup':
        return 'Ready for Pickup';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const canCancelReservation = (reservation) => {
    return reservation.status === 'pending' || reservation.status === 'confirmed';
  };

  return (
    <div>
      <Navigation />
      
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">My Orders</h1>
          <p className="page-subtitle">
            Track your surprise bag reservations
          </p>
        </div>

        {showSearch && (
          <div className="form" style={{ maxWidth: '400px', margin: '0 auto 2rem' }}>
            <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Find Your Orders</h3>
            
            {error && (
              <div className="error" style={{ marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your phone number"
                onKeyPress={(e) => e.key === 'Enter' && fetchReservations()}
              />
            </div>

            <button 
              onClick={() => fetchReservations()}
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Find My Orders'}
            </button>
          </div>
        )}

        {!showSearch && (
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '2rem',
              background: 'white',
              padding: '1rem',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
              <div>
                <strong>Orders for:</strong> {phoneNumber}
              </div>
              <button 
                onClick={() => {
                  setShowSearch(true);
                  setReservations([]);
                  setPhoneNumber('');
                  localStorage.removeItem('customerPhone');
                }}
                className="btn btn-secondary"
              >
                Search Different Number
              </button>
            </div>

            {loading && (
              <div className="loading">Loading your orders...</div>
            )}

            {!loading && reservations.length === 0 && (
              <div className="loading">
                <p>No orders found for this phone number.</p>
                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                  Make sure you've entered the same phone number used for your reservations.
                </p>
              </div>
            )}

            {!loading && reservations.length > 0 && (
              <div>
                <h3 style={{ marginBottom: '1rem' }}>
                  {reservations.length} order{reservations.length !== 1 ? 's' : ''} found
                </h3>
                
                {reservations.map(reservation => (
                  <div key={reservation._id} className="order-card">
                    <div className="order-header">
                      <div>
                        <div className="order-vendor">{reservation.vendorId.name}</div>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                          Reservation #{reservation.reservationNumber}
                        </div>
                      </div>
                      <span className={`order-status ${getStatusColor(reservation.status)}`}>
                        {getStatusText(reservation.status)}
                      </span>
                    </div>

                    <div className="order-details">
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                          <strong>Bags:</strong> {reservation.bagCount}<br />
                          <strong>Total:</strong> {formatCurrency(reservation.totalPrice)}<br />
                          <strong>Reserved:</strong> {formatDate(reservation.createdAt)}
                        </div>
                        <div>
                          <strong>Pickup Time:</strong><br />
                          {reservation.vendorId.pickupWindow.start} - {reservation.vendorId.pickupWindow.end}<br />
                          <strong>Payment:</strong> Cash on Collection
                        </div>
                      </div>
                      
                      {reservation.vendorId.address && (
                        <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '5px' }}>
                          <strong>Pickup Address:</strong><br />
                          {reservation.vendorId.address.street}<br />
                          {reservation.vendorId.address.city}, {reservation.vendorId.address.region}
                        </div>
                      )}
                    </div>

                    {canCancelReservation(reservation) && (
                      <div className="order-actions">
                        <button 
                          onClick={() => handleCancelReservation(reservation._id)}
                          className="btn btn-danger"
                        >
                          Cancel Reservation
                        </button>
                      </div>
                    )}

                    {reservation.status === 'ready_for_pickup' && (
                      <div style={{ 
                        background: '#d4edda', 
                        color: '#155724',
                        padding: '1rem',
                        borderRadius: '5px',
                        marginTop: '1rem',
                        textAlign: 'center'
                      }}>
                        🎉 Your surprise bag is ready for pickup!
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
