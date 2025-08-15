import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { vendorService } from '../services/api';

const VendorDetails = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const formatCurrency = (amount) => `N$${amount}`;
  const calculateSavings = () => {
    if (!vendor) return 0;
    return vendor.surpriseBag.originalPrice - vendor.surpriseBag.price;
  };

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="container">
          <div className="loading">Loading vendor details...</div>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div>
        <Navigation />
        <div className="container">
          <div className="error">
            <p>{error || 'Vendor not found'}</p>
            <Link to="/" className="btn btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAvailable = vendor.surpriseBag.availableCount > 0;

  return (
    <div>
      <Navigation />
      
      <div className="container">
        {/* Vendor Banner */}
        <div className="vendor-image" style={{ height: '300px', marginBottom: '2rem' }}>
          {vendor.name}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Vendor Information */}
          <div>
            <h1 className="page-title">{vendor.name}</h1>
            <span className="vendor-type">{vendor.foodType}</span>
            
            <div style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#666' }}>
                {vendor.description}
              </p>
            </div>

            {/* Location & Pickup Info */}
            <div className="vendor-details" style={{ 
              background: '#f8f9fa', 
              padding: '1.5rem', 
              borderRadius: '10px',
              marginBottom: '2rem'
            }}>
              <div>
                <h3 style={{ marginBottom: '1rem', color: '#333' }}>Pickup Information</h3>
                
                {vendor.address && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Address:</strong>
                    <br />
                    {vendor.address.street}<br />
                    {vendor.address.city}, {vendor.address.region}
                  </div>
                )}
                
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Pickup Window:</strong>
                  <br />
                  {vendor.pickupWindow.start} - {vendor.pickupWindow.end}
                </div>
                
                <div>
                  <strong>Instructions:</strong>
                  <br />
                  {vendor.pickupInstructions}
                </div>
              </div>
            </div>
          </div>

          {/* Reservation Panel */}
          <div style={{ position: 'sticky', top: '2rem' }}>
            <div className="form" style={{ margin: 0 }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FFA500', marginBottom: '0.5rem' }}>
                  {formatCurrency(vendor.surpriseBag.price)}
                </div>
                <div style={{ 
                  textDecoration: 'line-through', 
                  color: '#999', 
                  fontSize: '1.1rem',
                  marginBottom: '0.5rem'
                }}>
                  Was {formatCurrency(vendor.surpriseBag.originalPrice)}
                </div>
                <div style={{ 
                  color: '#4CAF50', 
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}>
                  You save {formatCurrency(calculateSavings())}!
                </div>
              </div>

              <div style={{ 
                textAlign: 'center', 
                marginBottom: '1.5rem',
                padding: '1rem',
                background: isAvailable ? '#d4edda' : '#f8d7da',
                borderRadius: '8px',
                color: isAvailable ? '#155724' : '#721c24'
              }}>
                {isAvailable ? (
                  <>
                    <strong>{vendor.surpriseBag.availableCount} bags available</strong>
                    <br />
                    <small>Hurry, limited stock!</small>
                  </>
                ) : (
                  <>
                    <strong>Sold Out</strong>
                    <br />
                    <small>Check back tomorrow</small>
                  </>
                )}
              </div>

              {isAvailable ? (
                <Link 
                  to={`/reserve/${vendor._id}`} 
                  className="btn btn-primary btn-full"
                  style={{ fontSize: '1.1rem', padding: '1rem' }}
                >
                  Reserve Your Surprise Bag
                </Link>
              ) : (
                <button 
                  className="btn btn-secondary btn-full" 
                  disabled
                  style={{ fontSize: '1.1rem', padding: '1rem' }}
                >
                  Currently Unavailable
                </button>
              )}
              
              <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                💳 Pay cash on collection
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link to="/" className="btn btn-secondary">
            ← Back to All Vendors
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;
