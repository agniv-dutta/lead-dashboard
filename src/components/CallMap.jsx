import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { useLeadsData } from '../hooks/useLeadsData';

const CallDensityMap = lazy(() => import('./CallDensityMap'));

export default function CallMap() {
  const { rows, loading, lastUpdated, refetch } = useLeadsData();
  const [refreshSeconds, setRefreshSeconds] = useState(30);
  const [lastSyncTime, setLastSyncTime] = useState(() => new Date());

  useEffect(() => {
    if (rows.length > 0) {
      setLastSyncTime(new Date());
    }
  }, [rows]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      refetch();
    }, refreshSeconds * 1000);

    return () => window.clearInterval(intervalId);
  }, [refetch, refreshSeconds]);

  const handleManualRefresh = () => {
    refetch();
    setLastSyncTime(new Date());
  };

  const pincodes = useMemo(() => {
    const pinStats = {};

    rows.forEach((row) => {
      const pin = String(row.pin_code || row.pincode || row.Pin || '').trim();
      if (!pin) return;

      if (!pinStats[pin]) {
        pinStats[pin] = { total: 0, hot: 0, cold: 0 };
      }

      pinStats[pin].total += 1;
      if (row.lead_classification_status === 'Hot') pinStats[pin].hot += 1;
      if (row.lead_classification_status === 'Cold') pinStats[pin].cold += 1;
    });

    const aggregated = Object.keys(pinStats).map((pin) => ({
      pin,
      total: pinStats[pin].total,
      hot: pinStats[pin].hot,
      cold: pinStats[pin].cold,
      hotRatio: pinStats[pin].total ? pinStats[pin].hot / pinStats[pin].total : 0,
      coldRatio: pinStats[pin].total ? pinStats[pin].cold / pinStats[pin].total : 0
    }));

    const topHot = [...aggregated].sort((a, b) => b.hotRatio - a.hotRatio).slice(0, 5);
    const bottomCold = [...aggregated].sort((a, b) => b.coldRatio - a.coldRatio).slice(0, 5);

    return { top: topHot, bottom: bottomCold };
  }, [rows]);

  const renderLocationRow = (item, type) => {
    const isHot = type === 'hot';
    const mainColor = isHot ? 'var(--green-secondary)' : 'var(--red-alert)';
    const bgColor = isHot ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 82, 82, 0.1)';
    const pct = isHot ? (item.hotRatio * 100).toFixed(0) : (item.coldRatio * 100).toFixed(0);

    return (
      <div key={item.pin} className="callmap-location-row">
        <div>
          <div className="callmap-location-pin">Pincode: {item.pin}</div>
          <div className="callmap-location-meta">Total Volume: {item.total} calls</div>
        </div>
        <div className="callmap-location-right">
          <div className="callmap-location-rate">
            <span className="callmap-location-label">{isHot ? 'Conversion' : 'Loss'} Rate</span>
            <span style={{ fontWeight: 800, fontSize: '20px', color: mainColor }}>{pct}%</span>
          </div>
          <div className="callmap-location-icon" style={{ background: bgColor }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={mainColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="call-map-page">
      <section className="glass-card call-map-hero">
        <div className="call-map-hero-text">
          <h2 className="card-heading" style={{ fontSize: '20px', marginBottom: '6px' }}>Real-Time Call Origin Map (India)</h2>
          <p className="call-map-subtext">
            Leaflet view auto-refreshing from live CSV data for React + Vercel deployment.
          </p>
        </div>

        <div className="call-map-toolbar">
          <div className="call-map-live-status">
            <span className="live-dot callmap-live-dot"></span>
            <span className="callmap-live-label">
              {loading ? 'SYNCING' : 'LIVE'}
            </span>
            <span className="callmap-live-time">Synced {lastSyncTime.toLocaleTimeString()}</span>
          </div>

          <div className="call-map-controls">
            <label className="callmap-control-label" htmlFor="refresh-interval">Refresh</label>
            <select
              id="refresh-interval"
              className="callmap-refresh-select"
              value={refreshSeconds}
              onChange={(e) => setRefreshSeconds(Number(e.target.value))}
            >
              <option value={10}>10s</option>
              <option value={30}>30s</option>
              <option value={60}>60s</option>
            </select>
            <button type="button" className="callmap-refresh-now" onClick={handleManualRefresh}>
              Refresh Now
            </button>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="glass-card callmap-loading">Loading map layer...</div>}>
        <CallDensityMap rows={rows} />
      </Suspense>

      <section className="call-map-zones-grid">
        <div className="glass-card full-height call-map-zone-card">
          <h2 className="card-heading" style={{ marginBottom: '8px', fontSize: '18px', color: 'var(--green-secondary)' }}>Best Performing Areas</h2>
          <p className="callmap-zone-subhead">Highest ratio of Hot Leads relative to total call volume.</p>
          <div className="callmap-zones-list">
            {pincodes.top.map(item => renderLocationRow(item, 'hot'))}
          </div>
        </div>

        <div className="glass-card full-height call-map-zone-card">
          <h2 className="card-heading" style={{ marginBottom: '8px', fontSize: '18px', color: 'var(--orange-primary)' }}>Areas Needing Attention</h2>
          <p className="callmap-zone-subhead">Highest ratio of Cold Leads mapping to dead zones.</p>
          <div className="callmap-zones-list">
            {pincodes.bottom.map(item => renderLocationRow(item, 'cold'))}
          </div>
        </div>
      </section>

      <div className="call-map-footnote">Data source timestamp: {lastUpdated || 'n/a'}.</div>
    </div>
  );
}
