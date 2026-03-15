import { useMemo } from "react";

export default function SalesStageHeatmap({ rows = [] }) {
  const heatmapData = useMemo(() => {
    const models = ["Curvv", "Punch", "Nexon", "Harrier", "Safari", "Tiago"];
    const stages = ["Inquiry", "Test Drive", "Booking", "Delivery"];

    const matrix = models.map(model => {
      const modelRows = rows.filter(r => 
        (r.model || "").toLowerCase() === model.toLowerCase()
      );

      return {
        model,
        stages: stages.map(stage => {
          let count = 0;
          
          if (stage === "Inquiry") {
            count = modelRows.length;
          } else if (stage === "Test Drive") {
            count = modelRows.filter(r => 
              (r.qualifiers || "").toLowerCase().includes("test_drive") ||
              (r.updated_sales_stage || "").toLowerCase().includes("test drive")
            ).length;
          } else if (stage === "Booking") {
            count = modelRows.filter(r => 
              r.booking_date || 
              (r.updated_sales_stage || "").toLowerCase().includes("booking") ||
              (r.updated_sales_stage || "").toLowerCase().includes("green form")
            ).length;
          } else if (stage === "Delivery") {
            count = modelRows.filter(r => 
              r.retail_date || 
              (r.updated_sales_stage || "").toLowerCase().includes("retail")
            ).length;
          }

          return count;
        })
      };
    });

    const maxValue = Math.max(
      ...matrix.flatMap(m => m.stages),
      1
    );

    return { matrix, stages, maxValue };
  }, [rows]);

  const getHeatColor = (value, max) => {
    const intensity = max > 0 ? value / max : 0;
    
    if (intensity > 0.7) return "heat-5";
    if (intensity > 0.5) return "heat-4";
    if (intensity > 0.3) return "heat-3";
    if (intensity > 0.1) return "heat-2";
    return "heat-1";
  };

  return (
    <div className="chart-card heatmap-card">
      <h3>Sales Stage Heatmap</h3>
      <p className="muted">Model × Stage activity matrix</p>
      
      <div className="heatmap-container">
        <div className="heatmap-grid">
          <div className="heatmap-header">
            <div className="heatmap-cell corner"></div>
            {heatmapData.stages.map((stage, idx) => (
              <div key={idx} className="heatmap-cell header-cell">
                {stage}
              </div>
            ))}
          </div>
          
          {heatmapData.matrix.map((row, rowIdx) => (
            <div key={rowIdx} className="heatmap-row">
              <div className="heatmap-cell row-header">
                {row.model}
              </div>
              {row.stages.map((value, colIdx) => (
                <div 
                  key={colIdx} 
                  className={`heatmap-cell ${getHeatColor(value, heatmapData.maxValue)}`}
                  title={`${row.model} - ${heatmapData.stages[colIdx]}: ${value}`}
                >
                  {value}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
