import React, { useState, useEffect, useCallback } from 'react';
import BottomNavigation from '../components/BottomNavigation';
import FilterBar from '../components/FilterBar';
import VendorCard from '../components/VendorCard';
import { vendorService } from '../services/api';

const Home = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    foodType: 'all',
    location: ''
  });

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      const data = await vendorService.getAllVendors(filters);
      setVendors(data);
      setError(null);
    } catch (err) {
      setError('Failed to load vendors. Please try again.');
      console.error('Error fetching vendors:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="mobile-container">
      <div className="content-wrapper">
        <div className="page-header">
          <h1 className="page-title">Find Surprise Bags</h1>
          <p className="page-subtitle">
            Save money and reduce waste with discounted food from local vendors
          </p>
        </div>

        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Finding fresh deals for you...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchVendors}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && vendors.length === 0 && (
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🔍</div>
            <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>No vendors found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Try adjusting your search filters or check back later for new deals.
            </p>
          </div>
        )}

        {!loading && !error && vendors.length > 0 && (
          <>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 'var(--spacing-md)'
            }}>
              <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>
                {vendors.length} vendor{vendors.length !== 1 ? 's' : ''} available
              </h3>
              <div style={{ 
                fontSize: '0.9rem', 
                color: 'var(--text-secondary)' 
              }}>
                🕐 Updated now
              </div>
            </div>
            
            <div className="vendor-grid fade-in">
              {vendors.map(vendor => (
                <VendorCard key={vendor._id} vendor={vendor} />
              ))}
            </div>
          </>
        )}

        {/* Info Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
          color: 'white',
          padding: 'var(--spacing-lg)',
          borderRadius: 'var(--border-radius)',
          textAlign: 'center',
          margin: 'var(--spacing-xl) 0'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>🌱</div>
          <div style={{ fontWeight: '700', marginBottom: 'var(--spacing-xs)' }}>
            Join the Food Rescue Movement
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Every surprise bag purchased helps reduce food waste and supports local businesses in Namibia
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Home;
