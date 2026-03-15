import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import LeadTrendChart from './LeadTrendChart';
import ModelPerformance from './ModelPerformance';
import AIImpact from './AIImpact';
import StageHealth from './StageHealth';
import PincodePerformance from './PincodePerformance';
import RecentLeads from './RecentLeads';
import LeadVelocity from './LeadVelocity';
import LiveCallMap from './LiveCallMap';

// Custom hook for the 900-1100ms count-up requested in the brief
function useCountUp(endVal, duration = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (endVal === undefined || endVal === null) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * endVal));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(endVal); // Ensure it ends exactly on the value
      }
    };
    window.requestAnimationFrame(step);
  }, [endVal, duration]);

  return count;
}

export default function DashboardMain() {
  return (
    <div className="dashboard-grid">
      {/* Row 1: KPIs */}
      <div className="kpi-strip">
        <KPICard title="Total Calls" mkey="total" color="#ff6d00" />
        <KPICard title="Hot Leads" mkey="hot" color="#ff6d00" />
        <KPICard title="Warm Leads" mkey="warm" color="#00e676" />
        <KPICard title="Bookings" mkey="bookings" color="#00e676" />
        <KPICard title="Retailed" mkey="retailed" color="#00bfa5" />
      </div>

      {/* Row 2: Alert Bar */}
      <AlertBar />

      {/* Row 3: 3-column grid */}
      <div className="row-3-grid">
        <div className="col-a">
          <div className="glass-card full-height">
            <LeadTrendChart />
          </div>
        </div>
        <div className="col-b">
          <div className="glass-card mb-gap">
            <ModelPerformance />
          </div>
          <div className="glass-card">
            <AIImpact />
          </div>
        </div>
        <div className="col-c">
          <div className="glass-card mb-gap">
            <StageHealth />
          </div>
          <div className="glass-card">
            <PincodePerformance />
          </div>
        </div>
      </div>

      {/* Row 4: 2-column grid */}
      <div className="row-4-grid">
        <div className="col-a">
          <div className="glass-card full-height">
            <RecentLeads />
          </div>
        </div>
        <div className="col-b">
          <div className="glass-card full-height">
            <LeadVelocity />
          </div>
        </div>
      </div>

      {/* Row 5: Live Geospatial Map */}
      <LiveCallMap />
    </div>
  );
}

function KPICard({ title, mkey, color }) {
  const { data = {} } = useQuery({
    queryKey: ['summary'],
    queryFn: () => fetch('/api/leads/summary').then(r => r.json())
  });
  
  const val = data[mkey] || 0;
  const count = useCountUp(val, 1000);

  return (
    <div className="glass-card kpi-card">
      <div className="kpi-glow" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}></div>
      <div className="label-uppercase">{title}</div>
      <div className="kpi-value">{count.toLocaleString()}</div>
      {/* Delta label logic hardcoded for mockup, in reality fetched from API */}
      <div className="delta-label" style={{ color: color === '#ff6d00' ? '#ff6d00' : '#00e676' }}>
        {color === '#ff6d00' ? '▲ High Priority' : '▲ Healthy Pipeline'}
      </div>
    </div>
  );
}

function AlertBar() {
  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => fetch('/api/leads/alerts').then(res => res.json())
  });

  if (!alerts.length) return null;

  return (
    <div className="alert-bar mb-gap">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '15px' }}>⚠</span>
        <span>{alerts.length} Hot leads pending — no contact recorded in past 48h.</span>
      </div>
      <button className="btn-assign">Assign Now</button>
    </div>
  );
}
