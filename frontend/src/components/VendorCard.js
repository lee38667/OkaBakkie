import React from 'react';
import { Link } from 'react-router-dom';

const VendorCard = ({ vendor }) => {
  const formatCurrency = (amount) => `N$${amount}`;
  
  const isAvailable = vendor.surpriseBag.availableCount > 0;
  const savingsAmount = vendor.surpriseBag.originalPrice - vendor.surpriseBag.price;
  const savingsPercentage = Math.round((savingsAmount / vendor.surpriseBag.originalPrice) * 100);

  return (
    <Link to={`/vendor/${vendor._id}`} className="vendor-card">
      <div className="vendor-image">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
            {vendor.foodType === 'bakery' && '🥖'}
            {vendor.foodType === 'cafe' && '☕'}
            {vendor.foodType === 'restaurant' && '🍽️'}
            {vendor.foodType === 'grocery' && '🛒'}
            {vendor.foodType === 'other' && '🍕'}
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
            {vendor.name}
          </div>
        </div>
        
        {/* Savings Badge */}
        {isAvailable && (
          <div style={{
            position: 'absolute',
            top: 'var(--spacing-sm)',
            right: 'var(--spacing-sm)',
            background: 'var(--accent-color)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '700'
          }}>
            -{savingsPercentage}%
          </div>
        )}
      </div>
      
      <div className="vendor-content">
        <div className="vendor-header">
          <div className="vendor-name">{vendor.name}</div>
          <span className="vendor-type">{vendor.foodType}</span>
        </div>
        
        <p className="vendor-description">
          {vendor.description.length > 80 
            ? `${vendor.description.substring(0, 80)}...`
            : vendor.description
          }
        </p>
        
        <div className="vendor-details">
          <div className="vendor-pricing">
            <div className="vendor-price">
              {formatCurrency(vendor.surpriseBag.price)}
            </div>
            <div className="vendor-original-price">
              was {formatCurrency(vendor.surpriseBag.originalPrice)}
            </div>
          </div>
          
          <div className="vendor-availability">
            <div className={`bags-available ${!isAvailable ? 'sold-out' : ''}`}>
              {isAvailable 
                ? `${vendor.surpriseBag.availableCount} left`
                : 'Sold Out'
              }
            </div>
            <div className="pickup-time">
              📍 {vendor.pickupWindow.start}-{vendor.pickupWindow.end}
            </div>
          </div>
        </div>

        {/* Bottom info bar */}
        <div style={{
          marginTop: 'var(--spacing-md)',
          padding: 'var(--spacing-sm)',
          background: isAvailable ? '#F0F9F4' : '#FEF2F2',
          borderRadius: 'var(--border-radius-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: '0.8rem',
            color: isAvailable ? 'var(--accent-color)' : 'var(--danger-color)',
            fontWeight: '600'
          }}>
            {isAvailable ? '✅ Available now' : '❌ Out of stock'}
          </div>
          
          {isAvailable && (
            <div style={{
              fontSize: '0.8rem',
              color: 'var(--accent-color)',
              fontWeight: '600'
            }}>
              Save {formatCurrency(savingsAmount)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default VendorCard;
