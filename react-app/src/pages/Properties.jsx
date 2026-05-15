import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const defaultProperties = [
  {
    id: 1,
    name: 'Concord Gulshan Heights',
    type: 'Residential',
    location: 'Gulshan-2, Dhaka',
    price: '৳85M',
    size: '3,500 sqft',
    bedrooms: 4,
    bathrooms: 4,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    features: ['Swimming Pool', 'Garden', 'Parking', '24/7 Security'],
    description: 'Luxurious residential apartment in the heart of Gulshan with premium finishes and modern amenities.'
  },
  {
    id: 2,
    name: 'Concord Banani Tower',
    type: 'Commercial',
    location: 'Banani-11, Dhaka',
    price: '৳120M',
    size: '5,000 sqft',
    bedrooms: 0,
    bathrooms: 3,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    features: ['Office Space', 'Conference Room', 'Parking', 'Elevator'],
    description: 'Prime commercial space perfect for multinational companies and startups.'
  },
  {
    id: 3,
    name: 'Concord Dhanmondi Residencia',
    type: 'Residential',
    location: 'Dhanmondi-27, Dhaka',
    price: '৳65M',
    size: '2,800 sqft',
    bedrooms: 3,
    bathrooms: 3,
    status: 'Sold Out',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
    features: ['Rooftop Garden', 'Gym', 'Parking', 'Community Hall'],
    description: 'Elegant living spaces designed for families who appreciate comfort and convenience.'
  },
  {
    id: 4,
    name: 'Concord Uttara Commercial Hub',
    type: 'Commercial',
    location: 'Uttara-7, Dhaka',
    price: '৳200M',
    size: '8,000 sqft',
    bedrooms: 0,
    bathrooms: 5,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    features: ['Retail Space', 'Warehouse', 'Parking', 'Loading Bay'],
    description: 'Strategically located commercial hub ideal for retail and business operations.'
  },
  {
    id: 5,
    name: 'Concord Mirpur Plaza',
    type: 'Mixed Use',
    location: 'Mirpur-10, Dhaka',
    price: '৳45M',
    size: '2,200 sqft',
    bedrooms: 2,
    bathrooms: 2,
    status: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=800&h=600&fit=crop',
    features: ['Shop & Office', 'Parking', 'Power Backup', 'Security'],
    description: 'Versatile mixed-use property combining retail and office spaces.'
  },
  {
    id: 6,
    name: 'Concord Baridhara Heights',
    type: 'Residential',
    location: 'Baridhara, Dhaka',
    price: '৳150M',
    size: '4,500 sqft',
    bedrooms: 5,
    bathrooms: 5,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    features: ['Lake View', 'Private Elevator', 'Concierge', 'Spa'],
    description: 'Ultra-luxury penthouse with breathtaking views and world-class amenities.'
  }
];

function Properties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('concord_properties');
    return saved ? JSON.parse(saved) : defaultProperties;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('concord_properties', JSON.stringify(properties));
  }, [properties]);

  const filteredProperties = properties
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || p.type === filterType;
      const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'price') {
        return parseFloat(a.price.replace(/[৳M,]/g, '')) - parseFloat(b.price.replace(/[৳M,]/g, ''));
      }
      if (sortBy === 'size') {
        return parseFloat(a.size.replace(/[, sqft]/g, '')) - parseFloat(b.size.replace(/[, sqft]/g, ''));
      }
      return a.name.localeCompare(b.name);
    });

  const types = ['All', ...new Set(properties.map(p => p.type))];
  const statuses = ['All', ...new Set(properties.map(p => p.status))];

  const statusColors = {
    'Available': '#10b981',
    'Sold Out': '#ef4444',
    'Coming Soon': '#f59e0b'
  };

  const handleInquire = (property) => {
    navigate('/contact', { state: { subject: `Inquiry about ${property.name}` } });
  };

  return (
    <section className="properties-section">
      <div className="properties-header">
        <div className="properties-hero">
          <h1>Our Properties</h1>
          <p>Discover your dream space with Concord's premium real estate offerings</p>
        </div>

        <div className="properties-filters">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              {types.map(type => (
                <option key={type} value={type}>{type === 'All' ? 'All Types' : type}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status === 'All' ? 'All Status' : status}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="size">Sort by Size</option>
            </select>
          </div>

          <div className="results-count">
            Showing {filteredProperties.length} of {properties.length} properties
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading properties...</p>
        </div>
      ) : (
        <div className="properties-grid">
          {filteredProperties.map((property, index) => (
            <div
              key={property.id}
              className="property-card"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedProperty(property)}
            >
              <div className="property-image-wrapper">
                <img src={property.image} alt={property.name} className="property-image" />
                <span
                  className="property-status"
                  style={{ backgroundColor: statusColors[property.status] }}
                >
                  {property.status}
                </span>
                <span className="property-type">{property.type}</span>
              </div>

              <div className="property-content">
                <h3 className="property-name">{property.name}</h3>
                <p className="property-location">📍 {property.location}</p>

                <div className="property-specs">
                  <div className="spec-item">
                    <span className="spec-icon">📐</span>
                    <span>{property.size}</span>
                  </div>
                  {property.bedrooms > 0 && (
                    <div className="spec-item">
                      <span className="spec-icon">🛏️</span>
                      <span>{property.bedrooms} Beds</span>
                    </div>
                  )}
                  <div className="spec-item">
                    <span className="spec-icon">🚿</span>
                    <span>{property.bathrooms} Baths</span>
                  </div>
                </div>

                <div className="property-features">
                  {property.features.slice(0, 3).map((feature, i) => (
                    <span key={i} className="feature-tag">✓ {feature}</span>
                  ))}
                </div>

                <div className="property-footer">
                  <span className="property-price">{property.price}</span>
                  <button
                    className="property-cta"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInquire(property);
                    }}
                  >
                    Inquire Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProperties.length === 0 && !loading && (
        <div className="no-results">
          <span className="no-results-icon">🔍</span>
          <h3>No properties found</h3>
          <p>Try adjusting your filters or search terms</p>
          <button
            className="clear-filters-btn"
            onClick={() => {
              setSearchTerm('');
              setFilterType('All');
              setFilterStatus('All');
            }}
          >
            Clear All Filters
          </button>
        </div>
      )}

      {selectedProperty && (
        <div className="property-modal" onClick={() => setSelectedProperty(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProperty(null)}>✕</button>
            <img src={selectedProperty.image} alt={selectedProperty.name} className="modal-image" />
            <div className="modal-details">
              <h2>{selectedProperty.name}</h2>
              <p className="modal-location">📍 {selectedProperty.location}</p>
              <p className="modal-description">{selectedProperty.description}</p>

              <div className="modal-specs">
                <div className="modal-spec">
                  <span className="spec-label">Type</span>
                  <span className="spec-value">{selectedProperty.type}</span>
                </div>
                <div className="modal-spec">
                  <span className="spec-label">Size</span>
                  <span className="spec-value">{selectedProperty.size}</span>
                </div>
                {selectedProperty.bedrooms > 0 && (
                  <div className="modal-spec">
                    <span className="spec-label">Bedrooms</span>
                    <span className="spec-value">{selectedProperty.bedrooms}</span>
                  </div>
                )}
                <div className="modal-spec">
                  <span className="spec-label">Bathrooms</span>
                  <span className="spec-value">{selectedProperty.bathrooms}</span>
                </div>
                <div className="modal-spec">
                  <span className="spec-label">Price</span>
                  <span className="spec-value price-highlight">{selectedProperty.price}</span>
                </div>
              </div>

              <div className="modal-features">
                <h4>Features & Amenities</h4>
                <div className="features-grid">
                  {selectedProperty.features.map((feature, i) => (
                    <span key={i} className="feature-badge">✓ {feature}</span>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button className="modal-cta-primary" onClick={() => handleInquire(selectedProperty)}>
                  Request Information
                </button>
                <button className="modal-cta-secondary" onClick={() => setSelectedProperty(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Properties;
