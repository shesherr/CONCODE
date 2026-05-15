import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { triggerPropertiesUpdate } from './Properties';

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
function ProjectsTab({ isOffice, showToast, onProjectUpdate }) {
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [newProject, setNewProject] = useState({
    name: '', status: 'Planning', progress: 0, deadline: '', budget: '', client: ''
  });

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleExportCSV = () => {
    const headers = isOffice
      ? ['Project Name', 'Status', 'Progress', 'Budget', 'Client', 'Deadline']
      : ['Project Name', 'Status', 'Progress', 'Deadline'];
    const rows = filteredProjects.map(p =>
      isOffice
        ? [p.name, p.status, p.progress, p.budget, p.client, p.deadline]
        : [p.name, p.status, p.progress, p.deadline]
    );

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projects_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Projects exported successfully!', 'success');
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(filteredProjects, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projects_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Projects exported successfully!', 'success');
  };

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

    // Trigger real-time properties update
    triggerPropertiesUpdate();
  };

  const handleEdit = (originalIndex) => {
    setNewProject(projects[originalIndex]);
    setEditIndex(originalIndex);
    setShowForm(true);
  };

  const handleDelete = (originalIndex) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter((_, i) => i !== originalIndex);
      setProjects(updatedProjects);
      // Trigger real-time properties update
      triggerPropertiesUpdate();
    }
  };

  const handleDownloadReport = (project) => {
    // Real Concord Logo Base64 SVG
    const logoSvgBase64 = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAxOTcuMyA4My4zIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxOTcuMyA4My4zOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDp1cmwoI1NWR0lEXzFfKTt9DQoJLnN0MXtmaWxsOnVybCgjU1ZHSURfMl8pO30NCgkuc3Qye2ZpbGw6dXJsKCNTVkdJRF8zXyk7fQ0KPC9zdHlsZT4NCjxnPg0KCTxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfMV8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iOTguNjQ4OSIgeTE9IjUuODUyNSIgeDI9Ijk4LjY0ODkiIHkyPSI4MS4zMzE2Ij4NCgkJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzAwNkVCOSIvPg0KCQk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojMkUzMTkyIi8+DQoJPC9saW5lYXJHcmFkaWVudD4NCgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTYuMyw1N2MxLjMsMCwyLjUsMC4xLDMuNiwwLjVjMS4xLDAuMywyLDAuNywyLjYsMS4yYzAuNywwLjUsMSwwLjgsMS4xLDFjMC4xLDAuMiwwLjIsMS4zLDAuMiwzLjRoMS43DQoJCWMwLjEtMS43LDAuMi0zLjEsMC40LTQuMmMwLjEtMC43LDAuMy0xLjQsMC41LTIuMWwtMC4xLTAuM2MtMS42LTAuNi0zLjMtMS01LTEuM2MtMS43LTAuMy0zLjMtMC41LTUtMC41Yy01LjEsMC05LjEsMS4zLTEyLDMuOQ0KCQlDMS40LDYxLjMsMCw2NC42LDAsNjguN2MwLDIuOCwwLjYsNS40LDEuOSw3LjZjMS4zLDIuMiwzLjEsMy45LDUuNSw1LjFjMi40LDEuMiw1LjMsMS44LDguNywxLjhjMS44LDAsMy41LTAuMSw0LjktMC41DQoJCWMxLjQtMC4zLDIuOS0wLjksNC40LTEuN2MwLjMtMC42LDAuNi0xLjMsMC45LTJsLTAuNS0wLjVjLTEuNSwwLjgtMi44LDEuMi00LDEuNWMtMS4yLDAuMy0yLjUsMC40LTMuOSwwLjRjLTMuNiwwLTYuNC0xLjEtOC41LTMuMg0KCQljLTIuMy0yLjQtMy40LTUuNC0zLjQtOS4yYzAtMy41LDAuOS02LjIsMi44LTguMUMxMC43LDU4LDEzLjIsNTcsMTYuMyw1N3ogTTUwLDU5Yy0xLjktMS00LjQtMS41LTcuNC0xLjVjLTMuMSwwLTUuNywwLjUtNy43LDEuNg0KCQljLTIsMS0zLjUsMi41LTQuNyw0LjRjLTEuMSwxLjktMS43LDQuMy0xLjcsN2MwLDMuOSwxLjIsNywzLjUsOS4zYzIuMywyLjMsNS43LDMuNCwxMCwzLjRjMi45LDAsNS40LTAuNiw3LjQtMS43DQoJCWMyLTEuMSwzLjYtMi43LDQuOC00LjdjMS4xLTIsMS43LTQuNCwxLjctNy4yYzAtMi41LTAuNS00LjctMS42LTYuNUM1My4zLDYxLjQsNTEuOCw2MCw1MCw1OXogTTQ4LjMsNzguNg0KCQljLTEuNCwxLjgtMy4zLDIuNy01LjcsMi43Yy0xLjksMC0zLjQtMC40LTQuNy0xLjJjLTEuMi0wLjgtMi4xLTItMi45LTMuOGMtMC44LTEuOC0xLjItMy45LTEuMi02LjVjMC0zLjUsMC43LTYuMSwyLjEtNy45DQoJCWMxLjQtMS43LDMuNC0yLjUsNS45LTIuNWMyLjcsMCw0LjcsMC44LDYuMSwyLjVjMS42LDIsMi40LDQuOSwyLjQsOC43QzUwLjUsNzQuMiw0OS44LDc2LjksNDguMyw3OC42eiBNNzcuNSw1Ny45djEuNQ0KCQljMS40LDAuMSwyLjMsMC4yLDIuNSwwLjJjMC4yLDAsMC4zLDAuMiwwLjQsMC4zYzAuMSwwLjIsMC4yLDEsMC4zLDIuMWMwLDIsMCw0LjMsMCw3djdjLTEuNy0xLjgtMy43LTQtNi02LjgNCgkJYy0zLjUtNC4xLTYuNi03LjktOS4zLTExLjRjLTEuMywwLjEtMi40LDAuMS0zLjQsMC4xYy0wLjksMC0yLjMsMC00LjEtMC4xdjEuNWMxLjUsMC4xLDIuNCwwLjMsMi42LDAuNGMwLjIsMC4xLDAuMywwLjIsMC40LDAuNA0KCQljMC4xLDAuMywwLjIsMS41LDAuMiwzLjVsMCw3LjZjMCwxLjQsMCwzLjYtMC4xLDYuNWMwLDEuNy0wLjEsMi43LTAuMiwzYy0wLjEsMC4yLTAuMiwwLjMtMC40LDAuNGMtMC4yLDAuMi0xLjEsMC4zLTIuNSwwLjN2MS41DQoJCWMyLjItMC4xLDMuNy0wLjEsNC40LTAuMWMwLjgsMCwyLjIsMC4xLDQuMSwwLjF2LTEuNWMtMS41LTAuMS0yLjQtMC4yLTIuNi0wLjRjLTAuMi0wLjEtMC4yLTAuMS0wLjMtMC4zYy0wLjEtMC4zLTAuMi0xLjQtMC4zLTMuNA0KCQljMC0yLjctMC4xLTUtMC4xLTYuOXYtNi45YzEuMywxLjgsMy4xLDMuOSw1LjMsNi42YzQuMyw1LjEsOCw5LjMsMTEuMSwxMi43YzAuNiwwLjEsMS41LDAuMywyLjksMC41bDAuMi0wLjINCgkJYy0wLjEtMS45LTAuMS0zLjktMC4xLTUuOGwwLTcuMmwwLTcuMWMwLTEuNSwwLjEtMi41LDAuMi0yLjdjMC0wLjIsMC4xLTAuMywwLjItMC40YzAuMS0wLjEsMC4yLTAuMiwwLjQtMC4yDQoJCWMwLjMtMC4xLDEuMS0wLjIsMi40LTAuM3YtMS41Qzg0LjUsNTcuOSw4Myw1OCw4MS4zLDU4QzgwLDU4LDc4LjgsNTcuOSw3Ny41LDU3Ljl6IE0xMDIuNyw1OS42YzEuMiwwLDIuMywwLjIsMy4zLDAuNA0KCQljMSwwLjMsMS43LDAuNywyLjMsMS4xYzAuNiwwLjQsMC45LDAuNywxLDAuOWMwLjEsMC4yLDAuMSwxLjIsMC4yLDMuMWgxLjVjMC4xLTEuNSwwLjItMi43LDAuNC0zLjhjMC4xLTAuNiwwLjItMS4yLDAuNC0xLjgNCgkJbC0wLjEtMC4zYy0xLjUtMC42LTIuOS0xLTQuNS0xLjJjLTEuNS0wLjMtMy0wLjQtNC41LTAuNGMtNC42LDAtOC4yLDEuMi0xMC44LDMuNWMtMi42LDIuNC0zLjksNS40LTMuOSw5LjFjMCwyLjUsMC42LDQuOCwxLjcsNi44DQoJCWMxLjEsMS45LDIuOCwzLjUsNC45LDQuNmMyLjIsMS4xLDQuOCwxLjYsNy45LDEuNmMxLjYsMCwzLjEtMC4xLDQuNC0wLjVjMS4zLTAuMywyLjYtMC44LDQtMS42YzAuMi0wLjYsMC41LTEuMiwwLjgtMS44bC0wLjQtMC40DQoJCWMtMS4zLDAuNy0yLjUsMS4xLTMuNiwxLjRjLTEuMSwwLjMtMi4zLDAuNC0zLjUsMC40Yy0zLjMsMC01LjgtMS03LjYtMi45Yy0yLTIuMS0zLTQuOS0zLTguMmMwLTMuMSwwLjktNS42LDIuNS03LjMNCgkJQzk3LjYsNjAuNSw5OS45LDU5LjYsMTAyLjcsNTkuNnogTTEzNS4zLDU5Yy0xLjktMS00LjQtMS41LTcuNC0xLjVjLTMuMSwwLTUuNywwLjUtNy43LDEuNmMtMiwxLTMuNSwyLjUtNC43LDQuNA0KCQljLTEuMSwxLjktMS43LDQuMy0xLjcsN2MwLDMuOSwxLjIsNywzLjUsOS4zYzIuMywyLjMsNS42LDMuNCwxMCwzLjRjMi45LDAsNS4zLTAuNiw3LjQtMS43YzIuMS0xLjEsMy43LTIuNyw0LjgtNC43DQoJCWMxLjEtMiwxLjctNC40LDEuNy03LjJjMC0yLjUtMC41LTQuNy0xLjYtNi41QzEzOC43LDYxLjQsMTM3LjIsNjAsMTM1LjMsNTl6IE0xMzMuNyw3OC42Yy0xLjQsMS44LTMuMywyLjctNS43LDIuNw0KCQljLTEuOSwwLTMuNS0wLjQtNC43LTEuMmMtMS4yLTAuOC0yLjItMi0yLjktMy44Yy0wLjgtMS44LTEuMi0zLjktMS4yLTYuNWMwLTMuNSwwLjctNi4xLDIuMS03LjljMS40LTEuNywzLjQtMi41LDUuOS0yLjUNCgkJYzIuNywwLDQuOCwwLjgsNi4xLDIuNWMxLjYsMiwyLjQsNC45LDIuNCw4LjdDMTM1LjgsNzQuMiwxMzUuMSw3Ni45LDEzMy43LDc4LjZ6IE0xNjUuMSw3OS44bC0yLjktNC40bC0zLjctNS43DQoJCWMyLTAuOCwzLjQtMS44LDQuMi0yLjljMC44LTEuMSwxLjItMi4zLDEuMi0zLjdjMC0xLjEtMC4yLTIuMS0wLjgtMi45Yy0wLjUtMC44LTEuMi0xLjQtMi4xLTEuOGMtMC45LTAuNC0yLjMtMC42LTQuMi0wLjZMMTQ4LDU4DQoJCWMtMC43LDAtMi4zLDAtNC43LTAuMXYxLjVjMS4zLDAuMSwyLDAuMywyLjIsMC40YzAuMiwwLjEsMC4zLDAuMiwwLjMsMC40YzAuMiwwLjUsMC4zLDEuOSwwLjMsNC4yYzAsMywwLjEsNS42LDAuMSw3LjUNCgkJYzAsMS40LDAsMy41LTAuMSw2YzAsMS42LTAuMSwyLjYtMC4yLDIuOWMtMC4xLDAuMi0wLjIsMC4zLTAuMywwLjNjLTAuMiwwLjEtMSwwLjItMi4zLDAuM3YxLjVjMi0wLjEsMy44LTAuMSw1LjYtMC4xDQoJCWMxLjYsMCwzLjUsMC4xLDUuNiwwLjF2LTEuNWMtMS4zLTAuMS0yLjEtMC4yLTIuNC0wLjNjLTAuMi0wLjEtMC4zLTAuMi0wLjQtMC40Yy0wLjEtMC4yLTAuMi0xLjItMC4zLTNjLTAuMS0yLjMtMC4yLTQuMy0wLjItNS44DQoJCWwwLjEtNi42bDAuMS01LjNjMC45LTAuMSwxLjctMC4xLDIuMi0wLjFjMS43LDAsMi45LDAuNCwzLjgsMS4yYzAuOCwwLjgsMS4zLDEuOSwxLjMsMy40YzAsMS42LTAuNSwyLjktMS42LDMuOA0KCQljLTEuMSwwLjktMi4xLDEuNC0zLjIsMS40Yy0wLjIsMC0wLjYsMC0xLTAuMWMtMC4xLDAuMi0wLjEtMC40LTAuMiwwLjZsMy42LDUuNWMyLjEsMy4xLDMuNiw1LjUsNC42LDcuMmMwLjksMCwyLjgtMC4xLDUuOC0wLjENCgkJbDEsMHYtMS4zYy0wLjYsMC0xLjEtMC4xLTEuNC0wLjJDMTY2LDgwLjksMTY1LjYsODAuNSwxNjUuMSw3OS44eiBNMTk1LjgsNjIuOGMtMS0xLjctMi4zLTIuOS0zLjktMy43Yy0xLjYtMC44LTQuMS0xLjItNy4zLTEuMg0KCQlsLTguOCwwLjFjLTIuMywwLTQuNCwwLTYuMS0wLjF2MS41YzEuNSwwLjIsMi40LDAuMywyLjYsMC40YzAuMSwwLjEsMC4yLDAuMSwwLjIsMC4zYzAuMSwwLjIsMC4yLDEuMiwwLjIsMi45DQoJCWMwLjEsMS42LDAuMSwzLjcsMC4xLDYuMmMwLDUuNy0wLjEsOS42LTAuMywxMS43Yy0wLjMsMC4yLTAuOSwwLjYtMS44LDEuMXYwLjljMi4yLTAuMSwzLjgtMC4xLDQuOC0wLjFsNi44LDAuMQ0KCQljMi41LDAsNC44LTAuNCw3LTEuNGMyLjItMC45LDQuMS0yLjUsNS42LTQuN2MxLjUtMi4yLDIuMy00LjgsMi4zLTcuOUMxOTcuMyw2Ni40LDE5Ni44LDY0LjQsMTk1LjgsNjIuOHogTTE5MC42LDc2DQoJCWMtMC45LDEuNy0yLDIuOS0zLjQsMy43Yy0xLjQsMC43LTMuNCwxLjEtNi4xLDEuMWMtMSwwLTItMC4xLTMuMS0wLjJjLTAuMS0xLjctMC4xLTQuOS0wLjEtOS41bDAuMS0xMWMxLjgtMC4xLDMuMS0wLjIsMy44LTAuMg0KCQljMy40LDAsNS45LDAuOCw3LjQsMi4zYzEuNywxLjcsMi42LDQuMiwyLjYsNy41QzE5MS45LDcyLjIsMTkxLjQsNzQuMywxOTAuNiw3NnoiLz4NCgk8Zz4NCgkJPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF8yXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSI3Ny42MDE2IiB5MT0iMC4zNjY4IiB4Mj0iNzcuNjAxNiIgeTI9Ijg0Ljc2NyI+DQoJCQk8c3RvcCAgb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojMDA2RUI5Ii8+DQoJCQk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojMkUzMTkyIi8+DQoJCTwvbGluZWFyR3JhZGllbnQ+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik04MC4yLDI2LjFjMC02LjYsNS40LTEyLDEyLTEyYzIuNCwwLDQuNiwwLjcsNi40LDEuOWwtMTYtMTZMNTYuNiwyNi4xbDI2LjEsMjYuMWwxNi0xNg0KCQkJYy0xLjksMS4yLTQuMSwxLjktNi40LDEuOUM4NS42LDM4LjIsODAuMiwzMi44LDgwLjIsMjYuMXoiLz4NCgkJPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF8zXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIxMTkuNjk1OCIgeTE9IjAuMzY2OCIgeDI9IjExOS42OTU4IiB5Mj0iODQuNzY3Ij4NCgkJCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMDZFQjkiLz4NCgkJCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiMyRTMxOTIiLz4NCgkJPC9saW5lYXJHcmFkaWVudD4NCgkJPHBhdGggY2xhc3M9InN0MiIgZD0iTTEyMi4zLDI2LjFjMC02LjYsNS40LTEyLDEyLTEyYzIuNCwwLDQuNiwwLjcsNi40LDEuOWwtMTYtMTZMOTguNiwyNi4xbDI2LjEsMjYuMWwxNi0xNg0KCQkJYy0xLjksMS4yLTQuMSwxLjktNi40LDEuOUMxMjcuNywzOC4yLDEyMi4zLDMyLjgsMTIyLjMsMjYuMXoiLz4NCgk8L2c+DQo8L2c+DQo8L3N2Zz4NCg==";

    const img = new Image();
    img.src = `data:image/svg+xml;base64,${logoSvgBase64}`;

    img.onload = () => {
      const doc = new jsPDF();

      // Draw SVG to canvas to get PNG for jsPDF
      const canvas = document.createElement('canvas');
      canvas.width = 800; // Render at high res
      canvas.height = (img.height / img.width) * 800;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngDataUrl = canvas.toDataURL('image/png');

      // Header Background
      doc.setFillColor(15, 23, 42); // Very dark blue/slate
      doc.rect(0, 0, 210, 35, 'F');

      // Top Left: Actual Concord Logo
      doc.addImage(pngDataUrl, 'PNG', 15, 8, 45, (canvas.height / canvas.width) * 45);

      // Top Right: INVOICE Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE", 195, 22, null, null, "right");

      // Invoice Metadata
      const invoiceId = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
      const today = new Date().toLocaleDateString();

      doc.setTextColor(100, 116, 139);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Invoice Number:", 140, 50);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      doc.text(invoiceId, 195, 50, null, null, "right");

      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "bold");
      doc.text("Date of Issue:", 140, 58);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      doc.text(today, 195, 58, null, null, "right");

      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "bold");
      doc.text("Due Date:", 140, 66);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      doc.text(project.deadline || 'Upon Receipt', 195, 66, null, null, "right");

      // Billed To Section
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("BILLED TO:", 15, 50);

      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const nameFromProfile = savedUser.fullName || [savedUser.firstName, savedUser.lastName].filter(Boolean).join(' ');
      const billName = nameFromProfile || project.client || "Client Not Specified";
      const billNID = savedUser.nid || "N/A";
      const billBlood = savedUser.bloodGroup || "N/A";

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.text(billName, 15, 58);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text(`NID: ${billNID}`, 15, 64);
      doc.text(`Blood Group: ${billBlood}`, 15, 70);

      // Divider Line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(15, 80, 195, 80);

      // Project Details Section
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Project Description", 15, 95);

      // Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(15, 105, 180, 10, 'F');
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("DESCRIPTION", 20, 112);
      doc.text("STATUS", 110, 112);
      doc.text("PROGRESS", 150, 112);
      doc.text("AMOUNT", 190, 112, null, null, "right");

      // Table Row
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "normal");
      doc.text(project.name, 20, 125);

      // Status Color
      let rgb = [31, 41, 55];
      if (project.color === '#10b981') rgb = [16, 185, 129];
      if (project.color === '#3b82f6') rgb = [59, 130, 246];
      if (project.color === '#ef4444') rgb = [239, 68, 68];
      if (project.color === '#f59e0b') rgb = [245, 158, 11];
      doc.setTextColor(rgb[0], rgb[1], rgb[2]);
      doc.setFont("helvetica", "bold");
      doc.text(project.status, 110, 125);

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "normal");
      doc.text(`${project.progress}%`, 150, 125);

      const displayBudget = project.budget && project.budget !== '—' ? project.budget : "TBD";
      doc.text(displayBudget, 190, 125, null, null, "right");

      // Table Bottom Line
      doc.setDrawColor(226, 232, 240);
      doc.line(15, 135, 195, 135);

      // Totals Section
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("Subtotal:", 150, 145);
      doc.setTextColor(15, 23, 42);
      doc.text(displayBudget, 190, 145, null, null, "right");

      doc.setTextColor(100, 116, 139);
      doc.text("Tax (0%):", 150, 153);
      doc.setTextColor(15, 23, 42);
      doc.text("0.00", 190, 153, null, null, "right");

      doc.setDrawColor(226, 232, 240);
      doc.line(145, 158, 195, 158);

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("Total:", 150, 168);
      doc.text(displayBudget, 190, 168, null, null, "right");

      // Terms & Conditions
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("Terms & Conditions:", 15, 190);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("1. Payment is due within 15 days of the invoice date.", 15, 198);
      doc.text("2. Please include the invoice number on your check or transfer.", 15, 204);

      // Footer
      doc.setFillColor(248, 250, 252);
      doc.rect(0, 270, 210, 27, 'F');

      // Footer Logo
      doc.addImage(pngDataUrl, 'PNG', 15, 275, 25, (canvas.height / canvas.width) * 25);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("support@concordrealestatebd.com | www.concordrealestatebd.com", 45, 282);

      // Save PDF
      doc.save(`Invoice_${invoiceId}_${project.name.replace(/\s+/g, '_')}.pdf`);

      if (showToast) showToast(`Professional Invoice generated for ${project.name}`, 'success');
    };

    // Fallback if image fails to load
    img.onerror = () => {
      alert("Failed to load Concord logo. Please check your internet connection and try again.");
    };
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
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="dash-btn-outline" onClick={handleExportCSV} title="Export to CSV">📥 Export CSV</button>
          <button className="dash-btn-outline" onClick={handleExportJSON} title="Export to JSON">📥 Export JSON</button>
          <button className="dash-btn-primary" onClick={() => { setShowForm(!showForm); if (showForm) { setEditIndex(null); setNewProject({ name: '', status: 'Planning', progress: 0, deadline: '', budget: '', client: '' }); } }}>
            {showForm ? 'Cancel' : '+ New Project'}
          </button>
        </div>
      </div>

      <div className="dash-controls">
        <div className="dash-search">
          <span className="dash-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search projects by name or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dash-search-input"
          />
        </div>
        <div className="dash-filters">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="dash-filter-select"
          >
            <option value="All">All Statuses</option>
            <option value="Planning">Planning</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>
        <div className="dash-results-count">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
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
            {filteredProjects.map((p) => {
              const originalIndex = projects.findIndex(proj => proj.name === p.name && proj.deadline === p.deadline);
              return (
                <tr key={originalIndex}>
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
                    <button onClick={() => handleEdit(originalIndex)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--primary-light)', padding: '4px' }} title="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button onClick={() => handleDelete(originalIndex)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }} title="Delete">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </td>
                </tr>
              );
            })}
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [newMessage, setNewMessage] = useState({
    from: '', msg: '', time: 'Just now', unread: true
  });

  const filteredMessages = messages.filter(m => {
    const matchesSearch = m.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.msg.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterUnreadOnly || m.unread;
    return matchesSearch && matchesFilter;
  });

  const handleExportCSV = () => {
    const headers = ['From', 'Message', 'Time', 'Unread'];
    const rows = filteredMessages.map(m => [m.from, m.msg, m.time, m.unread]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `messages_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Messages exported successfully!', 'success');
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(filteredMessages, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `messages_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Messages exported successfully!', 'success');
  };

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
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="dash-btn-outline" onClick={handleExportCSV} title="Export to CSV">📥 Export CSV</button>
          <button className="dash-btn-outline" onClick={handleExportJSON} title="Export to JSON">📥 Export JSON</button>
          <button className="dash-btn-primary" onClick={() => { setShowForm(!showForm); if (showForm) { setEditIndex(null); setNewMessage({ from: '', msg: '', time: 'Just now', unread: true }); } }}>
            {showForm ? 'Cancel' : '+ New Message'}
          </button>
        </div>
      </div>

      <div className="dash-controls">
        <div className="dash-search">
          <span className="dash-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search messages by sender or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dash-search-input"
          />
        </div>
        <div className="dash-filters">
          <label className="dash-filter-checkbox" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              checked={filterUnreadOnly}
              onChange={(e) => setFilterUnreadOnly(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            Show unread only
          </label>
        </div>
        <div className="dash-results-count">
          Showing {filteredMessages.length} of {messages.length} messages
        </div>
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
        {filteredMessages.map((m) => {
          const originalIndex = messages.findIndex(msg => msg.from === m.from && msg.time === m.time);
          return (
            <div key={originalIndex} className={`message-item ${m.unread ? 'message-unread' : ''}`}>
              <div className="message-avatar">{m.avatar}</div>
              <div className="message-body">
              <div className="message-top" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <span className="message-from">{m.from}</span>
                <span className="message-time">{m.time}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEdit(originalIndex)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--primary-light)', padding: '2px' }} title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                  </button>
                  <button onClick={() => handleDelete(originalIndex)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px' }} title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
              </div>
              <p className="message-text">{m.msg}</p>
            </div>
            {m.unread && <span className="unread-dot"></span>}
          </div>
          );
        })}
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

// ========== PROPERTY WATCHLIST TAB (User) ==========
function WatchlistTab({ showToast }) {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('concord_watchlist');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'Gulshan Heights Residence',
        location: 'Gulshan 2, Dhaka',
        price: '৳12.5M',
        size: '2,500 sqft',
        beds: 3,
        baths: 3,
        type: 'Apartment',
        status: 'Available',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
        addedDate: '2026-05-10',
        notes: 'Prime location, great view'
      },
      {
        id: 2,
        name: 'Banani Lake View',
        location: 'Banani 11, Dhaka',
        price: '৳18.2M',
        size: '3,200 sqft',
        beds: 4,
        baths: 4,
        type: 'Penthouse',
        status: 'Under Review',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
        addedDate: '2026-05-08',
        notes: 'Interested in lake view units'
      },
      {
        id: 3,
        name: 'Dhanmondi Premium Villa',
        location: 'Dhanmondi 27, Dhaka',
        price: '৳25M',
        size: '4,500 sqft',
        beds: 5,
        baths: 5,
        type: 'Villa',
        status: 'Available',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop',
        addedDate: '2026-05-05',
        notes: 'Family home option'
      }
    ];
  });

  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    localStorage.setItem('concord_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const filteredAndSortedWatchlist = watchlist
    .filter(property => {
      const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'All' || property.type === filterType;
      const matchesStatus = filterStatus === 'All' || property.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return parseFloat(b.price.replace(/[৳M,]/g, '')) - parseFloat(a.price.replace(/[৳M,]/g, ''));
      if (sortBy === 'size') return parseFloat(b.size) - parseFloat(a.size);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.addedDate) - new Date(a.addedDate);
    });

  const handleRemove = (id) => {
    if (window.confirm('Are you sure you want to remove this property from your watchlist?')) {
      setWatchlist(watchlist.filter(p => p.id !== id));
      showToast('Property removed from watchlist', 'success');
    }
  };

  const handleScheduleVisit = (property) => {
    showToast(`Visit scheduled for ${property.name}. Our team will contact you soon!`, 'success');
  };

  const handleRequestInfo = (property) => {
    showToast(`Information request sent for ${property.name}`, 'success');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return '#10b981';
      case 'Reserved': return '#f59e0b';
      case 'Sold': return '#ef4444';
      case 'Under Review': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Apartment': return '🏢';
      case 'Villa': return '🏡';
      case 'Penthouse': return '🌆';
      case 'Studio': return '🏠';
      default: return '🏘️';
    }
  };

  return (
    <>
      <div className="dash-page-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          Property Watchlist
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span className="watchlist-count">
            {watchlist.length} {watchlist.length === 1 ? 'Property' : 'Properties'}
          </span>
          <button className="dash-btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? '✕ Cancel' : '+ Add Property'}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="watchlist-stats">
        <div className="watchlist-stat-card" style={{ '--accent': '#3b82f6' }}>
          <div className="watchlist-stat-icon">🏘️</div>
          <div className="watchlist-stat-info">
            <span className="watchlist-stat-value">{watchlist.length}</span>
            <span className="watchlist-stat-label">Total Properties</span>
          </div>
        </div>
        <div className="watchlist-stat-card" style={{ '--accent': '#10b981' }}>
          <div className="watchlist-stat-icon">✅</div>
          <div className="watchlist-stat-info">
            <span className="watchlist-stat-value">{watchlist.filter(p => p.status === 'Available').length}</span>
            <span className="watchlist-stat-label">Available</span>
          </div>
        </div>
        <div className="watchlist-stat-card" style={{ '--accent': '#8b5cf6' }}>
          <div className="watchlist-stat-icon">⭐</div>
          <div className="watchlist-stat-info">
            <span className="watchlist-stat-value">{watchlist.filter(p => p.status === 'Under Review').length}</span>
            <span className="watchlist-stat-label">Under Review</span>
          </div>
        </div>
        <div className="watchlist-stat-card" style={{ '--accent': '#f59e0b' }}>
          <div className="watchlist-stat-icon">💰</div>
          <div className="watchlist-stat-info">
            <span className="watchlist-stat-value">
              {watchlist.length > 0 ? '৳' + (watchlist.reduce((sum, p) => sum + parseFloat(p.price.replace(/[৳M,]/g, '')), 0) / watchlist.length).toFixed(1) + 'M' : '—'}
            </span>
            <span className="watchlist-stat-label">Avg. Price</span>
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="watchlist-controls">
        <div className="watchlist-search">
          <span className="watchlist-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="watchlist-search-input"
          />
        </div>

        <div className="watchlist-filters">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="watchlist-filter-select"
          >
            <option value="All">All Types</option>
            <option value="Apartment">🏢 Apartments</option>
            <option value="Villa">🏡 Villas</option>
            <option value="Penthouse">🌆 Penthouses</option>
            <option value="Studio">🏠 Studios</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="watchlist-filter-select"
          >
            <option value="All">All Status</option>
            <option value="Available">✅ Available</option>
            <option value="Under Review">⭐ Under Review</option>
            <option value="Reserved">🔒 Reserved</option>
            <option value="Sold">❌ Sold</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="watchlist-filter-select"
          >
            <option value="date">📅 Recently Added</option>
            <option value="price">💰 Price (High-Low)</option>
            <option value="size">📐 Size (Large-Small)</option>
            <option value="name">🔤 Name (A-Z)</option>
          </select>
        </div>

        <div className="watchlist-view-toggle">
          <button
            className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Add Property Form */}
      {showAddForm && (
        <div className="dash-card" style={{ marginBottom: '1.5rem', border: '1px solid var(--accent)' }}>
          <div className="dash-card-header"><h3>Add Property to Watchlist</h3></div>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const newProperty = {
              id: Date.now(),
              name: formData.get('name'),
              location: formData.get('location'),
              price: formData.get('price'),
              size: formData.get('size'),
              beds: parseInt(formData.get('beds')),
              baths: parseInt(formData.get('baths')),
              type: formData.get('type'),
              status: 'Available',
              image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
              addedDate: new Date().toISOString().split('T')[0],
              notes: formData.get('notes') || ''
            };
            setWatchlist([newProperty, ...watchlist]);
            setShowAddForm(false);
            showToast('Property added to watchlist!', 'success');
            e.target.reset();
          }} className="watchlist-add-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', padding: '1.5rem' }}>
            <div className="form-group">
              <label>Property Name</label>
              <div className="input-wrapper"><input type="text" name="name" required placeholder="e.g., Gulshan Heights" /></div>
            </div>
            <div className="form-group">
              <label>Location</label>
              <div className="input-wrapper"><input type="text" name="location" required placeholder="e.g., Gulshan 2, Dhaka" /></div>
            </div>
            <div className="form-group">
              <label>Price</label>
              <div className="input-wrapper"><input type="text" name="price" required placeholder="e.g., ৳12.5M" /></div>
            </div>
            <div className="form-group">
              <label>Size</label>
              <div className="input-wrapper"><input type="text" name="size" required placeholder="e.g., 2,500 sqft" /></div>
            </div>
            <div className="form-group">
              <label>Bedrooms</label>
              <div className="input-wrapper"><input type="number" name="beds" required min="1" placeholder="3" /></div>
            </div>
            <div className="form-group">
              <label>Bathrooms</label>
              <div className="input-wrapper"><input type="number" name="baths" required min="1" placeholder="3" /></div>
            </div>
            <div className="form-group">
              <label>Property Type</label>
              <div className="input-wrapper" style={{ padding: '0 1rem' }}>
                <select name="type" style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', outline: 'none' }}>
                  <option value="Apartment">🏢 Apartment</option>
                  <option value="Villa">🏡 Villa</option>
                  <option value="Penthouse">🌆 Penthouse</option>
                  <option value="Studio">🏠 Studio</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Notes (Optional)</label>
              <div className="input-wrapper"><input type="text" name="notes" placeholder="Personal notes..." /></div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className="dash-btn-primary" style={{ width: '100%' }}>Add to Watchlist</button>
            </div>
          </form>
        </div>
      )}

      {/* Watchlist Grid/List */}
      {filteredAndSortedWatchlist.length === 0 ? (
        <div className="dash-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏘️</div>
          <h3 style={{ marginBottom: '.5rem' }}>No Properties Found</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            {searchTerm || filterType !== 'All' || filterStatus !== 'All'
              ? 'Try adjusting your filters or search terms.'
              : 'Start building your dream home watchlist!'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="watchlist-grid">
          {filteredAndSortedWatchlist.map((property, index) => (
            <div key={property.id} className="watchlist-card" style={{ animationDelay: `${index * 0.08}s` }}>
              <div className="watchlist-card-image">
                <img src={property.image} alt={property.name} />
                <div className="watchlist-card-badges">
                  <span className="watchlist-type-badge">{getTypeIcon(property.type)} {property.type}</span>
                  <span className="watchlist-status-badge" style={{ background: `${getStatusColor(property.status)}22`, color: getStatusColor(property.status) }}>
                    {property.status}
                  </span>
                </div>
                <button className="watchlist-remove-btn" onClick={() => handleRemove(property.id)} title="Remove from watchlist">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="watchlist-card-content">
                <h3 className="watchlist-property-name">{property.name}</h3>
                <p className="watchlist-property-location">📍 {property.location}</p>

                <div className="watchlist-property-specs">
                  <span>🛏️ {property.beds} Beds</span>
                  <span>🚿 {property.baths} Baths</span>
                  <span>📐 {property.size}</span>
                </div>

                <div className="watchlist-property-price">{property.price}</div>

                {property.notes && (
                  <div className="watchlist-property-notes">
                    <span>📝 {property.notes}</span>
                  </div>
                )}

                <div className="watchlist-card-actions">
                  <button className="watchlist-action-btn watchlist-action-primary" onClick={() => handleScheduleVisit(property)}>
                    📅 Schedule Visit
                  </button>
                  <button className="watchlist-action-btn watchlist-action-secondary" onClick={() => handleRequestInfo(property)}>
                    💬 Request Info
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="watchlist-list">
          {filteredAndSortedWatchlist.map((property, index) => (
            <div key={property.id} className="watchlist-list-item" style={{ animationDelay: `${index * 0.05}s` }}>
              <img src={property.image} alt={property.name} className="watchlist-list-image" />
              <div className="watchlist-list-content">
                <div className="watchlist-list-header">
                  <h3>{property.name}</h3>
                  <span className="watchlist-price-tag">{property.price}</span>
                </div>
                <p className="watchlist-list-location">📍 {property.location}</p>
                <div className="watchlist-list-specs">
                  <span>{getTypeIcon(property.type)} {property.type}</span>
                  <span>🛏️ {property.beds} Beds</span>
                  <span>🚿 {property.baths} Baths</span>
                  <span>📐 {property.size}</span>
                  <span className="watchlist-status-badge" style={{ background: `${getStatusColor(property.status)}22`, color: getStatusColor(property.status) }}>
                    {property.status}
                  </span>
                </div>
                {property.notes && (
                  <p className="watchlist-list-notes">📝 {property.notes}</p>
                )}
              </div>
              <div className="watchlist-list-actions">
                <button onClick={() => handleScheduleVisit(property)} className="dash-btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  📅 Visit
                </button>
                <button onClick={() => handleRequestInfo(property)} className="dash-btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  💬 Info
                </button>
                <button onClick={() => handleRemove(property.id)} style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Remove">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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
    bloodGroup: user.bloodGroup || '',
    phone: user.phone || '',
    location: user.location || '',
    bio: user.bio || '',
    linkedin: user.linkedin || '',
    twitter: user.twitter || ''
  });

  // Get real stats from localStorage
  const [stats, setStats] = useState({
    projects: 0,
    completedProjects: 0,
    messages: 0,
    achievements: 0
  });

  useEffect(() => {
    const savedProjects = localStorage.getItem('concord_projects');
    const savedMessages = localStorage.getItem('concord_messages');

    if (savedProjects) {
      const projects = JSON.parse(savedProjects);
      setStats(prev => ({
        ...prev,
        projects: projects.length,
        completedProjects: projects.filter(p => p.status === 'Completed').length
      }));
    }

    if (savedMessages) {
      const messages = JSON.parse(savedMessages);
      setStats(prev => ({ ...prev, messages: messages.length }));
    }

    // Calculate achievements based on activity
    setStats(prev => ({
      ...prev,
      achievements: Math.floor(prev.completedProjects * 10 + prev.messages * 5)
    }));
  }, []);

  const recentActivities = [
    { icon: '📁', text: 'Updated project portfolio', time: '2 hours ago', type: 'project' },
    { icon: '💬', text: 'Received new message', time: '5 hours ago', type: 'message' },
    { icon: '✅', text: 'Completed task review', time: 'Yesterday', type: 'task' },
    { icon: '🏆', text: 'Earned new achievement', time: '2 days ago', type: 'achievement' },
  ];

  const achievements = [
    { icon: '🚀', title: 'Early Adopter', description: 'Joined in the first month', unlocked: true },
    { icon: '📁', title: 'Project Master', description: 'Created 5+ projects', unlocked: stats.projects >= 5 },
    { icon: '⭐', title: 'Perfect Score', description: 'Completed all tasks', unlocked: stats.completedProjects === stats.projects && stats.projects > 0 },
    { icon: '💬', title: 'Communicator', description: 'Sent 10+ messages', unlocked: stats.messages >= 10 },
    { icon: '🔥', title: 'On Fire', description: '7 day login streak', unlocked: false },
    { icon: '🏆', title: 'Champion', description: 'Top performer', unlocked: stats.achievements >= 100 },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...formData,
      fullName: `${formData.firstName} ${formData.lastName}`.trim()
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Save extended profile data permanently so it survives logout
    localStorage.setItem(`concord_profile_${updatedUser.email}`, JSON.stringify({
      firstName: formData.firstName,
      lastName: formData.lastName,
      nid: formData.nid,
      passport: formData.passport,
      bloodGroup: formData.bloodGroup,
      phone: formData.phone,
      location: formData.location,
      bio: formData.bio,
      linkedin: formData.linkedin,
      twitter: formData.twitter,
      fullName: updatedUser.fullName
    }));

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
        <h2>👤 My Profile</h2>
        <button className="dash-btn-primary" onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}>
          {isEditing ? '✕ Cancel' : '✏️ Edit Profile'}
        </button>
      </div>

      {/* Profile Banner */}
      <div className="profile-banner-wrapper">
        <div className="profile-banner"></div>
        <div className="profile-banner-content">
          <div className="profile-avatar-container">
            <div className="profile-avatar-modern">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Profile" className="profile-avatar-img" />
              ) : (
                <span className="profile-avatar-letter">
                  {(formData.firstName?.charAt(0) || formData.fullName?.charAt(0) || 'U').toUpperCase()}
                </span>
              )}
              {isEditing && (
                <label className="profile-avatar-upload">
                  <span>📷</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>
          <div className="profile-header-info">
            <h1 className="profile-name">{`${formData.firstName || ''} ${formData.lastName || ''}`.trim() || formData.fullName}</h1>
            <p className="profile-title">{formData.bio || 'Real Estate Professional'}</p>
            <div className="profile-meta">
              <span className={`role-badge ${formData.role === 'office_member' || formData.role === 'admin' ? 'role-office' : 'role-user'}`}>
                {formData.role === 'office_member' || formData.role === 'admin' ? '🏢 Office Member' : '👤 Client'}
              </span>
              {formData.location && (
                <span className="profile-location">📍 {formData.location}</span>
              )}
            </div>
          </div>
          <div className="profile-social-links">
            {formData.linkedin && (
              <a href={formData.linkedin} className="social-link-modern" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            )}
            {formData.twitter && (
              <a href={formData.twitter} className="social-link-modern" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            )}
            <a href={`mailto:${formData.email}`} className="social-link-modern" title="Email">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </a>
            {formData.phone && (
              <a href={`tel:${formData.phone}`} className="social-link-modern" title="Phone">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="profile-content-grid">
        {/* Left Column */}
        <div className="profile-left-col">
          {/* Stats Cards */}
          <div className="profile-stats-grid">
            <div className="profile-stat-card" style={{ '--accent': '#3b82f6' }}>
              <div className="stat-icon-modern">📁</div>
              <div className="stat-info-modern">
                <span className="stat-value-modern">{stats.projects}</span>
                <span className="stat-label-modern">Projects</span>
              </div>
            </div>
            <div className="profile-stat-card" style={{ '--accent': '#10b981' }}>
              <div className="stat-icon-modern">✅</div>
              <div className="stat-info-modern">
                <span className="stat-value-modern">{stats.completedProjects}</span>
                <span className="stat-label-modern">Completed</span>
              </div>
            </div>
            <div className="profile-stat-card" style={{ '--accent': '#8b5cf6' }}>
              <div className="stat-icon-modern">💬</div>
              <div className="stat-info-modern">
                <span className="stat-value-modern">{stats.messages}</span>
                <span className="stat-label-modern">Messages</span>
              </div>
            </div>
            <div className="profile-stat-card" style={{ '--accent': '#f59e0b' }}>
              <div className="stat-icon-modern">🏆</div>
              <div className="stat-info-modern">
                <span className="stat-value-modern">{stats.achievements}</span>
                <span className="stat-label-modern">Points</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="dash-card profile-achievements-card">
            <h3 className="card-title-modern">🏆 Achievements</h3>
            <div className="achievements-grid">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`achievement-item ${achievement.unlocked ? 'achievement-unlocked' : 'achievement-locked'}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-info">
                    <h4>{achievement.title}</h4>
                    <p>{achievement.description}</p>
                  </div>
                  {!achievement.unlocked && <div className="achievement-lock">🔒</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="profile-right-col">
          {/* Account Details */}
          <div className="dash-card profile-details-modern">
            <h3 className="card-title-modern">📋 Account Details</h3>
            {isEditing ? (
              <form onSubmit={handleSave} className="profile-edit-form">
                <div className="form-row-modern">
                  <div className="form-group-modern">
                    <label>First Name</label>
                    <div className="input-wrapper-modern">
                      <input
                        type="text"
                        required
                        value={formData.firstName || ''}
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div className="form-group-modern">
                    <label>Last Name</label>
                    <div className="input-wrapper-modern">
                      <input
                        type="text"
                        required
                        value={formData.lastName || ''}
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group-modern">
                  <label>Bio</label>
                  <div className="input-wrapper-modern">
                    <textarea
                      value={formData.bio || ''}
                      onChange={e => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows="2"
                    />
                  </div>
                </div>

                <div className="form-row-modern">
                  <div className="form-group-modern">
                    <label>Email</label>
                    <div className="input-wrapper-modern">
                      <input
                        type="email"
                        required
                        value={formData.email || ''}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group-modern">
                    <label>Phone</label>
                    <div className="input-wrapper-modern">
                      <input
                        type="tel"
                        maxLength={11}
                        onInput={e => e.target.value = e.target.value.replace(/\D/g, '')}
                        value={formData.phone || ''}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+880 1XXX-XXXXXX"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group-modern">
                  <label>Location</label>
                  <div className="input-wrapper-modern">
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Dhaka, Bangladesh"
                    />
                  </div>
                </div>

                <div className="form-row-modern">
                  <div className="form-group-modern">
                    <label>NID</label>
                    <div className="input-wrapper-modern">
                      <input
                        type="text"
                        value={formData.nid || ''}
                        onChange={e => setFormData({ ...formData, nid: e.target.value })}
                        placeholder="National ID Number"
                      />
                    </div>
                  </div>
                  <div className="form-group-modern">
                    <label>Passport</label>
                    <div className="input-wrapper-modern">
                      <input
                        type="text"
                        value={formData.passport || ''}
                        onChange={e => setFormData({ ...formData, passport: e.target.value })}
                        placeholder="Passport Number"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row-modern">
               <div className="form-group-modern">
  <label>Blood Group</label>

  <div className="input-wrapper-modern">
    <select
      style={{
        width: '100%',
        padding: '14px 16px',
        borderRadius: '12px',
        border: '1px solid #2563eb',
        background: '#0f172a',
        color: '#ffffff',
        fontSize: '16px',
        outline: 'none'
      }}
      value={formData.bloodGroup || ''}
      onChange={e =>
        setFormData({
          ...formData,
          bloodGroup: e.target.value
        })
      }
    >
      <option
        value=""
        style={{
          background: '#0f172a',
          color: '#ffffff'
        }}
      >
        Select Blood Group
      </option>

      <option value="A+" style={{ background: '#0f172a', color: '#ffffff' }}>A+</option>
      <option value="A-" style={{ background: '#0f172a', color: '#ffffff' }}>A-</option>
      <option value="B+" style={{ background: '#0f172a', color: '#ffffff' }}>B+</option>
      <option value="B-" style={{ background: '#0f172a', color: '#ffffff' }}>B-</option>
      <option value="O+" style={{ background: '#0f172a', color: '#ffffff' }}>O+</option>
      <option value="O-" style={{ background: '#0f172a', color: '#ffffff' }}>O-</option>
      <option value="AB+" style={{ background: '#0f172a', color: '#ffffff' }}>AB+</option>
      <option value="AB-" style={{ background: '#0f172a', color: '#ffffff' }}>AB-</option>
    </select>
  </div>
</div>
                  <div className="form-group-modern">
                    <label>Role</label>
                    <div className="input-wrapper-modern input-readonly">
                      <input
                        type="text"
                        value={formData.role || ''}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row-modern">
                  <div className="form-group-modern">
                    <label>LinkedIn</label>
                    <div className="input-wrapper-modern">
                      <input
                        type="url"
                        value={formData.linkedin || ''}
                        onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                  <div className="form-group-modern">
                    <label>Twitter</label>
                    <div className="input-wrapper-modern">
                      <input
                        type="url"
                        value={formData.twitter || ''}
                        onChange={e => setFormData({ ...formData, twitter: e.target.value })}
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                  </div>
                </div>

                <div className="profile-form-actions">
                  <button type="submit" className="dash-btn-primary">💾 Save Changes</button>
                  <button type="button" className="dash-btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className="profile-details-list">
                <div className="detail-item-modern">
                  <span className="detail-label">Full Name</span>
                  <span className="detail-value">{user.firstName || ''} {user.lastName || ''}</span>
                </div>
                <div className="detail-item-modern">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="detail-item-modern">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{user.phone}</span>
                  </div>
                )}
                {user.location && (
                  <div className="detail-item-modern">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{user.location}</span>
                  </div>
                )}
                {user.nid && (
                  <div className="detail-item-modern">
                    <span className="detail-label">NID</span>
                    <span className="detail-value">{user.nid}</span>
                  </div>
                )}
                {user.passport && (
                  <div className="detail-item-modern">
                    <span className="detail-label">Passport</span>
                    <span className="detail-value">{user.passport}</span>
                  </div>
                )}
                {user.bloodGroup && (
                  <div className="detail-item-modern">
                    <span className="detail-label">Blood Group</span>
                    <span className="detail-value blood-group-badge">{user.bloodGroup}</span>
                  </div>
                )}
                <div className="detail-item-modern">
                  <span className="detail-label">Role</span>
                  <span className="detail-value">{user.role}</span>
                </div>
                <div className="detail-item-modern">
                  <span className="detail-label">Member Since</span>
                  <span className="detail-value">May 2026</span>
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="dash-card activity-timeline-card">
            <h3 className="card-title-modern">⚡ Recent Activity</h3>
            <div className="activity-timeline">
              {recentActivities.map((activity, index) => (
                <div key={index} className="timeline-item" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-icon">{activity.icon}</span>
                      <span className="timeline-text">{activity.text}</span>
                    </div>
                    <span className="timeline-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

    let parsedUser = JSON.parse(stored);

    // Restore extended profile data if it exists for this user
    const extendedProfile = localStorage.getItem(`concord_profile_${parsedUser.email}`);
    if (extendedProfile) {
      parsedUser = { ...parsedUser, ...JSON.parse(extendedProfile) };
      localStorage.setItem('user', JSON.stringify(parsedUser)); // Sync merged data
    }

    setUser(parsedUser);

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
      { id: 'watchlist', label: 'Property Watchlist', icon: '🏘️' },
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
      case 'watchlist': return <WatchlistTab showToast={showToast} />;
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
