import React from 'react';
import { useQuery } from '@tanstack/react-query';

export default function AlertsModule() {
  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => fetch('/api/leads/alerts').then(r => r.json())
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 className="card-heading" style={{ fontSize: '20px', color: 'var(--orange-primary)' }}>System Alerts</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>Showing active high-priority flags requiring immediate Lead Ops intervention.</p>
          </div>
          <div style={{ background: 'var(--orange-dim)', color: 'var(--orange-secondary)', padding: '8px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '12px' }}>
            {alerts.length} Pending
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {alerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>All clear. No urgent alerts.</div>
          ) : (
            alerts.map((alert, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '20px', 
                background: 'rgba(255, 109, 0, 0.05)', 
                border: '1px solid rgba(255, 109, 0, 0.2)', 
                borderRadius: '12px',
                borderLeft: '4px solid var(--orange-primary)'
              }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--text-primary)', marginBottom: '4px' }}>{alert.message}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                    <span style={{ fontWeight: 600 }}>Customer:</span> {alert.customer || 'N/A'} &nbsp;|&nbsp; 
                    <span style={{ fontWeight: 600 }}> Phone:</span> {alert.phone || 'N/A'}
                  </div>
                </div>
                <button className="btn-assign" style={{ padding: '10px 20px' }}>Take Action</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
