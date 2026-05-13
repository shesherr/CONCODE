import React, { useState } from 'react';

function Features() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const allFeatures = [
    {
      title: 'Lightning Fast',
      description: 'Built on Vite, experiencing lightning-fast HMR and optimized production builds that load in a blink.',
      icon: '⚡',
      details: 'Vite leverages native ES modules and esbuild for near-instant server starts and blazing fast hot module replacement.'
    },
    {
      title: 'Modern Aesthetics',
      description: 'Carefully crafted with glassmorphism, dynamic gradients, and smooth micro-interactions that delight users.',
      icon: '✨',
      details: 'Every pixel is designed with purpose — from subtle backdrop blurs to elegant gradient transitions that feel premium.'
    },
    {
      title: 'Fully Responsive',
      description: 'Looks perfect on every device, from the smallest smartphone to the largest ultra-wide monitor.',
      icon: '📱',
      details: 'Fluid layouts and adaptive breakpoints ensure your content shines on any screen size or orientation.'
    },
    {
      title: 'Component-Based',
      description: 'Built with React\'s component architecture for modular, reusable, and maintainable code.',
      icon: '🧩',
      details: 'Each UI element is self-contained and composable, making it easy to build complex interfaces from simple building blocks.'
    },
    {
      title: 'Developer Experience',
      description: 'Enjoy fast refresh, intuitive APIs, and powerful debugging tools that make development a joy.',
      icon: '🛠️',
      details: 'From hot reload to comprehensive error overlays, every tool is optimized for maximum developer productivity.'
    },
    {
      title: 'Production Ready',
      description: 'Optimized builds with tree-shaking, code splitting, and asset optimization out of the box.',
      icon: '🚀',
      details: 'Ship confidently with optimized bundles, automatic code splitting, and built-in performance best practices.'
    }
  ];

  return (
    <section className="page-section">
      <div className="page-header">
        <h1>
          Our <span className="highlight">Features</span>
        </h1>
        <p className="page-subtitle">
          Everything you need to build stunning, high-performance web applications.
        </p>
      </div>

      <div className="features-grid">
        {allFeatures.map((feature, index) => (
          <div 
            key={index} 
            className="glass-card feature-detail-card"
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              transform: hoveredCard === index ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
              boxShadow: hoveredCard === index ? '0 20px 40px rgba(0, 0, 0, 0.4)' : 'var(--glass-shadow)'
            }}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <p className="feature-details">{feature.details}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
