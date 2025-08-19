import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
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
      <div className="mobile-container">
        <div className="content-wrapper">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading reservation form...</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (error && !vendor) {
    return (
      <div className="mobile-container">
        <div className="content-wrapper">
          <div className="error">
            <p>Failed to load vendor details</p>
            <Link to="/" className="btn btn-primary">Back to Home</Link>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (success) {
    return (
      <div className="mobile-container">
        <div className="content-wrapper">
          <div style={{
            textAlign: 'center',
            padding: 'var(--spacing-xl)',
            background: 'linear-gradient(135deg, var(--accent-color), #48CC6C)',
            borderRadius: 'var(--border-radius)',
            color: 'white',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🎉</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: 'var(--spacing-md)' }}>
              Reservation Confirmed!
            </h2>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: 'var(--spacing-md)',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              #{success.reservation.reservationNumber}
            </div>
          </div>

          <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--text-primary)' }}>
              Order Details
            </h3>
            <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Vendor:</span>
                <span style={{ fontWeight: '600' }}>{success.reservation.vendorId.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total:</span>
                <span style={{ fontWeight: '700', color: 'var(--primary-color)' }}>
                  {formatCurrency(success.reservation.totalPrice)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Pickup:</span>
                <span style={{ fontWeight: '600' }}>
                  {success.reservation.vendorId.pickupWindow.start} - {success.reservation.vendorId.pickupWindow.end}
                </span>
              </div>
            </div>
          </div>

          <div style={{
            background: '#FFF7ED',
            border: '1px solid #FB923C',
            borderRadius: 'var(--border-radius)',
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <h4 style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--spacing-sm)',
              marginBottom: 'var(--spacing-sm)',
              color: '#EA580C'
            }}>
              📱 WhatsApp Confirmation
            </h4>
            <p style={{ 
              fontSize: '0.9rem', 
              color: '#9A3412',
              lineHeight: '1.5',
              margin: 0
            }}>
              {success.whatsappMessage}
            </p>
          </div>

          <div style={{ 
            textAlign: 'center', 
            padding: 'var(--spacing-md)',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem'
          }}>
            <div className="loading-spinner-small" style={{ marginBottom: 'var(--spacing-sm)' }}></div>
            Redirecting to your orders...
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  const isAvailable = vendor && vendor.surpriseBag.availableCount > 0;

  return (
    <div className="mobile-container">
      <div className="content-wrapper">
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <Link 
            to={`/vendor/${id}`} 
            className="btn btn-outline"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              marginBottom: 'var(--spacing-md)'
            }}
          >
            ← Back
          </Link>

          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: 'var(--text-primary)',
            margin: 0,
            marginBottom: 'var(--spacing-xs)'
          }}>
            Reserve Your Surprise Bag
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            margin: 0 
          }}>
            Complete your reservation for {vendor?.name}
          </p>
        </div>

        {!isAvailable ? (
          <div className="card" style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>😔</div>
            <h3 style={{ color: 'var(--danger-color)', marginBottom: 'var(--spacing-sm)' }}>
              Sorry, No Bags Available
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
              This vendor is currently out of stock. Check back tomorrow for new offerings!
            </p>
            <Link to="/" className="btn btn-primary">
              Browse Other Vendors
            </Link>
          </div>
        ) : (
          <>
            {/* Vendor Summary */}
            <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-md)'
              }}>
                <div style={{ fontSize: '2rem' }}>
                  {vendor.foodType === 'bakery' && '🥖'}
                  {vendor.foodType === 'cafe' && '☕'}
                  {vendor.foodType === 'restaurant' && '🍽️'}
                  {vendor.foodType === 'grocery' && '🛒'}
                  {vendor.foodType === 'other' && '🍕'}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: '700', 
                    color: 'var(--text-primary)',
                    margin: 0,
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    {vendor.name}
                  </h3>
                  <div style={{ 
                    fontSize: '0.85rem', 
                    color: 'var(--text-secondary)' 
                  }}>
                    🕐 {vendor.pickupWindow.start} - {vendor.pickupWindow.end}
                  </div>
                </div>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: 'var(--spacing-md)',
                padding: 'var(--spacing-md)',
                background: '#F9FAFB',
                borderRadius: 'var(--border-radius-sm)'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary-color)' }}>
                    {formatCurrency(vendor.surpriseBag.price)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Price per bag</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '1rem', 
                    fontWeight: '600', 
                    color: 'var(--text-secondary)', 
                    textDecoration: 'line-through' 
                  }}>
                    {formatCurrency(vendor.surpriseBag.originalPrice)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Was</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--accent-color)' }}>
                    {formatCurrency(vendor.surpriseBag.originalPrice - vendor.surpriseBag.price)}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>You save</div>
                </div>
              </div>
            </div>

            {/* Reservation Form */}
            <form onSubmit={handleSubmit}>
              <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '700', 
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  Your Details
                </h3>
                
                {error && (
                  <div style={{
                    background: '#FEF2F2',
                    border: '1px solid var(--danger-color)',
                    color: 'var(--danger-color)',
                    padding: 'var(--spacing-md)',
                    borderRadius: 'var(--border-radius-sm)',
                    marginBottom: 'var(--spacing-lg)',
                    fontSize: '0.9rem'
                  }}>
                    {error}
                  </div>
                )}

                <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontWeight: '600', 
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--spacing-sm)'
                    }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        border: '2px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        fontSize: '1rem',
                        transition: 'border-color 0.2s ease',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontWeight: '600', 
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--spacing-sm)'
                    }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., +264 81 123 4567"
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        border: '2px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        fontSize: '1rem',
                        transition: 'border-color 0.2s ease',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontWeight: '600', 
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--spacing-sm)'
                    }}>
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        border: '2px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        fontSize: '1rem',
                        transition: 'border-color 0.2s ease',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontWeight: '600', 
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--spacing-sm)'
                    }}>
                      Number of Bags
                    </label>
                    <select
                      name="bagCount"
                      value={formData.bagCount}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        border: '2px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        fontSize: '1rem',
                        backgroundColor: 'white',
                        transition: 'border-color 0.2s ease',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                    >
                      {Array.from({ length: vendor.surpriseBag.availableCount }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} bag{i > 0 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                    <div style={{ 
                      fontSize: '0.85rem', 
                      color: 'var(--text-secondary)', 
                      marginTop: 'var(--spacing-xs)'
                    }}>
                      {vendor.surpriseBag.availableCount} bags available
                    </div>
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontWeight: '600', 
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--spacing-sm)'
                    }}>
                      Payment Method
                    </label>
                    <div style={{ 
                      background: '#F9FAFB', 
                      padding: 'var(--spacing-md)', 
                      borderRadius: 'var(--border-radius-sm)',
                      border: '2px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)'
                    }}>
                      <span style={{ fontSize: '1.2rem' }}>💳</span>
                      <div>
                        <div style={{ fontWeight: '600' }}>Cash on Collection</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          Pay when you collect your surprise bag
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '700', 
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  Order Summary
                </h3>
                
                <div style={{ 
                  display: 'grid', 
                  gap: 'var(--spacing-md)',
                  padding: 'var(--spacing-md)',
                  background: '#F9FAFB',
                  borderRadius: 'var(--border-radius-sm)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Surprise Bag × {formData.bagCount}</span>
                    <span style={{ fontWeight: '600' }}>{formatCurrency(calculateTotal())}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Original price</span>
                    <span style={{ textDecoration: 'line-through' }}>
                      {formatCurrency(vendor.surpriseBag.originalPrice * parseInt(formData.bagCount))}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    color: 'var(--accent-color)',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    paddingTop: 'var(--spacing-sm)',
                    borderTop: '1px solid var(--border-color)'
                  }}>
                    <span>You're saving:</span>
                    <span>{formatCurrency((vendor.surpriseBag.originalPrice - vendor.surpriseBag.price) * parseInt(formData.bagCount))}</span>
                  </div>
                </div>
              </div>

              {/* Environmental Impact */}
              <div style={{ 
                background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)', 
                borderRadius: 'var(--border-radius)',
                padding: 'var(--spacing-md)',
                textAlign: 'center',
                marginBottom: 'var(--spacing-xl)'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-sm)' }}>🌱</div>
                <div style={{ 
                  fontSize: '0.9rem', 
                  color: '#065F46',
                  fontWeight: '600'
                }}>
                  You're helping reduce food waste and protecting our environment!
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary btn-full btn-lg"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--spacing-sm)',
                  marginBottom: 'var(--spacing-xl)'
                }}
              >
                {submitting ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    Creating Reservation...
                  </>
                ) : (
                  <>
                    🎁 Confirm Reservation - {formatCurrency(calculateTotal())}
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default ReservationForm;
