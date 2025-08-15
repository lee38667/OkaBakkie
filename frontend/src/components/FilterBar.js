import React from 'react';

const FilterBar = ({ filters, onFilterChange }) => {
  const foodTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'bakery', label: 'Bakery' },
    { value: 'cafe', label: 'Café' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'grocery', label: 'Grocery' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="filter-bar">
      <div className="filter-row">
        <div className="filter-group">
          <label className="filter-label">Search Vendors</label>
          <input
            type="text"
            className="filter-input"
            placeholder="Search by vendor name..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Food Type</label>
          <select
            className="filter-select"
            value={filters.foodType}
            onChange={(e) => onFilterChange('foodType', e.target.value)}
          >
            {foodTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Location (optional)</label>
          <input
            type="text"
            className="filter-input"
            placeholder="Enable location for nearby results"
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
