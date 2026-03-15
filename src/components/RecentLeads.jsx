import React from 'react';
import { useQuery } from '@tanstack/react-query';

export default function RecentLeads() {
  const { data: leads = [] } = useQuery({
    queryKey: ['recent-leads'],
    queryFn: () => fetch('/api/leads/recent?limit=7').then(r => r.json())
  });

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'hot': return { bg: 'var(--orange-dim)', color: 'var(--orange-primary)' };
      case 'warm': return { bg: 'var(--green-dim)', color: 'var(--green-secondary)' };
      case 'cold': return { bg: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' };
      default: return { bg: 'transparent', color: 'var(--text-primary)' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-heading" style={{ marginBottom: '16px' }}>Recent Leads</div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-labels)' }}>
              <th style={{ padding: '8px 4px', fontWeight: 600, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Customer</th>
              <th style={{ padding: '8px 4px', fontWeight: 600, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Model</th>
              <th style={{ padding: '8px 4px', fontWeight: 600, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Stage</th>
              <th style={{ padding: '8px 4px', fontWeight: 600, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Status</th>
              <th style={{ padding: '8px 4px', fontWeight: 600, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l, i) => {
              const { bg, color } = getStatusColor(l.lead_classification_status);
              const dateObj = new Date(l.created_at);
              const timeStr = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
              const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

              return (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '12px 4px', fontWeight: 600 }}>{l.customer_name || 'N/A'}</td>
                  <td style={{ padding: '12px 4px', color: 'var(--text-secondary)' }}>{l.model}</td>
                  <td style={{ padding: '12px 4px', color: 'var(--text-secondary)' }}>{l.updated_sales_stage}</td>
                  <td style={{ padding: '12px 4px' }}>
                    <span style={{ 
                      background: bg, 
                      color: color, 
                      padding: '4px 8px', 
                      borderRadius: '6px', 
                      fontSize: '11px', 
                      fontWeight: 700 
                    }}>
                      {l.lead_classification_status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <div>{dateStr}</div>
                    <div>{timeStr}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
