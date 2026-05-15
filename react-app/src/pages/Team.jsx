import React, { useState } from 'react';

const teamMembers = [
  {
    id: 1,
    name: 'Mohiuddin Monem',
    role: 'Chairman',
    department: 'Board of Directors',
    bio: 'Leading Concord Group with over 40 years of experience in construction and real estate development. A visionary leader who has transformed Bangladesh\'s skyline.',
    email: 'chairman@concord.com',
    phone: '+880 2 55012345',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
    social: {
      linkedin: '#',
      twitter: '#'
    },
    achievements: ['Industry Leader Award 2025', '50+ Years of Excellence']
  },
  {
    id: 2,
    name: 'Shishir Arafat',
    role: 'Managing Director',
    department: 'Executive Management',
    bio: 'Engineering graduate with 15 years of experience in real estate development. Spearheading digital transformation and modern construction practices at Concord.',
    email: 'md@concord.com',
    phone: '+880 2 55012346',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    social: {
      linkedin: '#',
      twitter: '#'
    },
    achievements: ['Best Project Manager 2024', 'Innovation in Construction']
  },
  {
    id: 3,
    name: 'Barsa Akter',
    role: 'Director of Operations',
    department: 'Operations',
    bio: 'MBA from Dhaka University with 12 years of experience in project management. Ensuring seamless operations across all Concord projects.',
    email: 'barsa@concord.com',
    phone: '+880 2 55012347',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    social: {
      linkedin: '#',
      twitter: '#'
    },
    achievements: ['Operations Excellence 2024', 'Team Leadership Award']
  },
  {
    id: 4,
    name: 'Rahim Uddin',
    role: 'Chief Engineer',
    department: 'Engineering',
    bio: 'Civil engineering expert with 20 years of experience. Leading the technical team in delivering quality construction and innovative building solutions.',
    email: 'rahim@concord.com',
    phone: '+880 2 55012348',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    social: {
      linkedin: '#',
      twitter: '#'
    },
    achievements: ['Engineering Excellence 2025', 'Quality Champion']
  },
  {
    id: 5,
    name: 'Fatima Noor',
    role: 'Head of Design',
    department: 'Architecture & Design',
    bio: 'Architecture graduate from BUET with international exposure. Creating stunning, functional spaces that define modern living in Bangladesh.',
    email: 'fatima@concord.com',
    phone: '+880 2 55012349',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    social: {
      linkedin: '#',
      twitter: '#'
    },
    achievements: ['Best Design Award 2024', 'Innovative Architecture']
  },
  {
    id: 6,
    name: 'Karim Ahmed',
    role: 'Sales Director',
    department: 'Sales & Marketing',
    bio: 'Marketing professional with 18 years of real estate sales experience. Leading the sales team to achieve record-breaking numbers year after year.',
    email: 'karim@concord.com',
    phone: '+880 2 55012350',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face',
    social: {
      linkedin: '#',
      twitter: '#'
    },
    achievements: ['Sales Champion 2024', 'Customer Excellence']
  },
  {
    id: 7,
    name: 'Sarah Rahman',
    role: 'Customer Relations Manager',
    department: 'Customer Service',
    bio: 'Customer service specialist ensuring exceptional experience for all Concord clients. Building lasting relationships through trust and transparency.',
    email: 'sarah@concord.com',
    phone: '+880 2 55012351',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop&crop=face',
    social: {
      linkedin: '#',
      twitter: '#'
    },
    achievements: ['Customer Service Excellence 2025', 'Client Satisfaction Award']
  },
  {
    id: 8,
    name: 'Jamal Hossain',
    role: 'Finance Manager',
    department: 'Finance & Accounts',
    bio: 'Chartered accountant managing Concord\'s financial operations. Ensuring fiscal discipline and financial transparency across all projects.',
    email: 'jamal@concord.com',
    phone: '+880 2 55012352',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    social: {
      linkedin: '#',
      twitter: '#'
    },
    achievements: ['Financial Reporting Excellence 2024', 'Cost Optimization Champion']
  },
  {
    id: 9,
    name: 'Nasreen Akter',
    role: 'HR Director',
    department: 'Human Resources',
    bio: 'HR professional creating a positive work environment and building Concord\'s talented workforce. Implementing best practices in employee development.',
    email: 'nasreen@concord.com',
    phone: '+880 2 55012353',
    image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop&crop=face',
    social: {
      linkedin: '#',
      twitter: '#'
    },
    achievements: ['HR Leadership Award 2025', 'Best Workplace Initiative']
  },
  {
    id: 10,
    name: 'Tanvir Hassan',
    role: 'IT Manager',
    department: 'Information Technology',
    bio: 'Technology expert driving digital transformation at Concord. Implementing cutting-edge solutions for smart buildings and efficient operations.',
    email: 'tanvir@concord.com',
    phone: '+880 2 55012354',
    image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face',
    social: {
      linkedin: '#',
      twitter: '#'
    },
    achievements: ['Digital Innovation Award 2024', 'Smart Home Integration']
  },
  {
    id: 11,
    name: 'Rashida Begum',
    role: 'Legal Advisor',
    department: 'Legal Affairs',
    bio: 'Legal expert ensuring compliance and protecting Concord\'s interests. Providing guidance on regulatory matters and contract management.',
    email: 'rashida@concord.com',
    phone: '+880 2 55012355',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&crop=face',
    social: {
      linkedin: '#',
      twitter: '#'
    },
    achievements: ['Legal Excellence 2025', 'Compliance Champion']
  },
  {
    id: 12,
    name: 'Habib Rahman',
    role: 'Site Supervisor',
    department: 'Construction',
    bio: 'Experienced construction supervisor ensuring quality and safety at Concord sites. Leading on-ground teams to deliver projects on time.',
    email: 'habib@concord.com',
    phone: '+880 2 55012356',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=400&fit=crop&crop=face',
    social: {
      linkedin: '#',
      twitter: '#'
    },
    achievements: ['Safety Champion 2024', 'Quality Supervisor']
  }
];

const departments = ['All', ...new Set(teamMembers.map(m => m.department))];

function Team() {
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedMember, setSelectedMember] = useState(null);

  const filteredMembers = teamMembers.filter(m =>
    selectedDepartment === 'All' || m.department === selectedDepartment
  );

  const handleMemberClick = (member) => {
    setSelectedMember(member);
  };

  return (
    <section className="team-section">
      <div className="team-header">
        <h1>Our Leadership Team</h1>
        <p>Meet the experienced professionals building Concord's legacy</p>
        <div className="team-stats">
          <div className="stat">
            <span className="stat-number">50+</span>
            <span className="stat-label">Years of Excellence</span>
          </div>
          <div className="stat">
            <span className="stat-number">500+</span>
            <span className="stat-label">Team Members</span>
          </div>
          <div className="stat">
            <span className="stat-number">50+</span>
            <span className="stat-label">Projects Completed</span>
          </div>
          <div className="stat">
            <span className="stat-number">98%</span>
            <span className="stat-label">Customer Satisfaction</span>
          </div>
        </div>
      </div>

      <div className="team-filters">
        <span className="filter-label">Filter by Department:</span>
        <div className="department-tabs">
          {departments.map(dept => (
            <button
              key={dept}
              className={`dept-tab ${selectedDepartment === dept ? 'dept-active' : ''}`}
              onClick={() => setSelectedDepartment(dept)}
            >
              {dept === 'All' ? 'All Departments' : dept}
            </button>
          ))}
        </div>
      </div>

      <div className="team-grid">
        {filteredMembers.map((member, index) => (
          <div
            key={member.id}
            className="team-card"
            style={{ animationDelay: `${index * 0.08}s` }}
            onClick={() => handleMemberClick(member)}
          >
            <div className="member-image-wrapper">
              <img src={member.image} alt={member.name} className="member-image" />
              <div className="member-overlay">
                <button className="view-profile-btn">View Profile</button>
              </div>
            </div>

            <div className="member-info">
              <h3 className="member-name">{member.name}</h3>
              <p className="member-role">{member.role}</p>
              <p className="member-department">{member.department}</p>

              <div className="member-contact">
                <a href={`mailto:${member.email}`} className="contact-link" onClick={(e) => e.stopPropagation()}>
                  📧 Email
                </a>
                <a href={`tel:${member.phone}`} className="contact-link" onClick={(e) => e.stopPropagation()}>
                  📞 Call
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMember && (
        <div className="member-modal" onClick={() => setSelectedMember(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedMember(null)}>✕</button>

            <div className="modal-body">
              <div className="modal-image-section">
                <img src={selectedMember.image} alt={selectedMember.name} className="modal-image" />
                <div className="modal-basic-info">
                  <h2>{selectedMember.name}</h2>
                  <p className="modal-role">{selectedMember.role}</p>
                  <p className="modal-department">{selectedMember.department}</p>
                </div>
              </div>

              <div className="modal-details">
                <div className="modal-section">
                  <h3>About</h3>
                  <p className="modal-bio">{selectedMember.bio}</p>
                </div>

                <div className="modal-section">
                  <h3>Contact Information</h3>
                  <div className="contact-grid">
                    <div className="contact-item">
                      <span className="contact-label">📧 Email</span>
                      <a href={`mailto:${selectedMember.email}`} className="contact-value">
                        {selectedMember.email}
                      </a>
                    </div>
                    <div className="contact-item">
                      <span className="contact-label">📞 Phone</span>
                      <a href={`tel:${selectedMember.phone}`} className="contact-value">
                        {selectedMember.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {selectedMember.achievements && selectedMember.achievements.length > 0 && (
                  <div className="modal-section">
                    <h3>Achievements & Awards</h3>
                    <div className="achievements-list">
                      {selectedMember.achievements.map((achievement, index) => (
                        <div key={index} className="achievement-badge">
                          🏆 {achievement}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="modal-section">
                  <h3>Connect</h3>
                  <div className="social-links">
                    {selectedMember.social?.linkedin && (
                      <a href={selectedMember.social.linkedin} className="social-link">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                    )}
                    {selectedMember.social?.twitter && (
                      <a href={selectedMember.social.twitter} className="social-link">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>

                <div className="modal-actions">
                  <a href={`mailto:${selectedMember.email}`} className="modal-cta-primary">
                    📧 Send Email
                  </a>
                  <a href={`tel:${selectedMember.phone}`} className="modal-cta-secondary">
                    📞 Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Team;
