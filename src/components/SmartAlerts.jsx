import { useMemo } from "react";

export default function SmartAlerts({ rows = [] }) {
  const alerts = useMemo(() => {
    const generatedAlerts = [];

    // Count by model and status
    const modelStats = {};
    rows.forEach(row => {
      const model = row.model || "Unknown";
      if (!modelStats[model]) {
        modelStats[model] = { hot: 0, warm: 0, cold: 0, total: 0 };
      }
      modelStats[model].total++;
      const status = (row.lead_classification_status || "").toLowerCase();
      if (status === "hot") modelStats[model].hot++;
      else if (status === "warm") modelStats[model].warm++;
      else if (status === "cold") modelStats[model].cold++;
    });

    // Generate alerts based on patterns
    Object.entries(modelStats).forEach(([model, stats]) => {
      const coldRatio = stats.total > 0 ? (stats.cold / stats.total) * 100 : 0;
      const hotRatio = stats.total > 0 ? (stats.hot / stats.total) * 100 : 0;

      if (coldRatio > 60 && stats.total > 10) {
        generatedAlerts.push({
          type: "warning",
          icon: "⚠",
          message: `High cold leads in ${model} (${coldRatio.toFixed(0)}%)`,
          severity: "medium"
        });
      }

      if (hotRatio > 40 && stats.total > 10) {
        generatedAlerts.push({
          type: "success",
          icon: "🔥",
          message: `${model} hot leads spike (${stats.hot} leads)`,
          severity: "high"
        });
      }
    });

    // Check for conversion opportunities
    const testDriveLeads = rows.filter(r => 
      (r.qualifiers || "").toLowerCase().includes("test_drive")
    ).length;
    
    if (testDriveLeads > 20) {
      generatedAlerts.push({
        type: "info",
        icon: "🚀",
        message: `${testDriveLeads} test drive requests pending`,
        severity: "high"
      });
    }

    // Pincode concentration
    const pincodes = {};
    rows.forEach(row => {
      const pin = row.pin_code || "Unknown";
      pincodes[pin] = (pincodes[pin] || 0) + 1;
    });

    const topPincode = Object.entries(pincodes)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (topPincode && topPincode[1] > rows.length * 0.15) {
      generatedAlerts.push({
        type: "info",
        icon: "📍",
        message: `High activity in ${topPincode[0]} (${topPincode[1]} leads)`,
        severity: "medium"
      });
    }

    return generatedAlerts.slice(0, 5);
  }, [rows]);

  if (alerts.length === 0) {
    return (
      <div className="chart-card alerts-card">
        <h3>Smart Alerts</h3>
        <p className="muted">No alerts at this time</p>
      </div>
    );
  }

  return (
    <div className="chart-card alerts-card">
      <h3>Smart Alerts</h3>
      <p className="muted">AI-driven insights & notifications</p>
      
      <div className="alerts-list">
        {alerts.map((alert, idx) => (
          <div key={idx} className={`alert-item alert-${alert.type}`}>
            <span className="alert-icon">{alert.icon}</span>
            <span className="alert-message">{alert.message}</span>
            <span className={`alert-badge ${alert.severity}`}>
              {alert.severity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
