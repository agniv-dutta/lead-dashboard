import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
ChartJS.defaults.font.family = 'Urbanist';

export default function LeadVelocity() {
  const { data: velocityData = [] } = useQuery({
    queryKey: ['velocity'],
    queryFn: () => fetch('/api/leads/velocity?weeks=8').then(r => r.json())
  });

  const labels = velocityData.map((_, i) => `W${i+1}`); // Simplified week labels for mockup. In real scenario use actual W1, W2.
  const hotData = velocityData.map(d => d.Hot || 0);
  const warmData = velocityData.map(d => d.Warm || 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Hot Leads',
        data: hotData,
        borderColor: '#ff6d00',
        backgroundColor: 'rgba(255, 109, 0, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 2,
      },
      {
        label: 'Warm Leads',
        data: warmData,
        borderColor: '#00e676',
        backgroundColor: 'rgba(0, 230, 118, 0.05)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 2,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: { boxWidth: 10, usePointStyle: true, color: 'rgba(0, 200, 90, 0.35)' }
      }
    },
    scales: {
      x: {
        grid: { display: false, color: 'rgba(0, 200, 90, 0.04)' },
        ticks: { color: 'rgba(0, 200, 90, 0.35)', font: { size: 9 } }
      },
      y: {
        grid: { color: 'rgba(0, 200, 90, 0.04)' },
        ticks: { color: 'rgba(0, 200, 90, 0.35)', font: { size: 9 } },
        beginAtZero: true
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="card-heading" style={{ marginBottom: '8px' }}>Lead Velocity</div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px' }}>Hot vs Warm generation speed (Last 8 Weeks)</div>
      
      <div style={{ flex: 1, minHeight: '180px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
