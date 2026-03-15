import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
ChartJS.defaults.font.family = 'Urbanist';

export default function LeadTrendChart() {
  const [period, setPeriod] = useState('monthly'); // 'monthly' or 'quarterly'

  const { data: trendData = {} } = useQuery({
    queryKey: ['trend', period],
    queryFn: () => fetch(`/api/leads/trend?period=${period}`).then(r => r.json())
  });

  const labels = Object.keys(trendData).sort(); // Depending on format we might need sorting
  const hotData = labels.map(l => trendData[l]?.Hot || 0);
  const warmData = labels.map(l => trendData[l]?.Warm || 0);
  const coldData = labels.map(l => trendData[l]?.Cold || 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Hot',
        data: hotData,
        backgroundColor: 'rgba(255, 109, 0, 0.72)',
        borderRadius: 3,
        borderSkipped: false
      },
      {
        label: 'Warm',
        data: warmData,
        backgroundColor: 'rgba(174, 234, 0, 0.55)',
        borderRadius: 3,
        borderSkipped: false
      },
      {
        label: 'Cold',
        data: coldData,
        backgroundColor: 'rgba(0, 191, 165, 0.45)',
        borderRadius: 3,
        borderSkipped: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: 'rgba(0, 200, 90, 0.35)' }
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: 'rgba(0, 200, 90, 0.35)',
          font: { size: 8 },
          autoSkip: false
        },
        grid: { color: 'rgba(0, 200, 90, 0.04)' }
      },
      y: {
        stacked: true,
        ticks: { color: 'rgba(0, 200, 90, 0.35)', font: { size: 8 } },
        grid: { color: 'rgba(0, 200, 90, 0.04)' }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div className="card-heading">Lead Trend & Conversion</div>
        <select 
          className="period-toggles"
          value={period} 
          onChange={(e) => setPeriod(e.target.value)}
          style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', borderRadius: '6px', fontSize: '11px', padding: '2px 6px', fontFamily: 'Urbanist' }}>
          <option value="monthly" style={{ background: '#000' }}>Monthly</option>
          <option value="quarterly" style={{ background: '#000' }}>Quarterly</option>
        </select>
      </div>
      <div style={{ flex: 1, minHeight: '180px' }}>
        <Bar data={data} options={options} />
      </div>
      <PipelineFunnel />
    </div>
  );
}

function PipelineFunnel() {
  const { data: stages = {} } = useQuery({
    queryKey: ['funnel'],
    queryFn: () => fetch('/api/leads/funnel').then(r => r.json())
  });

  const { data: summary = {} } = useQuery({
    queryKey: ['summary'],
    queryFn: () => fetch('/api/leads/summary').then(r => r.json())
  });

  const total = summary.total || 1;
  const interested = stages['02 Open Green Form'] || 0;
  const testDrive = stages['Test Drive'] || 0;
  const booking = stages['Booking Done'] || 0;
  const retailed = stages['Retailed'] || 0;

  const rowData = [
    { label: 'Total Calls', count: summary.total || 0, color: 'var(--text-muted)' },
    { label: 'Interested', count: interested, color: 'var(--green-secondary)' },
    { label: 'Test Drive', count: testDrive, color: 'var(--lime-accent)' },
    { label: 'Booking', count: booking, color: 'var(--orange-secondary)' },
    { label: 'Retailed', count: retailed, color: 'var(--teal-accent)' }
  ];

  return (
    <div className="funnel-container" style={{ marginTop: '24px' }}>
      {rowData.map((row, i) => {
        const pct = Math.round((row.count / total) * 100) || 0;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontSize: '11px' }}>
            <div style={{ width: '88px', color: 'var(--text-secondary)' }}>{row.label}</div>
            <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', margin: '0 12px' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: row.color, borderRadius: '2px' }}></div>
            </div>
            <div style={{ width: '40px', fontWeight: 600 }}>{row.count}</div>
            <div style={{ width: '30px', textAlign: 'right', color: 'var(--text-muted)' }}>{pct}%</div>
          </div>
        )
      })}
    </div>
  );
}
