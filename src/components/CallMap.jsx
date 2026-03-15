import React from 'react';
import { useQuery } from '@tanstack/react-query';

export default function CallMap() {
  const { data: pincodes = { top: [], bottom: [] } } = useQuery({
    queryKey: ['pincodes'],
    queryFn: () => fetch('/api/leads/pincodes').then(r => r.json())
  });

  const renderLocationRow = (item, type) => {
    const isHot = type === 'hot';
    const mainColor = isHot ? 'var(--green-secondary)' : 'var(--red-alert)';
    const bgColor = isHot ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 82, 82, 0.1)';
    const pct = isHot ? (item.hotRatio * 100).toFixed(0) : (item.coldRatio * 100).toFixed(0);

    return (
      <div key={item.pin} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', marginBottom: '12px', border: '1px solid var(--glass-border)' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '18px', color: 'var(--text-primary)' }}>Pincode: {item.pin}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Total Volume: {item.total} calls</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{isHot ? 'Conversion' : 'Loss'} Rate</span>
            <span style={{ fontWeight: 800, fontSize: '20px', color: mainColor }}>{pct}%</span>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={mainColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="row-4-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="glass-card full-height">
          <h2 className="card-heading" style={{ marginBottom: '8px', fontSize: '18px', color: 'var(--green-secondary)' }}>Best Performing Areas</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '24px' }}>Highest ratio of Hot Leads relative to total call volume.</p>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {pincodes.top.map(item => renderLocationRow(item, 'hot'))}
          </div>
        </div>

        <div className="glass-card full-height">
          <h2 className="card-heading" style={{ marginBottom: '8px', fontSize: '18px', color: 'var(--orange-primary)' }}>Areas Needing Attention</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '24px' }}>Highest ratio of Cold Leads mapping to dead zones.</p>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            {pincodes.bottom.map(item => renderLocationRow(item, 'cold'))}
          </div>
        </div>
      </div>

    </div>
  );
}
