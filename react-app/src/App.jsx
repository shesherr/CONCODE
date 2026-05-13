import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Features from './pages/Features';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './index.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Dashboard has its own layout, so we render it separately
function AppRoutes() {
  const { pathname } = useLocation();
  const isDashboard = pathname === '/dashboard';

  if (isDashboard) {
    return <Dashboard />;
  }

  return <AppContent />;
}

function AppContent() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem('user');
    if (s) setUser(JSON.parse(s));
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="app-wrapper">
      <ScrollToTop />

      <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="header-inner">
          <NavLink to="/" className="logo-link">
            <img 
              src="https://concordrealestatebd.com/wp-content/themes/concord/assets/logo/blue_logo.svg" 
              alt="Concord Logo" 
              className="logo-img"
            />
          </NavLink>

          <nav className="nav-links">
            <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}>Home</NavLink>
            <NavLink to="/features" className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}>Features</NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}>About</NavLink>
            <NavLink to="/contact" className={({ isActive }) => `nav-item ${isActive ? 'nav-active' : ''}`}>Contact</NavLink>
          </nav>

          <div className="auth-buttons">
            {user ? (
              <div className="user-menu">
                <div className="user-avatar">{user.fullName?.charAt(0)?.toUpperCase() || 'U'}</div>
                <span className="user-name">{user.fullName}</span>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
              </div>
            ) : (
              <>
                <NavLink to="/login" className="btn-login">Sign In</NavLink>
                <NavLink to="/register" className="btn-register">Get Started →</NavLink>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      {/* Google Map Section */}
      <section className="map-section">
        <div className="map-header">
          <h2>Find Us on the Map</h2>
          <p>Concord Centre, 43 North Avenue, Gulshan-2, Dhaka-1212</p>
        </div>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.002539771984!2d90.41280437448776!3d23.79329548712831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c70071a7f419%3A0x5bb13b1f2a2e58e8!2sConcord%20Real%20Estate%20%26%20Engineering%20Ltd!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Concord Real Estate Location"
          ></iframe>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <img 
                src="https://concordrealestatebd.com/wp-content/themes/concord/assets/logo/blue_logo.svg" 
                alt="Concord Logo" 
                className="footer-logo-img"
              />
              <p className="footer-desc">One of Bangladesh's leading real estate & construction companies, building dreams since 1972.</p>
            </div>
            <div className="footer-links-grid">
              <div className="footer-col">
                <h4>Quick Links</h4>
                <NavLink to="/features">Features</NavLink>
                <NavLink to="/about">About Us</NavLink>
                <NavLink to="/contact">Contact</NavLink>
              </div>
              <div className="footer-col">
                <h4>Account</h4>
                <NavLink to="/login">Sign In</NavLink>
                <NavLink to="/register">Register</NavLink>
              </div>
              <div className="footer-col">
                <h4>Contact</h4>
                <span>📞 09612-111444</span>
                <span>📧 info@concordrealestatebd.com</span>
                <span>📍 Gulshan-2, Dhaka</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Concord Real Estate & Engineering Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
