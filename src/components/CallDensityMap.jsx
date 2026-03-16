import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { findStateFromPincode } from "../utils/pincodeStateMap";

const PIN_PREFIX_TO_STATE = {
  "11": "Delhi",
  "12": "Haryana",
  "13": "Haryana",
  "14": "Punjab",
  "15": "Punjab",
  "16": "Punjab",
  "17": "Himachal Pradesh",
  "18": "Jammu & Kashmir",
  "19": "Jammu & Kashmir",
  "20": "Uttar Pradesh",
  "21": "Uttar Pradesh",
  "22": "Uttar Pradesh",
  "23": "Uttar Pradesh",
  "24": "Uttar Pradesh",
  "25": "Uttar Pradesh",
  "26": "Uttarakhand",
  "27": "Maharashtra",
  "28": "Maharashtra",
  "30": "Gujarat",
  "31": "Gujarat",
  "32": "Gujarat",
  "33": "Gujarat",
  "34": "Rajasthan",
  "35": "Rajasthan",
  "36": "Gujarat",
  "37": "Gujarat",
  "38": "Gujarat",
  "39": "Gujarat",
  "40": "Maharashtra",
  "41": "Maharashtra",
  "42": "Maharashtra",
  "43": "Maharashtra",
  "44": "Maharashtra",
  "45": "Madhya Pradesh",
  "46": "Madhya Pradesh",
  "47": "Madhya Pradesh",
  "48": "Madhya Pradesh",
  "49": "Chhattisgarh",
  "50": "Telangana",
  "51": "Telangana",
  "52": "Andhra Pradesh",
  "53": "Andhra Pradesh",
  "54": "Andhra Pradesh",
  "55": "Andhra Pradesh",
  "56": "Karnataka",
  "57": "Karnataka",
  "58": "Karnataka",
  "59": "Karnataka",
  "60": "Tamil Nadu",
  "61": "Tamil Nadu",
  "62": "Tamil Nadu",
  "63": "Tamil Nadu",
  "64": "Tamil Nadu",
  "65": "Tamil Nadu",
  "66": "Tamil Nadu",
  "67": "Kerala",
  "68": "Kerala",
  "69": "Kerala",
  "70": "West Bengal",
  "71": "West Bengal",
  "72": "West Bengal",
  "73": "West Bengal",
  "74": "West Bengal",
  "75": "Odisha",
  "76": "Odisha",
  "77": "Odisha",
  "78": "Assam",
  "79": "Assam",
  "80": "Bihar",
  "81": "Bihar",
  "82": "Jharkhand",
  "83": "Jharkhand",
  "84": "Bihar",
  "85": "Jharkhand",
  "86": "Jharkhand",
  "87": "Bihar",
  "88": "Sikkim",
  "90": "Army",
  "91": "Army",
  "92": "Army",
  "93": "Army",
  "94": "Army",
  "95": "Army",
  "96": "Army",
  "97": "Army",
  "98": "Army",
  "99": "Army"
};

// Approximate centroids for states/UTs; enough for visualization on India basemap
const STATE_COORDS = {
  "Delhi": { lat: 28.61, lng: 77.21 },
  "Haryana": { lat: 29.06, lng: 76.09 },
  "Punjab": { lat: 31.15, lng: 75.34 },
  "Himachal Pradesh": { lat: 31.10, lng: 77.17 },
  "Jammu & Kashmir": { lat: 33.64, lng: 75.02 },
  "Uttar Pradesh": { lat: 26.85, lng: 80.91 },
  "Uttarakhand": { lat: 30.07, lng: 79.28 },
  "Rajasthan": { lat: 26.91, lng: 75.78 },
  "Gujarat": { lat: 22.30, lng: 70.80 },
  "Maharashtra": { lat: 19.75, lng: 75.71 },
  "Madhya Pradesh": { lat: 22.97, lng: 78.65 },
  "Chhattisgarh": { lat: 21.27, lng: 81.60 },
  "Telangana": { lat: 17.87, lng: 79.08 },
  "Andhra Pradesh": { lat: 15.91, lng: 79.74 },
  "Karnataka": { lat: 15.31, lng: 75.71 },
  "Kerala": { lat: 10.85, lng: 76.27 },
  "Tamil Nadu": { lat: 11.12, lng: 78.66 },
  "Odisha": { lat: 20.95, lng: 85.10 },
  "West Bengal": { lat: 22.99, lng: 87.86 },
  "Assam": { lat: 26.20, lng: 92.93 },
  "Bihar": { lat: 25.09, lng: 85.31 },
  "Jharkhand": { lat: 23.61, lng: 85.28 },
  "Sikkim": { lat: 27.53, lng: 88.51 },
  "Goa": { lat: 15.29, lng: 74.12 },
  "Tripura": { lat: 23.84, lng: 91.28 },
  "Meghalaya": { lat: 25.46, lng: 91.36 },
  "Manipur": { lat: 24.66, lng: 93.91 },
  "Nagaland": { lat: 26.16, lng: 94.56 },
  "Mizoram": { lat: 23.16, lng: 92.94 },
  "Arunachal Pradesh": { lat: 27.06, lng: 93.61 },
  "Puducherry": { lat: 11.94, lng: 79.83 },
  "Chandigarh": { lat: 30.74, lng: 76.79 },
  "Army": { lat: 32.0, lng: 77.0 }
};

function pincodeToState(pinRaw) {
  const pin = String(pinRaw || "").trim();
  if (!pin || pin.length < 2) return null;
  if (pin.length >= 6) {
    const rangeState = findStateFromPincode(pin);
    if (rangeState && STATE_COORDS[rangeState]) return rangeState;
  }
  const prefix = pin.slice(0, 2);
  return PIN_PREFIX_TO_STATE[prefix] || null;
}

function resolveState(row) {
  const direct = (row.state || row.State || row.region || "").trim();
  if (direct && STATE_COORDS[direct]) return direct;
  return pincodeToState(row.pin_code || row.Pin || row.pincode);
}

function colorFromHotRatio(ratio) {
  const safe = Math.max(0, Math.min(100, ratio || 0));
  const hue = 10 + (safe / 100) * 150; // warm to teal
  return `hsl(${hue}, 75%, 55%)`;
}

export default function CallDensityMap({ rows = [] }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const [mapError, setMapError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const resizeTimerRef = useRef(null);

  const { stateStats, topStates, maxTotal } = useMemo(() => {
    const totals = {};

    rows.forEach(row => {
      const state = resolveState(row);
      if (!state || !STATE_COORDS[state]) return;

      if (!totals[state]) {
        totals[state] = { total: 0, hot: 0, warm: 0, cold: 0 };
      }

      totals[state].total++;
      const status = (row.lead_classification_status || "").toLowerCase();
      if (status === "hot") totals[state].hot++;
      else if (status === "warm") totals[state].warm++;
      else if (status === "cold") totals[state].cold++;
    });

    const enriched = Object.entries(totals).map(([state, stats]) => {
      const hotRatio = stats.total ? (stats.hot / stats.total) * 100 : 0;
      return { state, hotRatio, ...stats };
    });

    const sorted = [...enriched].sort((a, b) => b.total - a.total);
    const maxVal = enriched.length ? Math.max(...enriched.map(s => s.total)) : 0;

    return {
      stateStats: enriched,
      topStates: sorted.slice(0, 5),
      maxTotal: maxVal
    };
  }, [rows]);

  const pulseStates = useMemo(
    () => new Set([...stateStats].sort((a, b) => b.total - a.total).slice(0, 8).map(item => item.state)),
    [stateStats]
  );

  // Detect when component becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.01 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Initialize map once when visible (with StrictMode-safe cleanup)
  useLayoutEffect(() => {
    if (!isVisible) return;
    
    const container = containerRef.current;
    if (!container) return;

    // If React StrictMode remounts, detach stale map from old DOM and rebuild
    if (mapRef.current && mapRef.current._container !== container) {
      mapRef.current.remove();
      mapRef.current = null;
      layerRef.current = null;
    }

    if (mapRef.current) return;

    const mountMap = () => {
      try {
        const map = L.map(container, {
          zoomControl: true,
          attributionControl: true
        }).setView([22.5, 79], 5);

        // Try primary OSM tiles; fall back if they error (common on corporate firewalls)
        const primary = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution: "© OpenStreetMap contributors"
        });

        const fallback = L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution: "© OpenStreetMap contributors, OSM France"
        });

        const carto = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
          maxZoom: 18,
          attribution: "© OpenStreetMap contributors, © CARTO"
        });

        primary.on("tileerror", () => {
          if (!map.hasLayer(fallback)) {
            primary.remove();
            fallback.addTo(map);
            setMapError(null);
          }
        });

        fallback.on("tileerror", () => {
          if (!map.hasLayer(carto)) {
            fallback.remove();
            carto.addTo(map);
            setMapError(null);
          } else {
            setMapError("Map tiles blocked. Check VPN/firewall.");
          }
        });

        primary.on("load", () => setMapError(null));
        fallback.on("load", () => setMapError(null));
        carto.on("load", () => setMapError(null));

        primary.addTo(map);

        layerRef.current = L.layerGroup().addTo(map);
        mapRef.current = map;

        // Resize once the tab finishes laying out so tiles render instead of a blank area
        setTimeout(() => map.invalidateSize(), 150);
      } catch (err) {
        console.error("Map init failed", err);
        setMapError("Unable to load map. Check network and refresh.");
      }
    };

    // Wait a frame if the container has no size yet (can happen on tab switches)
    if (container.clientWidth === 0 || container.clientHeight === 0) {
      requestAnimationFrame(mountMap);
    } else {
      mountMap();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        layerRef.current = null;
      }
    };
  }, [isVisible]);

  // Make sure tiles resize if layout changes after data load
  useEffect(() => {
    if (mapRef.current && isVisible) {
      setTimeout(() => mapRef.current.invalidateSize(), 50);
    }
  }, [maxTotal, isVisible]);

  // Also resize on window resizes (debounced)
  useEffect(() => {
    const handleResize = () => {
      if (!mapRef.current) return;
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(() => {
        mapRef.current && mapRef.current.invalidateSize();
      }, 80);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
    };
  }, []);

  // Update circles when data changes
  useEffect(() => {
    if (!mapRef.current || !layerRef.current) return;
    layerRef.current.clearLayers();
    if (!maxTotal) return;

    stateStats.forEach((item, idx) => {
      const coords = STATE_COORDS[item.state];
      if (!coords) return;
      const radius = 6 + (item.total / maxTotal) * 18;
      const color = colorFromHotRatio(item.hotRatio);

      const circle = L.circleMarker([coords.lat, coords.lng], {
        radius,
        color,
        fillColor: color,
        fillOpacity: 0.85,
        weight: 1,
        className: "map-live-circle"
      });

      circle.bindTooltip(
        `<div class="map-tt"><strong>${item.state}</strong><br/>${item.total} calls · ${item.hotRatio.toFixed(0)}% hot<br/><span class="map-tt-split">${item.hot} hot • ${item.warm} warm • ${item.cold} cold</span></div>`,
        { direction: "top", opacity: 0.9, offset: [0, -2] }
      );

      circle.addTo(layerRef.current);

      if (pulseStates.has(item.state)) {
        const pulse = L.marker([coords.lat, coords.lng], {
          icon: L.divIcon({
            className: "map-pulse-wrapper",
            html: `<span class="map-pulse-ring" style="animation-delay:${(idx % 6) * 0.2}s"></span><span class="map-pulse-core"></span>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          }),
          interactive: false,
          zIndexOffset: 1000
        });

        pulse.addTo(layerRef.current);
      }
    });
  }, [stateStats, maxTotal, pulseStates]);

  return (
    <div className="chart-card map-card">
      <div className="map-card-header">
        <div>
          <h3>Call Density Map</h3>
          <p className="muted">Real basemap with call bubbles sized by volume, colored by hot ratio, and live pulse markers on top states.</p>
        </div>
        <div className="map-legend">
          <span className="legend-dot legend-hot" /> Hotter
          <span className="legend-dot legend-cool" /> Cooler
        </div>
      </div>

      <div
        className="leaflet-map-shell"
        ref={containerRef}
        aria-label="Call density map"
        style={{ minHeight: 320, display: "block" }}
      >
        {mapError && <div className="muted" style={{ padding: 12 }}>{mapError}</div>}
      </div>

      <div className="map-list">
        <div>
          <h4 className="map-list-title">Top States by Calls</h4>
          {topStates.length === 0 && <p className="muted">No pincode data yet.</p>}
          {topStates.map(item => {
            const barWidth = maxTotal ? Math.max(8, (item.total / maxTotal) * 100) : 0;
            const color = colorFromHotRatio(item.hotRatio);
            return (
              <div key={item.state} className="map-row">
                <div className="map-row-label">
                  <span>{item.state}</span>
                  <span className="map-row-count">{item.total} calls</span>
                </div>
                <div className="map-row-bar">
                  <div className="map-row-fill" style={{ width: `${barWidth}%`, background: color }} />
                </div>
                <div className="map-row-metrics">
                  <span className="metric-hot">{item.hotRatio.toFixed(0)}% hot</span>
                  <span className="metric-warm">{item.warm} warm</span>
                  <span className="metric-cold">{item.cold} cold</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
