import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    { icon: '📧', label: 'Email', value: 'hello@concode.com' },
    { icon: '📍', label: 'Location', value: 'Concord Centre, 43 North Avenue, Gulshan-2, Dhaka-1212' },
    { icon: '🕐', label: 'Hours', value: 'Mon - Fri, 9AM - 6PM' }
  ];

  return (
    <section className="page-section">
      <div className="page-header">
        <h1>
          Get in <span className="highlight">Touch</span>
        </h1>
        <p className="page-subtitle">
          Have a question or want to collaborate? We'd love to hear from you.
        </p>
      </div>

      <div className="contact-layout">
        <div className="glass-card contact-form-card">
          <h2>Send a Message</h2>
          {submitted && (
            <div className="success-message">
              <span>✅</span> Message sent successfully!
            </div>
          )}
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What's this about?"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message..."
                rows="5"
                required
              ></textarea>
            </div>
            <button type="submit" className="cta-button submit-btn">
              Send Message
            </button>
          </form>
        </div>

        <div className="contact-info-side">
          {contactInfo.map((item, index) => (
            <div key={index} className="glass-card contact-info-card">
              <div className="contact-info-icon">{item.icon}</div>
              <div>
                <h4>{item.label}</h4>
                <p>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Contact;
