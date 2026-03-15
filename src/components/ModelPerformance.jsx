import React from 'react';
import { useQuery } from '@tanstack/react-query';

export default function ModelPerformance() {
  const { data: models = {} } = useQuery({
    queryKey: ['models'],
    queryFn: () => fetch('/api/leads/models').then(r => r.json())
  });

  const modelKeys = Object.keys(models);
  const maxModelCount = Math.max(...Object.values(models), 1); // Avoid div by 0

  const colorMap = {
    'Punch': '#ff6d00',
    'Nexon': '#00e676',
    'Harrier': '#aeea00',
    'Safari': '#00bfa5',
    'Tiago': 'var(--text-muted)'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-heading" style={{ marginBottom: '16px' }}>Model Performance</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'center' }}>
        {['Punch', 'Nexon', 'Harrier', 'Safari', 'Tiago'].map(m => {
          const count = models[m] || 0;
          const pct = Math.round((count / maxModelCount) * 100);
          const color = colorMap[m] || 'var(--green-muted)';
          
          return (
            <div key={m} style={{ display: 'flex', alignItems: 'center', fontSize: '11px' }}>
              <div style={{ width: '60px', color: 'var(--text-secondary)' }}>{m}</div>
              <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', margin: '0 12px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '3px' }}></div>
              </div>
              <div style={{ width: '30px', textAlign: 'right', fontWeight: 600 }}>{count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
