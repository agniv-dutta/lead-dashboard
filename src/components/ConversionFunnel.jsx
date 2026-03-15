import { useMemo } from "react";

export default function ConversionFunnel({ rows = [] }) {
  const funnelData = useMemo(() => {
    const stages = {
      "Total Calls": rows.length,
      "Interested": rows.filter(r => 
        ["hot", "warm"].includes((r.lead_classification_status || "").toLowerCase())
      ).length,
      "Test Drive": rows.filter(r => 
        (r.updated_sales_stage || "").toLowerCase().includes("test drive") ||
        (r.qualifiers || "").toLowerCase().includes("test_drive")
      ).length,
      "Booking": rows.filter(r => 
        (r.booking_date || r.updated_sales_stage || "").toLowerCase().includes("booking") ||
        (r.updated_sales_stage || "").toLowerCase().includes("green form")
      ).length,
      "Delivery": rows.filter(r => 
        r.retail_date || (r.updated_sales_stage || "").toLowerCase().includes("retail")
      ).length
    };

    const maxValue = stages["Total Calls"] || 1;
    
    const entries = Object.entries(stages);

    return entries.map(([stage, count], idx) => {
      const prevCount = idx > 0 ? entries[idx - 1][1] : maxValue;
      const safePrev = prevCount > 0 ? prevCount : 1; // avoid division by zero
      const conv = Math.min(100, (count / safePrev) * 100);

      return {
        stage,
        count,
        percentage: Number(((count / maxValue) * 100).toFixed(1)),
        width: Number(((count / maxValue) * 100).toFixed(1)),
        conversionRate: Number(conv.toFixed(1))
      };
    });
  }, [rows]);

  return (
    <div className="chart-card funnel-card">
      <h3>Conversion Funnel</h3>
      <p className="muted">Sales pipeline drop-off analysis</p>
      
      <div className="funnel-container">
        {funnelData.map((stage, idx) => {
          const displayWidth = Math.max(stage.width, 6); // keep tiny stages visible
          return (
            <div key={idx} className="funnel-stage">
              <div className="funnel-stage-row">
                <div className="funnel-labels">
                  <span className="funnel-stage-name">{stage.stage}</span>
                  <span className="funnel-count">{stage.count}</span>
                </div>
                <div className="funnel-bar-wrapper">
                  <div
                    className={`funnel-bar funnel-stage-${idx}`}
                    style={{ width: `${displayWidth}%` }}
                    aria-label={`${stage.stage}: ${stage.percentage}% of total`}
                  />
                  <div className="funnel-metrics">
                    <span className="funnel-percentage">{stage.percentage}%</span>
                    {idx > 0 && (
                      <span className="funnel-conversion">
                        {stage.conversionRate}% from previous stage
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
