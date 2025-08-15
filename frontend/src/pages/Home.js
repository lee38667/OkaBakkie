import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
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

  useEffect(() => {
    fetchVendors();
  }, [filters]);

  const fetchVendors = async () => {
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
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div>
      <Navigation />
      
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Available Surprise Bags Near You</h1>
          <p className="page-subtitle">
            Discover amazing deals on fresh food while helping reduce waste
          </p>
        </div>

        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        {loading && (
          <div className="loading">
            <p>Loading vendors...</p>
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
          <div className="loading">
            <p>No vendors found matching your criteria.</p>
          </div>
        )}

        {!loading && !error && vendors.length > 0 && (
          <div className="vendor-grid">
            {vendors.map(vendor => (
              <VendorCard key={vendor._id} vendor={vendor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
