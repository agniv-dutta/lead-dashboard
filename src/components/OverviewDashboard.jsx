import { useMemo, useState, useEffect } from "react";
import LeadTrend from "./LeadTrend";
import ConversionFunnel from "./ConversionFunnel";
import LeadQualityScore from "./LeadQualityScore";
import SmartAlerts from "./SmartAlerts";
import SalesStageHeatmap from "./SalesStageHeatmap";
import BestPerformingPincode from "./BestPerformingPincode";
import BusinessImpactSummary from "./BusinessImpactSummary";
import InsightsDelta from "./InsightsDelta";
import CallDensityMap from "./CallDensityMap";

function AnimatedCounter({ value, duration = 800 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;

    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    
    const timer = setInterval(() => {
      start += increment;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{count}</>;
}

export default function OverviewDashboard({ rows = [], loading = false, lastUpdated = null, onRefresh }) {
  const [activeTab, setActiveTab] = useState("trend");
  const [lobFilter, setLobFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("weekly");
  const [searchQuery, setSearchQuery] = useState("");
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredRows = useMemo(() => {
    let filtered = rows;
    
    // Filter by LOB
    if (lobFilter !== "all") {
      filtered = filtered.filter(row => {
        const lob = (row.lob || "").toLowerCase();
        if (lobFilter === "pv") return lob === "pv" || lob === "passenger vehicle";
        if (lobFilter === "ev") return lob === "ev" || lob === "electric vehicle";
        return true;
      });
    }
    
    // Filter by time
    const now = new Date();
    filtered = filtered.filter(row => {
      const dateField = row.created_at || row.Created_Date || row.opty_created_date;
      if (!dateField) return true;
      
      const rowDate = new Date(dateField);
      
      // If using custom date range
      if (useCustomDate && fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999); // Include entire end date
        return rowDate >= from && rowDate <= to;
      }
      
      // Otherwise use preset time filters
      if (timeFilter === "today") {
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
        return rowDate >= todayStart && rowDate <= todayEnd;
      }
      
      const diffTime = Math.abs(now - rowDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (timeFilter === "weekly") return diffDays <= 7;
      if (timeFilter === "monthly") return diffDays <= 30;
      if (timeFilter === "yearly") return diffDays <= 365;
      return true;
    });
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(row => {
        const searchableFields = [
          row.name || row.Name || row.full_name || "",
          row.phone || row.Phone || row.mobile || row.Mobile || "",
          row.email || row.Email || "",
          row.model || row.Model || "",
          row.pincode || row.Pincode || row.postal_code || "",
          row.city || row.City || "",
          row.state || row.State || "",
          row.lob || row.LOB || "",
          row.lead_classification_status || row.Status || "",
          row.lead_quality_score || ""
        ];
        
        return searchableFields.some(field => 
          String(field).toLowerCase().includes(query)
        );
      });
    }
    
    return filtered;
  }, [rows, lobFilter, timeFilter, searchQuery, useCustomDate, fromDate, toDate]);

  const handleExport = () => {
    const csvContent = [
      Object.keys(filteredRows[0] || {}).join(","),
      ...filteredRows.map(row => Object.values(row).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tata-leads-${modelFilter}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    const total = filteredRows.length;
    const hot = filteredRows.filter(r => r.lead_classification_status === "Hot").length;
    const warm = filteredRows.filter(r => r.lead_classification_status === "Warm").length;
    const cold = filteredRows.filter(r => r.lead_classification_status === "Cold").length;

    const modelCounts = filteredRows.reduce((acc, row) => {
      const key = (row.model || row.Model || "Unknown").trim() || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const topModels = Object.entries(modelCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      total,
      hot,
      warm,
      cold,
      topModels,
      modelCount: Object.keys(modelCounts).length
    };
  }, [filteredRows]);

  const recentLeads = filteredRows.slice(0, 8);

  return (
    <div className="overview-root">
      <section className="overview-hero">
        <div>
          <p className="muted">Welcome back</p>
          <h2>Lead Classification Dashboard</h2>
          <p className="muted">Monitor calls, lead quality, and stages at a glance.</p>
        </div>
        <div className="metric-badges">
          <div className="metric-badge">
            <span className="metric-label">Total Calls</span>
            <span className="metric-value">{stats.total}</span>
          </div>
          <div className="metric-badge">
            <span className="metric-label">Models</span>
            <span className="metric-value">{stats.modelCount}</span>
          </div>
          <div className="metric-badge">
            <span className="metric-label">Last Update</span>
            <span className="metric-value">{lastUpdated || "n/a"}</span>
          </div>
          <button className="btn" type="button" onClick={onRefresh}>Refresh</button>
        </div>
      </section>

      <div className="section-tabs">
        <div className="section-tab-buttons">
          {[
            { id: "trend", label: "Lead Trend" },
            { id: "quality", label: "Lead Quality Score" },
            { id: "funnel", label: "Conversion Funnel" },
            { id: "map", label: "Call Density Map" },
            { id: "heatmap", label: "Sales Stage Heatmap" },
            { id: "recent", label: "Recent Leads" }
          ].map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="search-bar-container">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search leads by name, phone, email, model, pincode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="search-clear"
                onClick={() => setSearchQuery("")}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
          <button className="btn glowing" onClick={handleExport}>
            Export Data
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon calls"><span className="stat-letter">C</span></div>
          <div className="stat-content">
            <div className="stat-value"><AnimatedCounter value={stats.total} /></div>
            <div className="stat-label">Total Calls</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon hot"><span className="stat-letter">H</span></div>
          <div className="stat-content">
            <div className="stat-value"><AnimatedCounter value={stats.hot} /></div>
            <div className="stat-label">Hot Leads</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warm"><span className="stat-letter">W</span></div>
          <div className="stat-content">
            <div className="stat-value"><AnimatedCounter value={stats.warm} /></div>
            <div className="stat-label">Warm Leads</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cold"><span className="stat-letter">C</span></div>
          <div className="stat-content">
            <div className="stat-value"><AnimatedCounter value={stats.cold} /></div>
            <div className="stat-label">Cold Leads</div>
          </div>
        </div>
        <div className="stat-card" style={{ gridColumn: 'span 2', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <label style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: '700' }}>Vehicle Type (LOB)</label>
              <select 
                value={lobFilter}
                onChange={(e) => setLobFilter(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--panel)',
                  color: 'var(--text)',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                <option value="all">All Vehicles</option>
                <option value="pv">PV (Passenger Vehicle)</option>
                <option value="ev">EV (Electric Vehicle)</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <label style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: '700' }}>Time Period</label>
              <select 
                value={useCustomDate ? "custom" : timeFilter}
                onChange={(e) => {
                  if (e.target.value === "custom") {
                    setUseCustomDate(true);
                  } else {
                    setUseCustomDate(false);
                    setTimeFilter(e.target.value);
                  }
                }}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--panel)',
                  color: 'var(--text)',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                <option value="today">Today</option>
                <option value="weekly">Weekly (Last 7 Days)</option>
                <option value="monthly">Monthly (Last 30 Days)</option>
                <option value="yearly">Yearly (Last 365 Days)</option>
                <option value="custom">Custom Date Range</option>
              </select>
            </div>
          </div>
        </div>

        {useCustomDate && (
          <div className="stat-card" style={{ gridColumn: 'span 2', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: '16px', width: '100%', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <label style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: '700' }}>From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    background: 'var(--panel)',
                    color: 'var(--text)',
                    fontSize: '14px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <label style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: '700' }}>To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    background: 'var(--panel)',
                    color: 'var(--text)',
                    fontSize: '14px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                />
              </div>
              <button
                onClick={() => {
                  setUseCustomDate(false);
                  setFromDate("");
                  setToDate("");
                }}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--danger)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.opacity = '0.8'}
                onMouseOut={(e) => e.target.style.opacity = '1'}
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="section-panels">
        {activeTab === "trend" && (loading ? <div className="skeleton skeleton-card" /> : <LeadTrend rows={filteredRows} />)}
        {activeTab === "quality" && (
          loading ? <div className="skeleton skeleton-card" /> : <LeadQualityScore rows={filteredRows} />
        )}
        {activeTab === "funnel" && (
          loading ? <div className="skeleton skeleton-card" /> : <ConversionFunnel rows={filteredRows} />
        )}
        {activeTab === "map" && (
          loading ? <div className="skeleton skeleton-card" /> : <CallDensityMap rows={filteredRows} />
        )}
        {activeTab === "heatmap" && (
          loading ? <div className="skeleton skeleton-card" /> : <SalesStageHeatmap rows={filteredRows} />
        )}
      </div>
    </div>
  );
}
