import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import { vendorService } from '../services/api';

const VendorDetails = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVendor = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    fetchVendor();
  }, [fetchVendor]);

  const formatCurrency = (amount) => `N$${amount}`;
  const calculateSavings = () => {
    if (!vendor) return 0;
    return vendor.surpriseBag.originalPrice - vendor.surpriseBag.price;
  };

  if (loading) {
    return (
      <div className="mobile-container">
        <div className="content-wrapper">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading vendor details...</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="mobile-container">
        <div className="content-wrapper">
          <div className="error">
            <p>{error || 'Vendor not found'}</p>
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  const isAvailable = vendor.surpriseBag.availableCount > 0;
  const savingsPercentage = Math.round((calculateSavings() / vendor.surpriseBag.originalPrice) * 100);

  return (
    <div className="mobile-container">
      <div className="content-wrapper">
        {/* Back Button */}
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <Link 
            to="/" 
            className="btn btn-outline"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-sm) var(--spacing-md)'
            }}
          >
            ← Back
          </Link>
        </div>

        {/* Vendor Hero */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
          borderRadius: 'var(--border-radius)',
          padding: 'var(--spacing-xl)',
          color: 'white',
          textAlign: 'center',
          marginBottom: 'var(--spacing-lg)',
          position: 'relative'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>
            {vendor.foodType === 'bakery' && '🥖'}
            {vendor.foodType === 'cafe' && '☕'}
            {vendor.foodType === 'restaurant' && '🍽️'}
            {vendor.foodType === 'grocery' && '🛒'}
            {vendor.foodType === 'other' && '🍕'}
          </div>
          
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            marginBottom: 'var(--spacing-sm)',
            margin: 0
          }}>
            {vendor.name}
          </h1>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            padding: 'var(--spacing-xs) var(--spacing-md)',
            display: 'inline-block',
            fontSize: '0.85rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {vendor.foodType}
          </div>

          {/* Savings Badge */}
          {isAvailable && (
            <div style={{
              position: 'absolute',
              top: 'var(--spacing-md)',
              right: 'var(--spacing-md)',
              background: 'var(--accent-color)',
              color: 'white',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '700'
            }}>
              Save {savingsPercentage}%
            </div>
          )}
        </div>

        {/* Description */}
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <p style={{ 
            fontSize: '1rem', 
            lineHeight: '1.6', 
            color: 'var(--text-primary)',
            margin: 0
          }}>
            {vendor.description}
          </p>
        </div>

        {/* Pricing Card */}
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: '800', 
              color: 'var(--primary-color)',
              marginBottom: 'var(--spacing-sm)'
            }}>
              {formatCurrency(vendor.surpriseBag.price)}
            </div>
            
            <div style={{ 
              textDecoration: 'line-through', 
              color: 'var(--text-secondary)', 
              fontSize: '1.1rem',
              marginBottom: 'var(--spacing-sm)'
            }}>
              was {formatCurrency(vendor.surpriseBag.originalPrice)}
            </div>
            
            <div style={{ 
              background: 'var(--accent-color)',
              color: 'white',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              borderRadius: '20px',
              display: 'inline-block',
              fontWeight: '700',
              fontSize: '0.9rem'
            }}>
              You save {formatCurrency(calculateSavings())}!
            </div>
          </div>
        </div>

        {/* Availability Status */}
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div style={{
            textAlign: 'center',
            padding: 'var(--spacing-md)',
            background: isAvailable ? '#F0F9F4' : '#FEF2F2',
            borderRadius: 'var(--border-radius-sm)',
            border: `2px solid ${isAvailable ? 'var(--accent-color)' : 'var(--danger-color)'}`
          }}>
            {isAvailable ? (
              <>
                <div style={{ 
                  fontSize: '1.5rem', 
                  marginBottom: 'var(--spacing-sm)' 
                }}>
                  ✅
                </div>
                <div style={{ 
                  fontWeight: '700', 
                  color: 'var(--accent-color)',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  {vendor.surpriseBag.availableCount} bags available
                </div>
                <div style={{ 
                  fontSize: '0.9rem', 
                  color: 'var(--text-secondary)' 
                }}>
                  Hurry, limited stock!
                </div>
              </>
            ) : (
              <>
                <div style={{ 
                  fontSize: '1.5rem', 
                  marginBottom: 'var(--spacing-sm)' 
                }}>
                  ❌
                </div>
                <div style={{ 
                  fontWeight: '700', 
                  color: 'var(--danger-color)',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  Sold Out
                </div>
                <div style={{ 
                  fontSize: '0.9rem', 
                  color: 'var(--text-secondary)' 
                }}>
                  Check back tomorrow
                </div>
              </>
            )}
          </div>
        </div>

        {/* Pickup Information */}
        <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h3 style={{ 
            marginBottom: 'var(--spacing-md)', 
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)'
          }}>
            📍 Pickup Information
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gap: 'var(--spacing-md)' 
          }}>
            {vendor.address && (
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Address:</strong>
                <div style={{ color: 'var(--text-secondary)' }}>
                  {vendor.address.street}<br />
                  {vendor.address.city}, {vendor.address.region}
                </div>
              </div>
            )}
            
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Pickup Window:</strong>
              <div style={{ 
                color: 'var(--primary-color)', 
                fontWeight: '600',
                fontSize: '1.1rem'
              }}>
                🕐 {vendor.pickupWindow.start} - {vendor.pickupWindow.end}
              </div>
            </div>
            
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Instructions:</strong>
              <div style={{ color: 'var(--text-secondary)' }}>
                {vendor.pickupInstructions}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          {isAvailable ? (
            <Link 
              to={`/reserve/${vendor._id}`} 
              className="btn btn-primary btn-full btn-lg"
              style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-sm)'
              }}
            >
              🎁 Reserve Your Surprise Bag
            </Link>
          ) : (
            <button 
              className="btn btn-secondary btn-full btn-lg" 
              disabled
            >
              Currently Unavailable
            </button>
          )}
        </div>

        {/* Payment Info */}
        <div style={{ 
          textAlign: 'center', 
          padding: 'var(--spacing-md)',
          background: '#F9FAFB',
          borderRadius: 'var(--border-radius)',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem'
        }}>
          💳 Pay with cash when you collect your surprise bag
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default VendorDetails;
