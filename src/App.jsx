import React, { useState } from "react";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import DashboardMain from "./components/DashboardMain";
import ModelAnalysis from "./components/ModelAnalysis";
import Pipeline from "./components/Pipeline";
import CallMap from "./components/CallMap";
import AlertsModule from "./components/AlertsModule";
import { useQuery } from '@tanstack/react-query';

const DEMO_EMAIL = 'ops@tata.com';
const DEMO_PASSWORD = 'demo123';

class DashboardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Dashboard render error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-card" style={{ padding: '18px' }}>
          <h2 className="card-heading" style={{ marginBottom: '8px' }}>Unable to render dashboard</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '12px' }}>
            A component crashed while loading. Switch tabs or refresh to retry.
          </p>
          <button
            type="button"
            className="btn-assign"
            onClick={() => window.location.reload()}
            style={{ borderLeft: 'none' }}
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  // Quick fetch to get urgent leads for the topbar
  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => fetch('/api/leads/alerts').then(res => res.json()),
    refetchInterval: 60000,
    enabled: isAuthenticated,
  });

  const onAuthSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}
      >
        <section
          className="glass-card"
          style={{
            width: '100%',
            maxWidth: '440px',
            padding: '22px',
            border: '1px solid var(--glass-border)'
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <div className="brand-logo" style={{ marginBottom: '8px' }}>TATA<span>.CRM</span></div>
            <h1 style={{ fontSize: '20px', marginBottom: '6px' }}>
              {authMode === 'signin' ? 'Sign In' : 'Create Account'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              {authMode === 'signin'
                ? 'Use demo credentials to access the lead dashboard.'
                : 'Register to continue into the dashboard demo.'}
            </p>
          </div>

          <form onSubmit={onAuthSubmit} style={{ display: 'grid', gap: '12px' }}>
            <label style={{ display: 'grid', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ops@tata.com"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  outline: 'none'
                }}
                required
              />
            </label>

            <label style={{ display: 'grid', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="demo123"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  outline: 'none'
                }}
                required
              />
            </label>

            <button
              type="submit"
              className="btn-assign"
              style={{
                marginTop: '6px',
                borderLeft: 'none',
                justifySelf: 'start'
              }}
            >
              {authMode === 'signin' ? 'Sign In' : 'Register'}
            </button>
          </form>

          <div style={{ marginTop: '14px', fontSize: '12px', color: 'var(--text-muted)' }}>
            {authMode === 'signin' ? 'New user?' : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => setAuthMode(authMode === 'signin' ? 'register' : 'signin')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--green-primary)',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              {authMode === 'signin' ? 'Register' : 'Sign In'}
            </button>
          </div>

          <p style={{ marginTop: '10px', fontSize: '11px', color: 'var(--text-labels)' }}>
            Demo credentials: {DEMO_EMAIL} / {DEMO_PASSWORD}
          </p>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <Topbar 
        urgentLeads={alerts.length} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="main-viewport">
        <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="main-content-area">
          <DashboardErrorBoundary>
            {activeTab === 'Overview' && <DashboardMain />}
            {activeTab === 'Model Analysis' && <ModelAnalysis />}
            {activeTab === 'Pipeline' && <Pipeline />}
            {activeTab === 'Call Map' && <CallMap />}
            {activeTab === 'Alerts' && <AlertsModule />}
          </DashboardErrorBoundary>
        </div>
      </div>
    </div>
  );
}

export default App;
