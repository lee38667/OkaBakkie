import React, { useState, useEffect, useCallback } from 'react';
import BottomNavigation from '../components/BottomNavigation';
import { reservationService } from '../services/api';

const MyOrders = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showSearch, setShowSearch] = useState(true);

  const fetchReservations = useCallback(async (phone = phoneNumber) => {
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
  }, [phoneNumber]);

  useEffect(() => {
    // Check if phone number is stored in localStorage
    const storedPhone = localStorage.getItem('customerPhone');
    if (storedPhone) {
      setPhoneNumber(storedPhone);
      fetchReservations(storedPhone);
      setShowSearch(false);
    }
  }, [fetchReservations]);

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
    <div className="mobile-container">
      <div className="content-wrapper">
        <div className="page-header">
          <h1 className="page-title">My Orders</h1>
          <p className="page-subtitle">
            Track your surprise bag reservations
          </p>
        </div>

        {showSearch && (
          <div className="form-container">
            <h3 style={{ marginBottom: 'var(--spacing-md)', textAlign: 'center' }}>
              Find Your Orders
            </h3>
            
            {error && (
              <div className="error" style={{ marginBottom: 'var(--spacing-md)' }}>
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
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner" style={{ width: '16px', height: '16px' }}></div>
                  Searching...
                </>
              ) : (
                <>
                  🔍 Find My Orders
                </>
              )}
            </button>
          </div>
        )}

        {!showSearch && (
          <>
            <div className="card">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
              }}>
                <div>
                  <strong>📱 {phoneNumber}</strong>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {reservations.length} order{reservations.length !== 1 ? 's' : ''} found
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setShowSearch(true);
                    setReservations([]);
                    setPhoneNumber('');
                    localStorage.removeItem('customerPhone');
                  }}
                  className="btn btn-outline"
                  style={{ fontSize: '0.8rem', padding: 'var(--spacing-sm)' }}
                >
                  Change Number
                </button>
              </div>
            </div>

            {loading && (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Loading your orders...</p>
              </div>
            )}

            {!loading && reservations.length === 0 && (
              <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📋</div>
                <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>No orders found</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                  You haven't made any reservations yet, or check that you entered the correct phone number.
                </p>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="btn btn-primary"
                >
                  Browse Vendors
                </button>
              </div>
            )}

            {!loading && reservations.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {reservations.map(reservation => (
                  <div key={reservation._id} className="card">
                    <div className="card-header">
                      <div>
                        <h3 className="card-title">{reservation.vendorId.name}</h3>
                        <div className="card-subtitle">
                          #{reservation.reservationNumber}
                        </div>
                      </div>
                      <span className={`status-badge ${getStatusColor(reservation.status)}`}>
                        {getStatusText(reservation.status)}
                      </span>
                    </div>

                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: 'var(--spacing-md)',
                      marginBottom: 'var(--spacing-md)'
                    }}>
                      <div>
                        <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                          <strong>Quantity:</strong> {reservation.bagCount} bag{reservation.bagCount > 1 ? 's' : ''}
                        </div>
                        <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                          <strong>Total:</strong> {formatCurrency(reservation.totalPrice)}
                        </div>
                        <div>
                          <strong>Ordered:</strong> {formatDate(reservation.createdAt)}
                        </div>
                      </div>
                      <div>
                        <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                          <strong>Pickup:</strong> {reservation.vendorId.pickupWindow.start} - {reservation.vendorId.pickupWindow.end}
                        </div>
                        <div>
                          <strong>Payment:</strong> 💳 Cash on Collection
                        </div>
                      </div>
                    </div>
                    
                    {reservation.vendorId.address && (
                      <div style={{ 
                        background: '#F9FAFB',
                        padding: 'var(--spacing-md)',
                        borderRadius: 'var(--border-radius-sm)',
                        marginBottom: 'var(--spacing-md)'
                      }}>
                        <strong>📍 Pickup Address:</strong><br />
                        {reservation.vendorId.address.street}<br />
                        {reservation.vendorId.address.city}, {reservation.vendorId.address.region}
                      </div>
                    )}

                    {reservation.status === 'ready_for_pickup' && (
                      <div className="info" style={{ marginBottom: 'var(--spacing-md)' }}>
                        🎉 Your surprise bag is ready for pickup!
                      </div>
                    )}

                    {canCancelReservation(reservation) && (
                      <button 
                        onClick={() => handleCancelReservation(reservation._id)}
                        className="btn btn-danger btn-full"
                      >
                        Cancel Reservation
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default MyOrders;
