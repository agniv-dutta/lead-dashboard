import React from 'react';

export default function AIImpact() {
  // Static stats for AI Impact per brief: 22% | 65% | 3x
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-heading" style={{ marginBottom: '16px' }}>AI Impact</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', flex: 1 }}>
        
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '9px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ color: '#ff7043', fontSize: '24px', fontWeight: 800, letterSpacing: '-1px' }}>22%</div>
          <div style={{ fontSize: '7px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-labels)', marginTop: '4px', textAlign: 'center' }}>Conversion<br/>Improvement</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '9px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ color: '#00e676', fontSize: '24px', fontWeight: 800, letterSpacing: '-1px' }}>65%</div>
          <div style={{ fontSize: '7px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-labels)', marginTop: '4px', textAlign: 'center' }}>Response<br/>Time</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '9px', padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ color: '#00bfa5', fontSize: '24px', fontWeight: 800, letterSpacing: '-1px' }}>3×</div>
          <div style={{ fontSize: '7px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-labels)', marginTop: '4px', textAlign: 'center' }}>Prioritization<br/>Index</div>
        </div>

      </div>
    </div>
  );
}
