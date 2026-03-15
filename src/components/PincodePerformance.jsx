import React from 'react';
import { useQuery } from '@tanstack/react-query';

export default function PincodePerformance() {
  const { data = { top: [], bottom: [] } } = useQuery({
    queryKey: ['pincodes'],
    queryFn: () => fetch('/api/leads/pincodes').then(r => r.json())
  });

  const topRows = Array.isArray(data?.top) ? data.top : [];
  const bottomRows = Array.isArray(data?.bottom) ? data.bottom : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-heading" style={{ marginBottom: '16px' }}>Pincode Performance</div>
      
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        
        {/* Top Performers */}
        <div>
          <div className="label-uppercase" style={{ marginBottom: '12px' }}>Best Performing (Hot Leads)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topRows.map(p => (
              <PincodeRow key={p.pin} pin={p.pin} count={p.hot} total={p.total} color="var(--green-secondary)" />
            ))}
          </div>
        </div>

        <div style={{ height: '1px', background: 'var(--green-border-dim)', margin: '12px 0' }}></div>

        {/* Needs Attention */}
        <div>
          <div className="label-uppercase" style={{ marginBottom: '12px' }}>Needs Attention (Cold Ratio)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {bottomRows.map(p => (
              <PincodeRow key={p.pin} pin={p.pin} count={p.cold} total={p.total} color="var(--orange-primary)" />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function PincodeRow({ pin, count, total, color }) {
  const pct = Math.round((count / total) * 100) || 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px' }}>
      <div style={{ width: '45px', color: 'var(--text-secondary)' }}>{pin}</div>
      <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', margin: '0 10px' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '2px' }}></div>
      </div>
      <div style={{ width: '35px', textAlign: 'right', fontWeight: 600 }}>{count} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>/ {total}</span></div>
    </div>
  );
}
