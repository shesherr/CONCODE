import React from 'react';

function About() {
  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '50+', label: 'Components' },
    { value: '24/7', label: 'Support' }
  ];

  const team = [
    { name: 'Alex Chen', role: 'Lead Developer', emoji: '👨‍💻' },
    { name: 'Sarah Kim', role: 'UI/UX Designer', emoji: '👩‍🎨' },
    { name: 'James Park', role: 'Backend Engineer', emoji: '🧑‍🔧' },
  ];

  return (
    <section className="page-section">
      <div className="page-header">
        <h1>
          About <span className="highlight">CONCODE</span>
        </h1>
        <p className="page-subtitle">
          We're building the next generation of web development tools — elegant, fast, and developer-friendly.
        </p>
      </div>

      <div className="about-content">
        <div className="glass-card about-story">
          <h2>Our Story</h2>
          <p>
            CONCODE was born from a simple idea: web development should be beautiful, fast, and enjoyable.
            We combined the power of React with the speed of Vite and wrapped it all in a stunning, 
            modern design system.
          </p>
          <p>
            Our mission is to empower developers with tools that not only look incredible but also 
            perform flawlessly. Every component, every animation, and every interaction is crafted 
            with care and precision.
          </p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="glass-card stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="team-section">
          <h2 className="section-title">Meet the Team</h2>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="glass-card team-card">
                <div className="team-avatar">{member.emoji}</div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
