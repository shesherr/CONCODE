import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Custom event name for real-time updates
const PROPERTIES_UPDATE_EVENT = 'concord_properties_update';

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
  const [lastUpdate, setLastUpdate] = useState(null);
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  const [showAddPropertyForm, setShowAddPropertyForm] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: '',
    type: 'Residential',
    location: '',
    price: '',
    size: '',
    bedrooms: 0,
    bathrooms: 0,
    status: 'Available',
    image: '',
    features: '',
    description: ''
  });

  // Load properties from localStorage with real-time sync
  const loadProperties = useCallback(() => {
    const saved = localStorage.getItem('concord_properties');
    if (saved) {
      const loadedProps = JSON.parse(saved);
      setProperties(loadedProps);
      setLastUpdate(new Date());
      setShowUpdateNotification(true);
      setTimeout(() => setShowUpdateNotification(false), 3000);
    }
  }, []);

  // Initial load and localStorage sync
  useEffect(() => {
    localStorage.setItem('concord_properties', JSON.stringify(properties));
  }, [properties]);

  // Listen for storage events from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'concord_properties' && e.newValue) {
        loadProperties();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadProperties]);

  // Listen for custom events from same tab (Dashboard updates)
  useEffect(() => {
    const handlePropertiesUpdate = () => {
      loadProperties();
    };

    window.addEventListener(PROPERTIES_UPDATE_EVENT, handlePropertiesUpdate);
    return () => window.removeEventListener(PROPERTIES_UPDATE_EVENT, handlePropertiesUpdate);
  }, [loadProperties]);

  // Sync with Dashboard projects
  useEffect(() => {
    const syncWithProjects = () => {
      const projects = localStorage.getItem('concord_projects');
      if (projects) {
        const projectList = JSON.parse(projects);
        // Check if we need to sync any projects as properties
        projectList.forEach(project => {
          const existingPropIndex = properties.findIndex(p => p.name === project.name);
          if (existingPropIndex === -1) {
            // Create a new property from the project
            const newProperty = {
              id: properties.length + 1,
              name: project.name,
              type: project.budget !== '—' ? 'Commercial' : 'Residential',
              location: 'Dhaka',
              price: project.budget !== '—' ? project.budget : '৳50M',
              size: '2,500 sqft',
              bedrooms: project.budget !== '—' ? 0 : 3,
              bathrooms: project.budget !== '—' ? 2 : 2,
              status: project.status === 'Completed' ? 'Available' : project.status === 'In Progress' ? 'Coming Soon' : 'Available',
              image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
              features: ['Modern Design', 'Prime Location', 'Quality Construction'],
              description: `New ${project.budget !== '—' ? 'commercial' : 'residential'} project from Concord.`
            };
            setProperties(prev => [...prev, newProperty]);
          }
        });
      }
    };

    syncWithProjects();
  }, []);

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

  const handleSyncProjects = () => {
    const projects = localStorage.getItem('concord_projects');
    if (projects) {
      const projectList = JSON.parse(projects);
      let hasUpdates = false;

      projectList.forEach(project => {
        const existingPropIndex = properties.findIndex(p => p.name === project.name);
        if (existingPropIndex === -1) {
          // Create a new property from the project
          const newProperty = {
            id: Date.now() + Math.random(),
            name: project.name,
            type: project.budget !== '—' ? 'Commercial' : 'Residential',
            location: 'Dhaka',
            price: project.budget !== '—' ? project.budget : '৳50M',
            size: '2,500 sqft',
            bedrooms: project.budget !== '—' ? 0 : 3,
            bathrooms: project.budget !== '—' ? 2 : 2,
            status: project.status === 'Completed' ? 'Available' : project.status === 'In Progress' ? 'Coming Soon' : 'Available',
            image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
            features: ['Modern Design', 'Prime Location', 'Quality Construction'],
            description: `New ${project.budget !== '—' ? 'commercial' : 'residential'} project from Concord.`
          };
          setProperties(prev => [...prev, newProperty]);
          hasUpdates = true;
        }
      });

      if (hasUpdates) {
        setLastUpdate(new Date());
        setShowUpdateNotification(true);
        setTimeout(() => setShowUpdateNotification(false), 3000);
      }
    }
  };

  const handleAddProperty = (e) => {
    e.preventDefault();

    const propertyToAdd = {
      id: Date.now(),
      ...newProperty,
      bedrooms: Number(newProperty.bedrooms),
      bathrooms: Number(newProperty.bathrooms),
      features: newProperty.features.split(',').map(f => f.trim()).filter(f => f),
      image: newProperty.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'
    };

    setProperties(prev => [...prev, propertyToAdd]);
    setShowAddPropertyForm(false);
    setNewProperty({
      name: '',
      type: 'Residential',
      location: '',
      price: '',
      size: '',
      bedrooms: 0,
      bathrooms: 0,
      status: 'Available',
      image: '',
      features: '',
      description: ''
    });

    setLastUpdate(new Date());
    setShowUpdateNotification(true);
    setTimeout(() => setShowUpdateNotification(false), 3000);
  };

  return (
    <section className="properties-section">
      {/* Real-time Update Notification */}
      {showUpdateNotification && (
        <div className="update-notification">
          <span className="notification-icon">🔄</span>
          <span className="notification-text">Properties updated in real-time!</span>
          <span className="notification-time">
            {lastUpdate && lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      )}

      <div className="properties-header">
        <div className="properties-hero">
          <h1>Our Properties</h1>
          <p>Discover your dream space with Concord's premium real estate offerings</p>
          {lastUpdate && (
            <div className="last-update-info">
              <span className="update-indicator"></span>
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>

        <div className="properties-filters">
          <div className="properties-actions">
            <button onClick={handleSyncProjects} className="sync-btn" title="Sync with Dashboard projects">
              🔄 Sync Projects
            </button>
            <button onClick={() => setShowAddPropertyForm(!showAddPropertyForm)} className="add-property-btn">
              + Add Property
            </button>
          </div>

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

      {showAddPropertyForm && (
        <div className="dash-card" style={{ marginBottom: '1.5rem', border: '1px solid var(--accent)' }}>
          <div className="dash-card-header">
            <h3>Add New Property</h3>
            <button onClick={() => setShowAddPropertyForm(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
          </div>
          <form onSubmit={handleAddProperty} className="auth-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Property Name</label>
              <div className="input-wrapper"><input type="text" required value={newProperty.name} onChange={e => setNewProperty({ ...newProperty, name: e.target.value })} /></div>
            </div>
            <div className="form-group">
              <label>Type</label>
              <div className="input-wrapper" style={{ padding: '0 1rem' }}>
                <select value={newProperty.type} onChange={e => setNewProperty({ ...newProperty, type: e.target.value })} style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', outline: 'none' }}>
                  <option value="Residential" style={{ background: '#0f1424' }}>Residential</option>
                  <option value="Commercial" style={{ background: '#0f1424' }}>Commercial</option>
                  <option value="Mixed Use" style={{ background: '#0f1424' }}>Mixed Use</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Location</label>
              <div className="input-wrapper"><input type="text" required value={newProperty.location} onChange={e => setNewProperty({ ...newProperty, location: e.target.value })} /></div>
            </div>
            <div className="form-group">
              <label>Price</label>
              <div className="input-wrapper"><input type="text" required placeholder="e.g. ৳50M" value={newProperty.price} onChange={e => setNewProperty({ ...newProperty, price: e.target.value })} /></div>
            </div>
            <div className="form-group">
              <label>Size</label>
              <div className="input-wrapper"><input type="text" required placeholder="e.g. 2,500 sqft" value={newProperty.size} onChange={e => setNewProperty({ ...newProperty, size: e.target.value })} /></div>
            </div>
            <div className="form-group">
              <label>Status</label>
              <div className="input-wrapper" style={{ padding: '0 1rem' }}>
                <select value={newProperty.status} onChange={e => setNewProperty({ ...newProperty, status: e.target.value })} style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', outline: 'none' }}>
                  <option value="Available" style={{ background: '#0f1424' }}>Available</option>
                  <option value="Sold Out" style={{ background: '#0f1424' }}>Sold Out</option>
                  <option value="Coming Soon" style={{ background: '#0f1424' }}>Coming Soon</option>
                </select>
              </div>
            </div>
            {newProperty.type === 'Residential' && (
              <>
                <div className="form-group">
                  <label>Bedrooms</label>
                  <div className="input-wrapper"><input type="number" min="0" value={newProperty.bedrooms} onChange={e => setNewProperty({ ...newProperty, bedrooms: e.target.value })} /></div>
                </div>
                <div className="form-group">
                  <label>Bathrooms</label>
                  <div className="input-wrapper"><input type="number" min="0" value={newProperty.bathrooms} onChange={e => setNewProperty({ ...newProperty, bathrooms: e.target.value })} /></div>
                </div>
              </>
            )}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Features (comma separated)</label>
              <div className="input-wrapper"><input type="text" placeholder="Swimming Pool, Garden, Parking" value={newProperty.features} onChange={e => setNewProperty({ ...newProperty, features: e.target.value })} /></div>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Description</label>
              <div className="input-wrapper"><textarea required value={newProperty.description} onChange={e => setNewProperty({ ...newProperty, description: e.target.value })} style={{ width: '100%', minHeight: '80px', background: 'transparent', border: 'none', color: '#fff', outline: 'none', padding: '10px', resize: 'vertical' }} /></div>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Image URL (optional)</label>
              <div className="input-wrapper"><input type="url" placeholder="https://..." value={newProperty.image} onChange={e => setNewProperty({ ...newProperty, image: e.target.value })} /></div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="dash-btn-primary" style={{ width: '100%' }}>Add Property</button>
            </div>
          </form>
        </div>
      )}

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

// Helper function to trigger real-time updates from other components
export const triggerPropertiesUpdate = () => {
  window.dispatchEvent(new CustomEvent(PROPERTIES_UPDATE_EVENT));
};

export default Properties;
