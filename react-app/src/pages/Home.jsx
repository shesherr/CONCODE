import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [countUp, setCountUp] = useState({ users: 0, projects: 0, uptime: 0 });

  // Animated counter
  useEffect(() => {
    const targets = { users: 10000, projects: 5000, uptime: 99 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCountUp({
        users: Math.floor(targets.users * eased),
        projects: Math.floor(targets.projects * eased),
        uptime: Math.floor(targets.uptime * eased),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      title: 'Lightning Fast',
      description: 'Built on Vite, experiencing lightning-fast HMR and optimized production builds that load in a blink.',
      icon: '⚡',
      gradient: 'linear-gradient(135deg, #f59e0b33, #f59e0b11)',
      borderGlow: '#f59e0b'
    },
    {
      title: 'Modern Aesthetics',
      description: 'Carefully crafted with glassmorphism, dynamic gradients, and smooth micro-interactions that delight users.',
      icon: '✨',
      gradient: 'linear-gradient(135deg, #8b5cf633, #8b5cf611)',
      borderGlow: '#8b5cf6'
    },
    {
      title: 'Fully Responsive',
      description: 'Looks perfect on every device, from the smallest smartphone to the largest ultra-wide monitor.',
      icon: '📱',
      gradient: 'linear-gradient(135deg, #3b82f633, #3b82f611)',
      borderGlow: '#3b82f6'
    }
  ];

  const techStack = [
    { name: 'React', icon: '⚛️' },
    { name: 'Vite', icon: '⚡' },
    { name: 'Node.js', icon: '🟢' },
    { name: 'MySQL', icon: '🗄️' },
    { name: 'Express', icon: '🚀' },
    { name: 'JWT', icon: '🔐' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          <span>Now in Beta — Join the revolution</span>
        </div>
        <h1>
          Code. Create. <br />
          <span className="highlight animated-gradient">Conquer.</span>
        </h1>
        <p className="hero-subtitle">
          The next-generation development platform that combines blazing speed,<br />
          beautiful design, and powerful tools — all in one place.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="cta-button">
            <span>Start Building Free</span>
            <span className="cta-arrow">→</span>
          </Link>
          <Link to="/features" className="cta-secondary">
            <span className="play-icon">▶</span>
            <span>Explore Features</span>
          </Link>
        </div>

        {/* Stats strip */}
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-num">{countUp.users.toLocaleString()}+</span>
            <span className="stat-text">Developers</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-num">{countUp.projects.toLocaleString()}+</span>
            <span className="stat-text">Projects</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-num">{countUp.uptime}%</span>
            <span className="stat-text">Uptime</span>
          </div>
        </div>
      </section>

      {/* Tech Stack Marquee */}
      <section className="tech-marquee-section">
        <p className="marquee-label">Powered by modern technologies</p>
        <div className="marquee-track">
          <div className="marquee-content">
            {[...techStack, ...techStack].map((tech, index) => (
              <div key={index} className="tech-badge">
                <span>{tech.icon}</span>
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-tag">Features</span>
          <h2>Everything you need to <span className="highlight">ship faster</span></h2>
          <p>Built for developers who demand excellence in every aspect of their workflow.</p>
        </div>
        <div className="features">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-card feature-card"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                '--card-glow': feature.borderGlow,
                transform: hoveredCard === index ? 'translateY(-12px)' : 'translateY(0)',
                boxShadow: hoveredCard === index 
                  ? `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px ${feature.borderGlow}22`
                  : 'var(--glass-shadow)',
                borderColor: hoveredCard === index ? `${feature.borderGlow}44` : 'var(--glass-border)'
              }}
            >
              <div className="feature-icon" style={{ background: feature.gradient }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <div className="card-shine"></div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-card glass-card">
          <h2>Ready to build something <span className="highlight">amazing</span>?</h2>
          <p>Join thousands of developers who trust CONCODE for their projects.</p>
          <div className="cta-actions">
            <Link to="/register" className="cta-button">
              <span>Create Free Account</span>
              <span className="cta-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
