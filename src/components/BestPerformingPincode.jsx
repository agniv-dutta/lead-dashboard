import { useMemo } from "react";

export default function BestPerformingPincode({ rows = [] }) {
  const pincodeStats = useMemo(() => {
    const pincodeMap = {};

    rows.forEach(row => {
      const pin = row.pin_code || "Unknown";
      if (!pincodeMap[pin]) {
        pincodeMap[pin] = { total: 0, hot: 0, warm: 0, cold: 0 };
      }
      pincodeMap[pin].total++;
      
      const status = (row.lead_classification_status || "").toLowerCase();
      if (status === "hot") pincodeMap[pin].hot++;
      else if (status === "warm") pincodeMap[pin].warm++;
      else if (status === "cold") pincodeMap[pin].cold++;
    });

    const pincodes = Object.entries(pincodeMap)
      .filter(([pin, stats]) => pin !== "Unknown" && stats.total >= 5)
      .map(([pin, stats]) => ({
        pin,
        ...stats,
        hotRatio: (stats.hot / stats.total) * 100,
        coldRatio: (stats.cold / stats.total) * 100
      }));

    const best = pincodes.sort((a, b) => b.hotRatio - a.hotRatio).slice(0, 3);
    const worst = pincodes.sort((a, b) => b.coldRatio - a.coldRatio).slice(0, 3);

    return { best, worst };
  }, [rows]);

  return (
    <div className="chart-card pincode-card">
      <h3>Pincode Performance</h3>
      <p className="muted">Best & worst converting regions</p>
      
      <div className="pincode-grid">
        <div className="pincode-section">
          <h4 className="pincode-title">🏆 Best Performing</h4>
          <div className="pincode-list">
            {pincodeStats.best.map((item, idx) => (
              <div key={idx} className="pincode-item best">
                <div className="pincode-info">
                  <span className="pincode-number">{item.pin}</span>
                  <span className="pincode-count">{item.total} leads</span>
                </div>
                <div className="pincode-metrics">
                  <span className="metric-hot">{item.hotRatio.toFixed(0)}% hot</span>
                </div>
              </div>
            ))}
            {pincodeStats.best.length === 0 && (
              <p className="muted">Not enough data</p>
            )}
          </div>
        </div>

        <div className="pincode-section">
          <h4 className="pincode-title">⚠ Needs Attention</h4>
          <div className="pincode-list">
            {pincodeStats.worst.map((item, idx) => (
              <div key={idx} className="pincode-item worst">
                <div className="pincode-info">
                  <span className="pincode-number">{item.pin}</span>
                  <span className="pincode-count">{item.total} leads</span>
                </div>
                <div className="pincode-metrics">
                  <span className="metric-cold">{item.coldRatio.toFixed(0)}% cold</span>
                </div>
              </div>
            ))}
            {pincodeStats.worst.length === 0 && (
              <p className="muted">Not enough data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
