import React, { useState, useEffect } from 'react';

export default function Topbar({ user = { name: "Lead Ops Desk" }, urgentLeads = 0, toggleSidebar, activeTab, setActiveTab }) {
  // Local state to track sync timestamp (simulated)
  const [syncTime, setSyncTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setSyncTime(new Date().toLocaleTimeString());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button onClick={toggleSidebar} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <div className="brand-logo">TATA<span>.CRM</span></div>
        <div className="greeting-wrapper">
          <span className="greeting-text">Welcome back, <strong>{user.name}</strong></span>
          <span className="urgent-badge">— {urgentLeads} urgent {urgentLeads === 1 ? 'lead' : 'leads'}</span>
        </div>
      </div>
      
      <div className="topbar-center">
        <div className="pulse-dot"></div>
        <nav className="nav-chips">
          {['Overview', 'Model Analysis', 'Pipeline', 'Call Map', 'Alerts'].map(tab => (
            <button 
              key={tab}
              className={`nav-chip ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="topbar-right">
        <div className="sync-status">Synced: {syncTime}</div>
        <button className="export-btn" onClick={() => alert('CSV Export Triggered')}>Export CSV</button>
        <div className="avatar">{user.name.charAt(0)}</div>
      </div>
    </header>
  );
}
