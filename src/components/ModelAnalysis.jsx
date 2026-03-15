import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar } from 'react-chartjs-2';

export default function ModelAnalysis() {
  const { data: models = {} } = useQuery({
    queryKey: ['models'],
    queryFn: () => fetch('/api/leads/models').then(r => r.json())
  });

  const labels = Object.keys(models);
  const dataValues = Object.values(models);

  const data = {
    labels,
    datasets: [
      {
        label: 'Total Leads by Model',
        data: dataValues,
        backgroundColor: 'rgba(0, 230, 118, 0.2)',
        borderColor: '#00e676',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false, color: 'rgba(255,255,255,0.02)' }, ticks: { color: 'rgba(255,255,255,0.5)' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.5)' } }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="glass-card" style={{ flex: 1, minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
        <h2 className="card-heading" style={{ marginBottom: '16px', fontSize: '18px' }}>Volume Distribution across Tata Models</h2>
        <div style={{ flex: 1 }}>
          <Bar data={data} options={options} />
        </div>
      </div>
      
      <div className="row-4-grid">
         {labels.slice(0, 4).map(modelName => (
           <div key={modelName} className="glass-card">
              <div className="label-uppercase">{modelName}</div>
              <div className="kpi-value" style={{ marginTop: '8px', fontSize: '24px' }}>{models[modelName]}</div>
           </div>
         ))}
      </div>
    </div>
  );
}
