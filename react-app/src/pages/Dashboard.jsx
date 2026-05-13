import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ========== OVERVIEW TAB ==========
function OverviewTab({ isOffice }) {
  const stats = isOffice ? [
    { label: 'Total Projects', value: '24', icon: '📁', change: '+3 this week', color: '#3b82f6' },
    { label: 'Team Members', value: '12', icon: '👥', change: '+2 new', color: '#8b5cf6' },
    { label: 'Revenue', value: '৳4.2M', icon: '💰', change: '+18%', color: '#10b981' },
    { label: 'Clients', value: '156', icon: '🏢', change: '+8 this month', color: '#f59e0b' },
  ] : [
    { label: 'My Projects', value: '5', icon: '📁', change: '+1 new', color: '#3b82f6' },
    { label: 'Tasks Done', value: '28', icon: '✅', change: '85% complete', color: '#10b981' },
    { label: 'Messages', value: '12', icon: '💬', change: '3 unread', color: '#8b5cf6' },
    { label: 'Points', value: '1,240', icon: '⭐', change: 'Level 4', color: '#f59e0b' },
  ];

  const chartData = [
    { month: 'Jan', value: 65 }, { month: 'Feb', value: 45 }, { month: 'Mar', value: 78 },
    { month: 'Apr', value: 52 }, { month: 'May', value: 90 }, { month: 'Jun', value: 72 },
    { month: 'Jul', value: 85 },
  ];
  const maxVal = Math.max(...chartData.map(d => d.value));

  const activities = isOffice ? [
    { text: 'New project "Gulshan Heights" created', time: '2 min ago', icon: '📁' },
    { text: 'Team meeting scheduled for tomorrow', time: '1 hour ago', icon: '📅' },
    { text: 'Payment received from Client #45', time: '3 hours ago', icon: '💰' },
    { text: 'Site inspection report uploaded', time: '5 hours ago', icon: '📋' },
  ] : [
    { text: 'Your project proposal was approved', time: '10 min ago', icon: '✅' },
    { text: 'New message from support team', time: '1 hour ago', icon: '💬' },
    { text: 'Task "Design Review" completed', time: '3 hours ago', icon: '📋' },
    { text: 'Account verified successfully', time: 'Yesterday', icon: '🔒' },
  ];

  return (
    <>
      <div className="stats-row">
        {stats.map((s, i) => (
          <div key={i} className="dash-stat-card" style={{ '--stat-color': s.color }}>
            <div className="dash-stat-icon">{s.icon}</div>
            <div className="dash-stat-info">
              <span className="dash-stat-value">{s.value}</span>
              <span className="dash-stat-label">{s.label}</span>
              <span className="dash-stat-change">{s.change}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <div className="dash-card chart-card">
          <div className="dash-card-header">
            <h3>{isOffice ? 'Revenue Overview' : 'Activity Overview'}</h3>
            <span className="chart-period">Last 7 months</span>
          </div>
          <div className="bar-chart">
            {chartData.map((d, i) => (
              <div key={i} className="bar-col">
                <div className="bar-wrapper">
                  <div className="bar-fill" style={{ height: `${(d.value / maxVal) * 100}%`, animationDelay: `${i * 0.1}s` }}>
                    <span className="bar-tooltip">{d.value}%</span>
                  </div>
                </div>
                <span className="bar-label">{d.month}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="dash-card donut-card">
          <div className="dash-card-header"><h3>{isOffice ? 'Project Status' : 'Task Status'}</h3></div>
          <div className="donut-container">
            <svg viewBox="0 0 120 120" className="donut-svg">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray="157 314" strokeDashoffset="0" strokeLinecap="round" className="donut-segment" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="94 314" strokeDashoffset="-157" strokeLinecap="round" className="donut-segment" style={{ animationDelay: '.2s' }} />
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray="63 314" strokeDashoffset="-251" strokeLinecap="round" className="donut-segment" style={{ animationDelay: '.4s' }} />
              <text x="60" y="56" textAnchor="middle" fill="white" fontSize="18" fontWeight="700">78%</text>
              <text x="60" y="72" textAnchor="middle" fill="#8896b8" fontSize="8">Complete</text>
            </svg>
            <div className="donut-legend">
              <div className="legend-item"><span className="legend-dot" style={{ background: '#3b82f6' }}></span>Completed (50%)</div>
              <div className="legend-item"><span className="legend-dot" style={{ background: '#10b981' }}></span>In Progress (30%)</div>
              <div className="legend-item"><span className="legend-dot" style={{ background: '#f59e0b' }}></span>Pending (20%)</div>
            </div>
          </div>
        </div>
      </div>
      <div className="dash-card activity-card">
        <div className="dash-card-header"><h3>Recent Activity</h3><button className="view-all-btn">View All →</button></div>
        <div className="activity-list">
          {activities.map((a, i) => (
            <div key={i} className="activity-item" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="activity-icon">{a.icon}</div>
              <div className="activity-info"><p className="activity-text">{a.text}</p><span className="activity-time">{a.time}</span></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ========== PROJECTS TAB ==========
function ProjectsTab({ isOffice }) {
  const defaultOfficeProjects = [
    { name: 'Gulshan Heights', status: 'In Progress', progress: 72, budget: '৳85M', client: 'Ahmed Group', deadline: 'Dec 2026', color: '#3b82f6' },
    { name: 'Banani Tower', status: 'Planning', progress: 25, budget: '৳120M', client: 'Rahman Corp', deadline: 'Mar 2027', color: '#f59e0b' },
    { name: 'Dhanmondi Residencia', status: 'Completed', progress: 100, budget: '৳65M', client: 'Karim Ltd', deadline: 'Sep 2026', color: '#10b981' },
    { name: 'Uttara Commercial', status: 'In Progress', progress: 58, budget: '৳200M', client: 'BD Holdings', deadline: 'Jun 2027', color: '#3b82f6' },
    { name: 'Mirpur Plaza', status: 'On Hold', progress: 15, budget: '৳45M', client: 'Star Enterprise', deadline: 'TBD', color: '#ef4444' },
  ];

  const defaultUserProjects = [
    { name: 'Portfolio Website', status: 'In Progress', progress: 80, budget: '—', client: 'Personal', deadline: 'May 2026', color: '#3b82f6' },
    { name: 'E-Commerce App', status: 'Planning', progress: 10, budget: '—', client: 'Freelance', deadline: 'Jul 2026', color: '#f59e0b' },
    { name: 'Blog Platform', status: 'Completed', progress: 100, budget: '—', client: 'Client A', deadline: 'Apr 2026', color: '#10b981' },
  ];

  const [projects, setProjects] = useState(isOffice ? defaultOfficeProjects : defaultUserProjects);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '', status: 'Planning', progress: 0, deadline: '', budget: '', client: ''
  });

  const handleAddProject = (e) => {
    e.preventDefault();
    let color = '#f59e0b'; // Planning
    if (newProject.status === 'In Progress') color = '#3b82f6';
    if (newProject.status === 'Completed') color = '#10b981';
    if (newProject.status === 'On Hold') color = '#ef4444';

    const projectToAdd = { ...newProject, color, progress: Number(newProject.progress) };
    if (!isOffice) {
      projectToAdd.budget = '—';
      projectToAdd.client = 'Personal';
    }

    setProjects([projectToAdd, ...projects]);
    setShowForm(false);
    setNewProject({ name: '', status: 'Planning', progress: 0, deadline: '', budget: '', client: '' });
  };

  return (
    <>
      <div className="dash-page-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          {isOffice ? 'All Projects' : 'My Projects'}
        </h2>
        <button className="dash-btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {showForm && (
        <div className="dash-card" style={{ marginBottom: '1.5rem', border: '1px solid var(--accent)' }}>
          <div className="dash-card-header"><h3>Add New Project</h3></div>
          <form onSubmit={handleAddProject} className="auth-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Project Name</label>
              <div className="input-wrapper"><input type="text" required value={newProject.name} onChange={e => setNewProject({ ...newProject, name: e.target.value })} /></div>
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <div className="input-wrapper"><input type="date" required value={newProject.deadline} onChange={e => setNewProject({ ...newProject, deadline: e.target.value })} style={{ colorScheme: 'dark', width: '100%', background: 'transparent', border: 'none', color: '#fff', outline: 'none' }} /></div>
            </div>
            <div className="form-group">
              <label>Status</label>
              <div className="input-wrapper" style={{ padding: '0 1rem' }}>
                <select value={newProject.status} onChange={e => setNewProject({ ...newProject, status: e.target.value })} style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', outline: 'none' }}>
                  <option value="Planning" style={{ background: '#0f1424', color: '#fff', padding: '10px' }}>Planning</option>
                  <option value="In Progress" style={{ background: '#0f1424', color: '#fff', padding: '10px' }}>In Progress</option>
                  <option value="Completed" style={{ background: '#0f1424', color: '#fff', padding: '10px' }}>Completed</option>
                  <option value="On Hold" style={{ background: '#0f1424', color: '#fff', padding: '10px' }}>On Hold</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Progress (%)</label>
              <div className="input-wrapper"><input type="number" min="0" max="100" required value={newProject.progress} onChange={e => setNewProject({ ...newProject, progress: e.target.value })} /></div>
            </div>
            {isOffice && (
              <>
                <div className="form-group">
                  <label>Budget</label>
                  <div className="input-wrapper"><input type="text" placeholder="e.g. ৳50M" required value={newProject.budget} onChange={e => setNewProject({ ...newProject, budget: e.target.value })} /></div>
                </div>
                <div className="form-group">
                  <label>Client</label>
                  <div className="input-wrapper"><input type="text" required value={newProject.client} onChange={e => setNewProject({ ...newProject, client: e.target.value })} /></div>
                </div>
              </>
            )}
            <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
              <button type="submit" className="dash-btn-primary" style={{ width: '100%' }}>Save Project</button>
            </div>
          </form>
        </div>
      )}

      <div className="projects-table dash-card">
        <table className="dash-table">
          <thead>
            <tr><th>Project</th><th>Status</th><th>Progress</th>{isOffice && <><th>Budget</th><th>Client</th></>}<th>Deadline</th></tr>
          </thead>
          <tbody>
            {projects.map((p, i) => (
              <tr key={i}>
                <td className="td-bold">{p.name}</td>
                <td><span className="status-pill" style={{ background: `${p.color}22`, color: p.color, borderColor: `${p.color}44` }}>{p.status}</span></td>
                <td>
                  <div className="progress-cell">
                    <div className="mini-progress"><div className="mini-progress-fill" style={{ width: `${p.progress}%`, background: p.color }}></div></div>
                    <span>{p.progress}%</span>
                  </div>
                </td>
                {isOffice && <><td>{p.budget}</td><td>{p.client}</td></>}
                <td>{p.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ========== MESSAGES TAB ==========
function MessagesTab() {
  const messages = [
    { from: 'Ahmed Khan', avatar: 'A', msg: 'Please review the project proposal I sent...', time: '2 min ago', unread: true },
    { from: 'Sarah Rahman', avatar: 'S', msg: 'The meeting has been rescheduled to Friday...', time: '1 hour ago', unread: true },
    { from: 'Support Team', avatar: '🛡️', msg: 'Your ticket #1234 has been resolved.', time: '3 hours ago', unread: false },
    { from: 'Rahim Uddin', avatar: 'R', msg: 'Can you share the updated floor plans?', time: 'Yesterday', unread: false },
    { from: 'System', avatar: '⚙️', msg: 'Monthly report is ready for download.', time: '2 days ago', unread: false },
  ];

  return (
    <>
      <div className="dash-page-header"><h2>💬 Messages</h2><button className="dash-btn-primary">+ New Message</button></div>
      <div className="dash-card messages-list">
        {messages.map((m, i) => (
          <div key={i} className={`message-item ${m.unread ? 'message-unread' : ''}`}>
            <div className="message-avatar">{m.avatar}</div>
            <div className="message-body">
              <div className="message-top">
                <span className="message-from">{m.from}</span>
                <span className="message-time">{m.time}</span>
              </div>
              <p className="message-text">{m.msg}</p>
            </div>
            {m.unread && <span className="unread-dot"></span>}
          </div>
        ))}
      </div>
    </>
  );
}

// ========== TEAM TAB ==========
function TeamTab() {
  const members = [
    { name: 'Shishir Arafat', role: 'Admin', email: 'arafat@concord.com', status: 'Active', avatar: 'S' },
    { name: 'Barsa Akter', role: 'Office Member', email: 'barsa@concord.com', status: 'Active', avatar: 'B' },
    { name: 'Rahim Khan', role: 'Engineer', email: 'rahim@concord.com', status: 'Active', avatar: 'R' },
    { name: 'Fatima Noor', role: 'Designer', email: 'fatima@concord.com', status: 'Away', avatar: 'F' },
    { name: 'Karim Ahmed', role: 'Manager', email: 'karim@concord.com', status: 'Offline', avatar: 'K' },
  ];

  return (
    <>
      <div className="dash-page-header"><h2>👥 Team Members</h2><button className="dash-btn-primary">+ Add Member</button></div>
      <div className="team-cards-grid">
        {members.map((m, i) => (
          <div key={i} className="dash-card team-member-card">
            <div className="tm-avatar">{m.avatar}</div>
            <h4>{m.name}</h4>
            <p className="tm-role">{m.role}</p>
            <p className="tm-email">{m.email}</p>
            <span className={`tm-status tm-${m.status.toLowerCase()}`}>● {m.status}</span>
          </div>
        ))}
      </div>
    </>
  );
}

// ========== FINANCE TAB ==========
function FinanceTab() {
  const transactions = [
    { desc: 'Payment - Gulshan Heights', amount: '+৳2,500,000', date: 'May 12, 2026', type: 'credit' },
    { desc: 'Material Purchase - Steel', amount: '-৳850,000', date: 'May 10, 2026', type: 'debit' },
    { desc: 'Payment - Banani Tower', amount: '+৳1,800,000', date: 'May 8, 2026', type: 'credit' },
    { desc: 'Contractor Payment', amount: '-৳650,000', date: 'May 5, 2026', type: 'debit' },
    { desc: 'Payment - Uttara Commercial', amount: '+৳3,200,000', date: 'May 3, 2026', type: 'credit' },
  ];

  return (
    <>
      <div className="dash-page-header"><h2>💰 Finance</h2></div>
      <div className="stats-row">
        <div className="dash-stat-card" style={{ '--stat-color': '#10b981' }}>
          <div className="dash-stat-icon">📈</div>
          <div className="dash-stat-info"><span className="dash-stat-value">৳12.5M</span><span className="dash-stat-label">Total Revenue</span><span className="dash-stat-change">+22% vs last month</span></div>
        </div>
        <div className="dash-stat-card" style={{ '--stat-color': '#ef4444' }}>
          <div className="dash-stat-icon">📉</div>
          <div className="dash-stat-info"><span className="dash-stat-value">৳4.8M</span><span className="dash-stat-label">Total Expenses</span><span className="dash-stat-change" style={{ color: '#ef4444' }}>+5% vs last month</span></div>
        </div>
        <div className="dash-stat-card" style={{ '--stat-color': '#3b82f6' }}>
          <div className="dash-stat-icon">💎</div>
          <div className="dash-stat-info"><span className="dash-stat-value">৳7.7M</span><span className="dash-stat-label">Net Profit</span><span className="dash-stat-change">+35% growth</span></div>
        </div>
        <div className="dash-stat-card" style={{ '--stat-color': '#f59e0b' }}>
          <div className="dash-stat-icon">⏳</div>
          <div className="dash-stat-info"><span className="dash-stat-value">৳3.2M</span><span className="dash-stat-label">Pending</span><span className="dash-stat-change">5 invoices</span></div>
        </div>
      </div>
      <div className="dash-card">
        <div className="dash-card-header"><h3>Recent Transactions</h3></div>
        <table className="dash-table">
          <thead><tr><th>Description</th><th>Amount</th><th>Date</th></tr></thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={i}>
                <td>{t.desc}</td>
                <td className={t.type === 'credit' ? 'text-green' : 'text-red'}>{t.amount}</td>
                <td>{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ========== REPORTS TAB ==========
function ReportsTab() {
  const reports = [
    { name: 'Monthly Revenue Report - May 2026', date: 'May 12', size: '2.4 MB', type: '📊' },
    { name: 'Site Inspection - Gulshan Heights', date: 'May 10', size: '5.1 MB', type: '📋' },
    { name: 'Team Performance Q2 2026', date: 'May 8', size: '1.8 MB', type: '📈' },
    { name: 'Material Inventory Report', date: 'May 5', size: '3.2 MB', type: '📦' },
    { name: 'Annual Financial Summary 2025', date: 'Apr 30', size: '8.5 MB', type: '💰' },
  ];

  return (
    <>
      <div className="dash-page-header"><h2>📋 Reports</h2><button className="dash-btn-primary">+ Generate Report</button></div>
      <div className="dash-card">
        <div className="reports-list">
          {reports.map((r, i) => (
            <div key={i} className="report-item">
              <div className="report-icon">{r.type}</div>
              <div className="report-info"><h4>{r.name}</h4><span>{r.date} · {r.size}</span></div>
              <button className="report-download">⬇ Download</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ========== TASKS TAB (User) ==========
function TasksTab() {
  const [tasks, setTasks] = useState([
    { text: 'Complete homepage design', done: true, priority: 'High' },
    { text: 'Fix login page bugs', done: true, priority: 'High' },
    { text: 'Review project proposal', done: false, priority: 'Medium' },
    { text: 'Update documentation', done: false, priority: 'Low' },
    { text: 'Setup CI/CD pipeline', done: false, priority: 'Medium' },
    { text: 'Write unit tests', done: false, priority: 'High' },
  ]);

  const toggle = (idx) => { const t = [...tasks]; t[idx].done = !t[idx].done; setTasks(t); };
  const pColor = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };

  return (
    <>
      <div className="dash-page-header"><h2>✅ My Tasks</h2><span className="task-count">{tasks.filter(t => t.done).length}/{tasks.length} done</span></div>
      <div className="dash-card">
        <div className="tasks-list">
          {tasks.map((t, i) => (
            <div key={i} className={`task-item ${t.done ? 'task-done' : ''}`} onClick={() => toggle(i)}>
              <div className={`task-check ${t.done ? 'checked' : ''}`}>{t.done ? '✓' : ''}</div>
              <span className="task-text">{t.text}</span>
              <span className="priority-pill" style={{ background: `${pColor[t.priority]}22`, color: pColor[t.priority] }}>{t.priority}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ========== PROFILE TAB (User) ==========
function ProfileTab({ user }) {
  return (
    <>
      <div className="dash-page-header"><h2>👤 Profile</h2></div>
      <div className="profile-layout">
        <div className="dash-card profile-card">
          <div className="profile-avatar-big">{user.fullName?.charAt(0)?.toUpperCase()}</div>
          <h3>{user.fullName}</h3>
          <p className="profile-email">{user.email}</p>
          <span className={`role-badge ${user.role === 'office_member' ? 'role-office' : 'role-user'}`}>
            {user.role === 'office_member' ? '🏢 Office Member' : '👤 User'}
          </span>
        </div>
        <div className="dash-card profile-details">
          <h3>Account Details</h3>
          <div className="profile-field"><label>Full Name</label><span>{user.fullName}</span></div>
          <div className="profile-field"><label>Email</label><span>{user.email}</span></div>
          <div className="profile-field"><label>Role</label><span>{user.role}</span></div>
          <div className="profile-field"><label>Member Since</label><span>May 2026</span></div>
        </div>
      </div>
    </>
  );
}

// ========== SETTINGS TAB ==========
function SettingsTab() {
  return (
    <>
      <div className="dash-page-header"><h2>⚙️ Settings</h2></div>
      <div className="settings-grid">
        <div className="dash-card settings-card">
          <h3>🔔 Notifications</h3>
          <div className="setting-row"><span>Email Notifications</span><label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-slider"></span></label></div>
          <div className="setting-row"><span>Push Notifications</span><label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-slider"></span></label></div>
          <div className="setting-row"><span>SMS Alerts</span><label className="toggle"><input type="checkbox" /><span className="toggle-slider"></span></label></div>
        </div>
        <div className="dash-card settings-card">
          <h3>🔒 Security</h3>
          <div className="setting-row"><span>Two-Factor Auth</span><label className="toggle"><input type="checkbox" /><span className="toggle-slider"></span></label></div>
          <div className="setting-row"><span>Login Alerts</span><label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-slider"></span></label></div>
          <button className="dash-btn-outline">Change Password</button>
        </div>
        <div className="dash-card settings-card">
          <h3>🎨 Appearance</h3>
          <div className="setting-row"><span>Dark Mode</span><label className="toggle"><input type="checkbox" defaultChecked /><span className="toggle-slider"></span></label></div>
          <div className="setting-row"><span>Compact Sidebar</span><label className="toggle"><input type="checkbox" /><span className="toggle-slider"></span></label></div>
        </div>
      </div>
    </>
  );
}

// ========== MAIN DASHBOARD ==========
function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    setUser(JSON.parse(stored));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;
  const isOffice = user.role === 'office_member' || user.role === 'admin';

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'messages', label: 'Messages', icon: '💬' },
    ...(isOffice ? [
      { id: 'team', label: 'Team', icon: '👥' },
      { id: 'finance', label: 'Finance', icon: '💰' },
      { id: 'reports', label: 'Reports', icon: '📋' },
    ] : [
      { id: 'tasks', label: 'My Tasks', icon: '✅' },
      { id: 'profile', label: 'Profile', icon: '👤' },
    ]),
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab isOffice={isOffice} />;
      case 'projects': return <ProjectsTab isOffice={isOffice} />;
      case 'messages': return <MessagesTab />;
      case 'team': return <TeamTab />;
      case 'finance': return <FinanceTab />;
      case 'reports': return <ReportsTab />;
      case 'tasks': return <TasksTab />;
      case 'profile': return <ProfileTab user={user} />;
      case 'settings': return <SettingsTab />;
      default: return <OverviewTab isOffice={isOffice} />;
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className={`dashboard-sidebar ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <div className="sidebar-header">
          <img src="https://concordrealestatebd.com/wp-content/themes/concord/assets/logo/blue_logo.svg" alt="Logo" className="sidebar-logo" />
          {sidebarOpen && <span className="sidebar-brand">CONCORD</span>}
        </div>
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button key={item.id} className={`sidebar-item ${activeTab === item.id ? 'sidebar-active' : ''}`} onClick={() => setActiveTab(item.id)} title={item.label}>
              <span className="sidebar-icon">{item.icon}</span>
              {sidebarOpen && <span className="sidebar-label">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-item sidebar-logout" onClick={handleLogout}>
            <span className="sidebar-icon">🚪</span>
            {sidebarOpen && <span className="sidebar-label">Logout</span>}
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="topbar-left">
            <button className="toggle-sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>{sidebarOpen ? '◀' : '▶'}</button>
            <div>
              <h1 className="topbar-title">{menuItems.find(m => m.id === activeTab)?.label || 'Dashboard'}</h1>
              <p className="topbar-subtitle">Welcome back, {user.fullName}!</p>
            </div>
          </div>
          <div className="topbar-right">
            <span className={`role-badge ${isOffice ? 'role-office' : 'role-user'}`}>{isOffice ? '🏢 Office Member' : '👤 User'}</span>
            <div className="topbar-avatar">{user.fullName?.charAt(0)?.toUpperCase() || 'U'}</div>
          </div>
        </header>
        <div className="dashboard-content">{renderContent()}</div>
      </div>
    </div>
  );
}

export default Dashboard;
