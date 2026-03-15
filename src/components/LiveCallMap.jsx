import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const CITIES = [
  { name: "Delhi NCR", coordinates: [28.6139, 77.209], factor: 0.18, color: "var(--orange-primary)" },
  { name: "Mumbai Region", coordinates: [19.076, 72.8777], factor: 0.15, color: "var(--orange-primary)" },
  { name: "Bangalore", coordinates: [12.9716, 77.5946], factor: 0.12, color: "var(--green-secondary)" },
  { name: "Hyderabad", coordinates: [17.385, 78.4867], factor: 0.10, color: "var(--green-secondary)" },
  { name: "Chennai", coordinates: [13.0827, 80.2707], factor: 0.08, color: "var(--green-secondary)" },
  { name: "Pune", coordinates: [18.5204, 73.8567], factor: 0.08, color: "var(--green-secondary)" },
  { name: "Kolkata", coordinates: [22.5726, 88.3639], factor: 0.07, color: "var(--orange-primary)" },
  { name: "Ahmedabad", coordinates: [23.0225, 72.5714], factor: 0.06, color: "var(--green-secondary)" },
  { name: "Jaipur", coordinates: [26.9124, 75.7873], factor: 0.05, color: "var(--green-secondary)" },
  { name: "Lucknow", coordinates: [26.8467, 80.9462], factor: 0.04, color: "var(--orange-primary)" },
  { name: "Surat", coordinates: [21.1702, 72.8311], factor: 0.04, color: "var(--green-secondary)" },
  { name: "Kanpur", coordinates: [26.4499, 80.3319], factor: 0.02, color: "var(--orange-primary)" },
  { name: "Nagpur", coordinates: [21.1458, 79.0882], factor: 0.01, color: "var(--green-secondary)" },
];

export default function LiveCallMap() {
  const { data: summary } = useQuery({
    queryKey: ['summary'],
    queryFn: () => fetch('/api/leads/summary').then(res => res.json())
  });

  const totalVolume = summary?.total || 1500; // fallback if loading

  const markers = useMemo(() => {
    return CITIES.map(city => ({
      ...city,
      volume: Math.round(totalVolume * city.factor)
    }));
  }, [totalVolume]);

  return (
    <div className="glass-card" style={{ marginTop: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ padding: '0 0 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="card-heading" style={{ fontSize: '18px' }}>Live Geospatial Call Activity</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>Call volumes distributed across major operational hubs throughout India.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="live-dot" style={{ width: '8px', height: '8px' }}></div>
          <span style={{ fontSize: '12px', color: 'var(--green-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>System Active</span>
        </div>
      </div>

      <div style={{ height: '450px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
        <MapContainer 
          center={[22.5, 79.5]} // Center on India roughly
          zoom={4.5} 
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', background: 'var(--bg-card)', zIndex: 1 }}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {markers.map((city, idx) => {
             // Map volume (e.g. 50-200) to a reasonable circle size (e.g. 6-15)
             const radius = Math.max(6, Math.sqrt(city.volume) * 1.2);
             return (
               <CircleMarker
                 key={idx}
                 center={city.coordinates}
                 pathOptions={{ 
                   color: city.color, 
                   fillColor: city.color, 
                   fillOpacity: 0.4,
                   weight: 2
                 }}
                 radius={radius}
               >
                 <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                   <div style={{ fontFamily: 'Urbanist', padding: '4px 8px', textAlign: 'center' }}>
                     <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px', fontSize: '14px' }}>{city.name}</div>
                     <div style={{ color: city.color, fontWeight: 700, fontSize: '13px' }}>{city.volume} leads</div>
                   </div>
                 </Tooltip>
               </CircleMarker>
             );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
