import React from 'react';
import { useQuery } from '@tanstack/react-query';

export default function StageHealth() {
  const { data: stages = {} } = useQuery({
    queryKey: ['funnel'],
    queryFn: () => fetch('/api/leads/funnel').then(r => r.json())
  });

  const { data: summary = {} } = useQuery({
    queryKey: ['summary'],
    queryFn: () => fetch('/api/leads/summary').then(r => r.json())
  });

  const total = summary.total || 1;

  const getPct = (val) => Math.round(((val || 0) / total) * 100);

  const rows = [
    { label: 'Open Green Form', count: stages['02 Open Green Form'], color: 'var(--green-primary)' },
    { label: 'Booking', count: stages['Booking Done'], color: 'var(--orange-primary)' },
    { label: 'Test Drive', count: stages['Test Drive'], color: 'var(--lime-accent)' },
    { label: 'Retailed', count: stages['Retailed'], color: 'var(--teal-accent)' },
    { label: 'Lost', count: stages['Lost'], color: 'var(--red-alert)' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-heading" style={{ marginBottom: '16px' }}>Stage Health</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, justifyContent: 'center' }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ fontWeight: 300, color: 'var(--text-secondary)' }}>{r.label}</span>
              <span style={{ fontWeight: 700 }}>{r.count || 0}</span>
            </div>
            <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${getPct(r.count)}%`, background: r.color, borderRadius: '2px' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
