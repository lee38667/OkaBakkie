import React from 'react';
import { Link } from 'react-router-dom';

const VendorCard = ({ vendor }) => {
  const formatCurrency = (amount) => `N$${amount}`;
  
  const isAvailable = vendor.surpriseBag.availableCount > 0;

  return (
    <Link to={`/vendor/${vendor._id}`} className="vendor-card">
      <div className="vendor-image">
        {vendor.name}
      </div>
      
      <div className="vendor-content">
        <div className="vendor-name">{vendor.name}</div>
        
        <span className="vendor-type">{vendor.foodType}</span>
        
        <p className="vendor-description">
          {vendor.description.length > 100 
            ? `${vendor.description.substring(0, 100)}...`
            : vendor.description
          }
        </p>
        
        <div className="vendor-details">
          <div className="vendor-pricing">
            <span className="vendor-price">
              {formatCurrency(vendor.surpriseBag.price)}
            </span>
            <span className="vendor-original-price">
              {formatCurrency(vendor.surpriseBag.originalPrice)}
            </span>
          </div>
          
          <div className="vendor-availability">
            <div className={`bags-available ${!isAvailable ? 'sold-out' : ''}`}>
              {isAvailable 
                ? `${vendor.surpriseBag.availableCount} bags left`
                : 'Sold Out'
              }
            </div>
            <div className="pickup-time">
              Pickup: {vendor.pickupWindow.start} - {vendor.pickupWindow.end}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VendorCard;
