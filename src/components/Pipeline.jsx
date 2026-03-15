import React from 'react';
import { useQuery } from '@tanstack/react-query';

export default function Pipeline() {
  const { data: funnel = {} } = useQuery({
    queryKey: ['funnel'],
    queryFn: () => fetch('/api/leads/funnel').then(r => r.json())
  });

  const stages = [
    { label: '02 Open Green Form', color: '#ff6d00' },
    { label: 'Test Drive', color: '#aeea00' },
    { label: 'Booking Done', color: '#00e676' },
    { label: 'Retailed', color: '#00bfa5' }
  ];

  const maxValue = Math.max(...Object.values(funnel), 1);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="glass-card">
        <h2 className="card-heading" style={{ marginBottom: '24px', fontSize: '18px' }}>Sales Pipeline Conversion</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {stages.map((stage, idx) => {
            const val = funnel[stage.label] || 0;
            const pct = Math.round((val / maxValue) * 100);
            return (
              <div key={stage.label} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span style={{ fontWeight: 600 }}>{idx + 1}. {stage.label.replace('02 ', '')}</span>
                  <span style={{ fontWeight: 800 }}>{val}</span>
                </div>
                <div style={{ height: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${pct}%`, 
                    background: stage.color,
                    boxShadow: `0 0 12px ${stage.color}`,
                    borderRadius: '12px',
                    transition: 'width 1s ease-out'
                  }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
