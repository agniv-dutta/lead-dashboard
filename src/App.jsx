import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import ModelAnalysis from "./components/Model_Analysis";
import OverviewDashboard from "./components/OverviewDashboard";
import BusinessImpactSummary from "./components/BusinessImpactSummary";
import { useLeadsData } from "./hooks/useLeadsData";
import "./App.css";

const dummyUser = {
  name: "Lead Ops Manager",
  email: "ops@tata.com",
  password: "demo123"
};

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [activePage, setActivePage] = useState("overview");
  const [isAuthed, setIsAuthed] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [form, setForm] = useState({ name: dummyUser.name, email: dummyUser.email, password: dummyUser.password });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { data, rows, loading, lastUpdated, refetch, selectedModel, setSelectedModel } = useLeadsData();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isDark = useMemo(() => theme === "dark", [theme]);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setIsAuthed(true);
    setActivePage("overview");
  };

  const handleLogout = () => {
    setIsAuthed(false);
    setAuthMode("login");
  };

  if (!isAuthed) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="brand-logo"><span>Tata Motors</span></div>
            <h2>{authMode === "login" ? "Sign in" : "Create account"}</h2>
            <p>Use the dummy credentials to get started.</p>
          </div>

          <form className="auth-form" onSubmit={handleAuthSubmit}>
            {authMode === "register" && (
              <div className="form-group">
                <label>Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Doe"
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button className="auth-submit-btn" type="submit">
              {authMode === "login" ? "Login" : "Register"}
            </button>
          </form>

          <button
            className="auth-toggle-btn"
            type="button"
            onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
          >
            {authMode === "login" ? "Create an account" : "Have an account? Sign in"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : "sidebar-open"}`}>
      <header className="top-nav">
        <div className="brand-title">Tata Lead Dashboard</div>
        <div className="nav-right">
          <div className="page-info">
            <h1>{activePage === "overview" ? "Lead Overview" : "Model Analysis"}</h1>
            <div className="dealership-name">Track lead quality across Tata models</div>
          </div>
          <button
            className={`theme-switch ${isDark ? "is-dark" : ""}`}
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            <span className="switch-track">
              <span className="switch-thumb" />
            </span>
            <span className="switch-label">{isDark ? "Dark" : "Light"}</span>
          </button>
        </div>
      </header>

      <div className={`dashboard-content ${sidebarCollapsed ? "sidebar-collapsed" : "sidebar-open"}`}>
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={handleLogout}
        />

        <main className="main-content">
          <div className="page-tabs">
            <div className="page-tabs-left">
              <button
                className={`tab-btn ${activePage === "overview" ? "active" : ""}`}
                type="button"
                onClick={() => setActivePage("overview")}
              >
                Overview
              </button>
              <button
                className={`tab-btn ${activePage === "model-analysis" ? "active" : ""}`}
                type="button"
                onClick={() => setActivePage("model-analysis")}
              >
                Model Analysis
              </button>
              <button
                className={`tab-btn ${activePage === "business-summary" ? "active" : ""}`}
                type="button"
                onClick={() => setActivePage("business-summary")}
              >
                Business Summary
              </button>
            </div>
            {activePage === "model-analysis" && (
              <div className="page-tabs-right">
                <label className="tab-label">Model</label>
                <select
                  className="tab-select"
                  value={selectedModel}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedModel(val);
                    setActivePage("model-analysis");
                  }}
                >
                  {["All Models", "Curvv", "Punch", "Nexon", "Sierra", "Harrier", "Safari"].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {activePage === "overview" && (
            <OverviewDashboard rows={rows} loading={loading} lastUpdated={lastUpdated} onRefresh={refetch} />
          )}
          {activePage === "model-analysis" && (
            <ModelAnalysis
              selectedModel={selectedModel}
              data={data}
              loading={loading}
              lastUpdated={lastUpdated}
              onRefresh={refetch}
            />
          )}
          {activePage === "business-summary" && (
            <BusinessImpactSummary />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
