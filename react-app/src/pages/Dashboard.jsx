import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ========== OVERVIEW TAB ==========
function OverviewTab({ isOffice }) {
  const [realProjects, setRealProjects] = useState([]);
  const [realMessages, setRealMessages] = useState([]);

  useEffect(() => {
    const savedProjects = localStorage.getItem('concord_projects');
    if (savedProjects) setRealProjects(JSON.parse(savedProjects));
    
    const savedMessages = localStorage.getItem('concord_messages');
    if (savedMessages) setRealMessages(JSON.parse(savedMessages));
  }, []);

  const totalProjects = realProjects.length;
  const completedProjects = realProjects.filter(p => p.status === 'Completed').length;
  const inProgressProjects = realProjects.filter(p => p.status === 'In Progress').length;
  const pendingProjects = totalProjects - completedProjects - inProgressProjects;
  
  const totalMessages = realMessages.length;
  const unreadMessages = realMessages.filter(m => m.unread).length;

  const completionRate = totalProjects ? Math.round((completedProjects / totalProjects) * 100) : 0;
  const inProgressRate = totalProjects ? Math.round((inProgressProjects / totalProjects) * 100) : 0;
  const pendingRate = totalProjects ? 100 - completionRate - inProgressRate : 0;

  const stats = isOffice ? [
    { label: 'Total Projects', value: totalProjects.toString(), icon: '📁', change: `${inProgressProjects} in progress`, color: '#3b82f6' },
    { label: 'Team Members', value: '12', icon: '👥', change: '+2 new', color: '#8b5cf6' },
    { label: 'Revenue', value: '৳4.2M', icon: '💰', change: '+18%', color: '#10b981' },
    { label: 'Messages', value: totalMessages.toString(), icon: '💬', change: `${unreadMessages} unread`, color: '#f59e0b' },
  ] : [
    { label: 'My Projects', value: totalProjects.toString(), icon: '📁', change: `${completedProjects} completed`, color: '#3b82f6' },
    { label: 'Tasks Done', value: completedProjects.toString(), icon: '✅', change: `${completionRate}% complete`, color: '#10b981' },
    { label: 'Messages', value: totalMessages.toString(), icon: '💬', change: `${unreadMessages} unread`, color: '#8b5cf6' },
    { label: 'Points', value: '1,240', icon: '⭐', change: 'Level 4', color: '#f59e0b' },
  ];

  const chartData = [
    { month: 'Jan', value: 65 }, { month: 'Feb', value: 45 }, { month: 'Mar', value: 78 },
    { month: 'Apr', value: 52 }, { month: 'May', value: 90 }, { month: 'Jun', value: 72 },
    { month: 'Jul', value: completionRate || 85 },
  ];
  const maxVal = Math.max(...chartData.map(d => d.value));

  const activities = [
    ...(realProjects.slice(0, 2).map(p => ({ text: `Project "${p.name}" updated`, time: 'Recently', icon: '📁' }))),
    ...(realMessages.slice(0, 2).map(m => ({ text: `Message from ${m.from}`, time: m.time, icon: '💬' }))),
    { text: 'Account verified successfully', time: 'Yesterday', icon: '🔒' }
  ].slice(0, 4);

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
              <circle cx="60" cy="60" r="50" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray={`${(completionRate / 100) * 314} 314`} strokeDashoffset="0" strokeLinecap="round" className="donut-segment" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray={`${(inProgressRate / 100) * 314} 314`} strokeDashoffset={`-${(completionRate / 100) * 314}`} strokeLinecap="round" className="donut-segment" style={{ animationDelay: '.2s' }} />
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f59e0b" strokeWidth="12" strokeDasharray={`${(pendingRate / 100) * 314} 314`} strokeDashoffset={`-${((completionRate + inProgressRate) / 100) * 314}`} strokeLinecap="round" className="donut-segment" style={{ animationDelay: '.4s' }} />
              <text x="60" y="56" textAnchor="middle" fill="white" fontSize="18" fontWeight="700">{completionRate}%</text>
              <text x="60" y="72" textAnchor="middle" fill="#8896b8" fontSize="8">Complete</text>
            </svg>
            <div className="donut-legend">
              <div className="legend-item"><span className="legend-dot" style={{ background: '#10b981' }}></span>Completed ({completionRate}%)</div>
              <div className="legend-item"><span className="legend-dot" style={{ background: '#3b82f6' }}></span>In Progress ({inProgressRate}%)</div>
              <div className="legend-item"><span className="legend-dot" style={{ background: '#f59e0b' }}></span>Pending ({pendingRate}%)</div>
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

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('concord_projects');
    if (saved) return JSON.parse(saved);
    return isOffice ? defaultOfficeProjects : defaultUserProjects;
  });

  useEffect(() => {
    localStorage.setItem('concord_projects', JSON.stringify(projects));
  }, [projects]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
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

    if (editIndex !== null) {
      const updatedProjects = [...projects];
      updatedProjects[editIndex] = projectToAdd;
      setProjects(updatedProjects);
    } else {
      setProjects([projectToAdd, ...projects]);
    }

    setShowForm(false);
    setEditIndex(null);
    setNewProject({ name: '', status: 'Planning', progress: 0, deadline: '', budget: '', client: '' });
  };

  const handleEdit = (index) => {
    setNewProject(projects[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter((_, i) => i !== index);
      setProjects(updatedProjects);
    }
  };

  const handleDownloadReport = (project) => {
    const reportContent = `CONCORD REAL ESTATE - PROJECT REPORT\n=====================================\n\nProject Name : ${project.name}\nCurrent Status: ${project.status}\nProgress      : ${project.progress}%\nDeadline      : ${project.deadline}\n${project.budget ? `Budget        : ${project.budget}\n` : ''}${project.client ? `Client        : ${project.client}\n` : ''}\nGenerated on  : ${new Date().toLocaleString()}\n`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '_')}_Report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (showToast) showToast(`Report downloaded for ${project.name}`, 'success');
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
        <button className="dash-btn-primary" onClick={() => { setShowForm(!showForm); if (showForm) { setEditIndex(null); setNewProject({ name: '', status: 'Planning', progress: 0, deadline: '', budget: '', client: '' }); } }}>
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {showForm && (
        <div className="dash-card" style={{ marginBottom: '1.5rem', border: '1px solid var(--accent)' }}>
          <div className="dash-card-header"><h3>{editIndex !== null ? 'Update Project' : 'Add New Project'}</h3></div>
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
                <select
                  value={newProject.status}
                  onChange={e => {
                    const stat = e.target.value;
                    let prog = newProject.progress;
                    if (stat === 'Completed') prog = 100;
                    else if (stat === 'Planning') prog = 0;
                    else if ((stat === 'In Progress' || stat === 'On Hold') && (prog === 0 || prog === 100)) prog = 50;
                    setNewProject({ ...newProject, status: stat, progress: prog });
                  }}
                  style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', outline: 'none' }}
                >
                  <option value="Planning" style={{ background: '#0f1424', color: '#fff', padding: '10px' }}>Planning</option>
                  <option value="In Progress" style={{ background: '#0f1424', color: '#fff', padding: '10px' }}>In Progress</option>
                  <option value="Completed" style={{ background: '#0f1424', color: '#fff', padding: '10px' }}>Completed</option>
                  <option value="On Hold" style={{ background: '#0f1424', color: '#fff', padding: '10px' }}>On Hold</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Progress (%)</label>
              <div className="input-wrapper">
                <input
                  type="number" min="0" max="100" required
                  value={newProject.progress}
                  onChange={e => {
                    const prog = Number(e.target.value);
                    let stat = newProject.status;
                    if (prog === 100) stat = 'Completed';
                    else if (prog === 0) stat = 'Planning';
                    else if (prog > 0 && prog < 100 && (stat === 'Completed' || stat === 'Planning')) stat = 'In Progress';
                    setNewProject({ ...newProject, progress: prog, status: stat });
                  }}
                />
              </div>
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
              <button type="submit" className="dash-btn-primary" style={{ width: '100%' }}>{editIndex !== null ? 'Update Project' : 'Save Project'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="projects-table dash-card">
        <table className="dash-table">
          <thead>
            <tr><th>Project</th><th>Status</th><th>Progress</th>{isOffice && <><th>Budget</th><th>Client</th></>}<th>Deadline</th><th>Report</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
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
                <td>
                  <button onClick={() => handleDownloadReport(p)} style={{ background: 'rgba(26,86,219,.1)', color: 'var(--primary-light)', border: '1px solid rgba(26,86,219,.2)', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    Download
                  </button>
                </td>
                <td style={{ textAlign: 'right', gap: '0.8rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <button onClick={() => handleEdit(i)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--primary-light)', padding: '4px' }} title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button onClick={() => handleDelete(i)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }} title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ========== MESSAGES TAB ==========
function MessagesTab({ showToast }) {
  const defaultMessages = [
    { from: 'Ahmed Khan', avatar: 'A', msg: 'Please review the project proposal I sent...', time: '2 min ago', unread: true },
    { from: 'Sarah Rahman', avatar: 'S', msg: 'The meeting has been rescheduled to Friday...', time: '1 hour ago', unread: true },
    { from: 'Support Team', avatar: '🛡️', msg: 'Your ticket #1234 has been resolved.', time: '3 hours ago', unread: false },
    { from: 'Rahim Uddin', avatar: 'R', msg: 'Can you share the updated floor plans?', time: 'Yesterday', unread: false },
    { from: 'System', avatar: '⚙️', msg: 'Monthly report is ready for download.', time: '2 days ago', unread: false },
  ];

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('concord_messages');
    if (saved) return JSON.parse(saved);
    return defaultMessages;
  });

  useEffect(() => {
    localStorage.setItem('concord_messages', JSON.stringify(messages));
  }, [messages]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newMessage, setNewMessage] = useState({
    from: '', msg: '', time: 'Just now', unread: true
  });

  const handleSaveMessage = (e) => {
    e.preventDefault();
    const avatar = newMessage.from ? newMessage.from.charAt(0).toUpperCase() : '👤';
    const currentTime = editIndex !== null ? newMessage.time : 'Just now';
    const messageToSave = { ...newMessage, avatar, time: currentTime };

    if (editIndex !== null) {
      const updatedMessages = [...messages];
      updatedMessages[editIndex] = messageToSave;
      setMessages(updatedMessages);
      showToast("Message updated successfully!");
    } else {
      setMessages([messageToSave, ...messages]);
      showToast("Message created successfully!");
    }

    setShowForm(false);
    setEditIndex(null);
    setNewMessage({ from: '', msg: '', time: 'Just now', unread: true });
  };

  const handleEdit = (index) => {
    setNewMessage(messages[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      const updatedMessages = messages.filter((_, i) => i !== index);
      setMessages(updatedMessages);
      showToast("Message deleted successfully!", 'success');
    }
  };

  return (
    <>
      <div className="dash-page-header">
        <h2>💬 Messages</h2>
        <button className="dash-btn-primary" onClick={() => { setShowForm(!showForm); if (showForm) { setEditIndex(null); setNewMessage({ from: '', msg: '', time: 'Just now', unread: true }); } }}>
          {showForm ? 'Cancel' : '+ New Message'}
        </button>
      </div>

      {showForm && (
        <div className="dash-card" style={{ marginBottom: '1.5rem', border: '1px solid var(--accent)' }}>
          <div className="dash-card-header"><h3>{editIndex !== null ? 'Update Message' : 'New Message'}</h3></div>
          <form onSubmit={handleSaveMessage} className="auth-form" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label>Sender Name</label>
                <div className="input-wrapper"><input type="text" required value={newMessage.from} onChange={e => setNewMessage({ ...newMessage, from: e.target.value })} /></div>
              </div>
              <div>
                <label>Time</label>
                <div className="input-wrapper"><input type="text" disabled value={editIndex !== null ? newMessage.time : 'Auto-generated'} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }} /></div>
              </div>
            </div>
            <div className="form-group">
              <label>Message Content</label>
              <div className="input-wrapper" style={{ height: 'auto' }}>
                <textarea required value={newMessage.msg} onChange={e => setNewMessage({ ...newMessage, msg: e.target.value })} style={{ width: '100%', minHeight: '80px', background: 'transparent', border: 'none', color: '#fff', outline: 'none', padding: '10px', resize: 'vertical' }} />
              </div>
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" id="unread-check" checked={newMessage.unread} onChange={e => setNewMessage({ ...newMessage, unread: e.target.checked })} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
              <label htmlFor="unread-check" style={{ marginBottom: 0, cursor: 'pointer' }}>Mark as Unread</label>
            </div>
            <button type="submit" className="dash-btn-primary">{editIndex !== null ? 'Update Message' : 'Send Message'}</button>
          </form>
        </div>
      )}
      <div className="dash-card messages-list">
        {messages.map((m, i) => (
          <div key={i} className={`message-item ${m.unread ? 'message-unread' : ''}`}>
            <div className="message-avatar">{m.avatar}</div>
            <div className="message-body">
              <div className="message-top" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <span className="message-from">{m.from}</span>
                <span className="message-time">{m.time}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEdit(i)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--primary-light)', padding: '2px' }} title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button onClick={() => handleDelete(i)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px' }} title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
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
function ProfileTab({ user, setUser, showToast }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    ...user,
    firstName: user.firstName || (user.fullName ? user.fullName.split(' ')[0] : ''),
    lastName: user.lastName || (user.fullName ? user.fullName.split(' ').slice(1).join(' ') : ''),
    nid: user.nid || '',
    passport: user.passport || '',
    bloodGroup: user.bloodGroup || ''
  });

  const handleSave = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...formData,
      fullName: `${formData.firstName} ${formData.lastName}`.trim()
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
    showToast("Profile details updated successfully!", 'success');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, avatar: imageUrl });
    }
  };

  return (
    <>
      <div className="dash-page-header">
        <h2>👤 Profile</h2>
        <button className="dash-btn-primary" onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}>
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
      </div>
      <div className="profile-layout">
        <div className="dash-card profile-card">
          <div className="profile-avatar-big" style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {formData.avatar ? <img src={formData.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (formData.firstName?.charAt(0)?.toUpperCase() || formData.fullName?.charAt(0)?.toUpperCase())}
            {isEditing && (
              <label style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '12px', padding: '5px', cursor: 'pointer', margin: 0 }}>
                Upload
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
              </label>
            )}
          </div>
          <h3>{`${formData.firstName || ''} ${formData.lastName || ''}`.trim() || formData.fullName}</h3>
          <p className="profile-email">{formData.email}</p>
          <span className={`role-badge ${formData.role === 'office_member' || formData.role === 'admin' ? 'role-office' : 'role-user'}`}>
            {formData.role === 'office_member' || formData.role === 'admin' ? '🏢 Office Member' : '👤 User'}
          </span>
        </div>
        <div className="dash-card profile-details">
          <h3>Account Details</h3>
          {isEditing ? (
            <form onSubmit={handleSave} style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>1st Name</label>
                  <div className="input-wrapper"><input type="text" required value={formData.firstName || ''} onChange={e => setFormData({ ...formData, firstName: e.target.value })} /></div>
                </div>
                <div className="form-group">
                  <label>2nd Name</label>
                  <div className="input-wrapper"><input type="text" required value={formData.lastName || ''} onChange={e => setFormData({ ...formData, lastName: e.target.value })} /></div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>NID</label>
                  <div className="input-wrapper"><input type="text" placeholder="National ID" value={formData.nid || ''} onChange={e => setFormData({ ...formData, nid: e.target.value })} /></div>
                </div>
                <div className="form-group">
                  <label>Passport</label>
                  <div className="input-wrapper"><input type="text" placeholder="Passport Number" value={formData.passport || ''} onChange={e => setFormData({ ...formData, passport: e.target.value })} /></div>
                </div>
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <div className="input-wrapper" style={{ padding: '0 1rem' }}>
                  <select value={formData.bloodGroup || ''} onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })} style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', outline: 'none' }}>
                    <option value="" style={{ background: '#0f1424' }}>Select Blood Group</option>
                    <option value="A+" style={{ background: '#0f1424' }}>A+</option>
                    <option value="A-" style={{ background: '#0f1424' }}>A-</option>
                    <option value="B+" style={{ background: '#0f1424' }}>B+</option>
                    <option value="B-" style={{ background: '#0f1424' }}>B-</option>
                    <option value="O+" style={{ background: '#0f1424' }}>O+</option>
                    <option value="O-" style={{ background: '#0f1424' }}>O-</option>
                    <option value="AB+" style={{ background: '#0f1424' }}>AB+</option>
                    <option value="AB-" style={{ background: '#0f1424' }}>AB-</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <div className="input-wrapper"><input type="email" required value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
              </div>
              <div className="form-group">
                <label>Role (Read Only)</label>
                <div className="input-wrapper"><input type="text" disabled value={formData.role || ''} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }} /></div>
              </div>
              <button type="submit" className="dash-btn-primary" style={{ marginTop: '1rem' }}>Save Changes</button>
            </form>
          ) : (
            <>
              <div className="profile-field"><label>1st Name</label><span>{user.firstName || (user.fullName ? user.fullName.split(' ')[0] : 'N/A')}</span></div>
              <div className="profile-field"><label>2nd Name</label><span>{user.lastName || (user.fullName ? user.fullName.split(' ').slice(1).join(' ') : 'N/A')}</span></div>
              <div className="profile-field"><label>NID</label><span>{user.nid || 'N/A'}</span></div>
              <div className="profile-field"><label>Passport</label><span>{user.passport || 'N/A'}</span></div>
              <div className="profile-field"><label>Blood Group</label><span>{user.bloodGroup || 'N/A'}</span></div>
              <div className="profile-field"><label>Email</label><span>{user.email}</span></div>
              <div className="profile-field"><label>Role</label><span>{user.role}</span></div>
              <div className="profile-field"><label>Member Since</label><span>May 2026</span></div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ========== SETTINGS TAB ==========
function SettingsTab({ showToast }) {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    const current = e.target[0].value;
    const newPass = e.target[1].value;
    const confirmPass = e.target[2].value;

    if (newPass !== confirmPass) {
      showToast("New passwords do not match!", 'error');
      return;
    }

    showToast("Password successfully changed!", 'success');
    setIsChangingPassword(false);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }
  };

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
          {isChangingPassword ? (
            <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem', background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
              <div className="input-wrapper" style={{ padding: 0 }}><input type="password" placeholder="Current Password" required style={{ width: '100%', padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-main)', outline: 'none' }} /></div>
              <div className="input-wrapper" style={{ padding: 0 }}><input type="password" placeholder="New Password" required style={{ width: '100%', padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-main)', outline: 'none' }} /></div>
              <div className="input-wrapper" style={{ padding: 0 }}><input type="password" placeholder="Confirm New Password" required style={{ width: '100%', padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-main)', outline: 'none' }} /></div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="submit" className="dash-btn-primary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem' }}>Save</button>
                <button type="button" className="dash-btn-outline" style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem' }} onClick={() => setIsChangingPassword(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <button className="dash-btn-outline" style={{ marginTop: '0.5rem' }} onClick={() => setIsChangingPassword(true)}>Change Password</button>
          )}
        </div>
        <div className="dash-card settings-card">
          <h3>🎨 Appearance</h3>
          <div className="setting-row"><span>Dark Mode</span><label className="toggle"><input type="checkbox" checked={darkMode} onChange={toggleDarkMode} /><span className="toggle-slider"></span></label></div>
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
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    setUser(JSON.parse(stored));

    // Apply theme on load
    if (localStorage.getItem('theme') === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
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
      case 'projects': return <ProjectsTab isOffice={isOffice} showToast={showToast} />;
      case 'messages': return <MessagesTab showToast={showToast} />;
      case 'team': return <TeamTab />;
      case 'finance': return <FinanceTab />;
      case 'reports': return <ReportsTab />;
      case 'tasks': return <TasksTab />;
      case 'profile': return <ProfileTab user={user} setUser={setUser} showToast={showToast} />;
      case 'settings': return <SettingsTab showToast={showToast} />;
      default: return <OverviewTab isOffice={isOffice} />;
    }
  };

  return (
    <div className="dashboard-layout">
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, padding: '1rem 1.5rem', background: toast.type === 'success' ? '#10b981' : '#ef4444', color: '#fff', borderRadius: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', animation: 'fadeUp 0.3s ease-out', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{toast.type === 'success' ? '✅' : '⚠️'}</span>
          {toast.message}
        </div>
      )}
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
            <div className="topbar-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user.avatar ? <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (user.fullName?.charAt(0)?.toUpperCase() || 'U')}
            </div>
          </div>
        </header>
        <div className="dashboard-content">{renderContent()}</div>
      </div>
    </div>
  );
}

export default Dashboard;
