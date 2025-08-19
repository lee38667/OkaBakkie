import React from 'react';

const FilterBar = ({ filters, onFilterChange }) => {
  const foodTypes = [
    { value: 'all', label: '🍽️ All Types', icon: '🍽️' },
    { value: 'bakery', label: '🥖 Bakery', icon: '🥖' },
    { value: 'cafe', label: '☕ Café', icon: '☕' },
    { value: 'restaurant', label: '🍽️ Restaurant', icon: '🍽️' },
    { value: 'grocery', label: '🛒 Grocery', icon: '🛒' },
    { value: 'other', label: '🍕 Other', icon: '🍕' }
  ];

  return (
    <div className="filter-bar">
      <div className="filter-row">
        <div className="filter-group">
          <input
            type="text"
            className="filter-input"
            placeholder="🔍 Search vendors..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
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
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: 'var(--spacing-sm)', 
        marginTop: 'var(--spacing-md)',
        overflowX: 'auto',
        paddingBottom: 'var(--spacing-xs)'
      }}>
        {foodTypes.slice(1).map(type => (
          <button
            key={type.value}
            onClick={() => onFilterChange('foodType', 
              filters.foodType === type.value ? 'all' : type.value
            )}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: 'none',
              borderRadius: '20px',
              background: filters.foodType === type.value 
                ? 'var(--primary-color)' 
                : '#F3F4F6',
              color: filters.foodType === type.value 
                ? 'white' 
                : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {type.icon} {type.label.split(' ')[1]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
