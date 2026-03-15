import { useMemo, useState } from "react";

export default function LeadTrend({ rows = [] }) {
  const [period, setPeriod] = useState("weekly");

  const periodDays = {
    weekly: 7,
    monthly: 30,
    yearly: 365
  };

  const trendData = useMemo(() => {
    const dateMap = {};
    
    rows.forEach(row => {
      const dateStr = row.created_at || row.opty_created_date || "";
      if (!dateStr) return;
      
      const date = dateStr.split("T")[0];
      if (!date) return;
      
      if (!dateMap[date]) {
        dateMap[date] = { hot: 0, warm: 0, cold: 0 };
      }
      
      const status = (row.lead_classification_status || "").toLowerCase();
      if (status === "hot") dateMap[date].hot++;
      else if (status === "warm") dateMap[date].warm++;
      else if (status === "cold") dateMap[date].cold++;
    });

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (periodDays[period] || 14));

    let sorted = Object.entries(dateMap)
      .map(([date, counts]) => ({ date, counts }))
      .filter(({ date }) => new Date(date) >= cutoff)
      .sort((a, b) => a.date.localeCompare(b.date));

    // Group by quarters if yearly
    if (period === "yearly") {
      const quarterMap = {};
      sorted.forEach(({ date, counts }) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = d.getMonth();
        const quarter = Math.floor(month / 3) + 1;
        const quarterKey = `${year}-Q${quarter}`;
        
        if (!quarterMap[quarterKey]) {
          quarterMap[quarterKey] = { hot: 0, warm: 0, cold: 0 };
        }
        quarterMap[quarterKey].hot += counts.hot;
        quarterMap[quarterKey].warm += counts.warm;
        quarterMap[quarterKey].cold += counts.cold;
      });
      
      sorted = Object.entries(quarterMap)
        .map(([quarter, counts]) => ({ date: quarter, counts }))
        .sort((a, b) => a.date.localeCompare(b.date));
    }

    const maxVal = sorted.length
      ? Math.max(...sorted.map(({ counts }) => counts.hot + counts.warm + counts.cold))
      : 0;

    return sorted.map(({ date, counts }) => ({
      date: period === "yearly" ? date : new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      hot: counts.hot,
      warm: counts.warm,
      cold: counts.cold,
      total: counts.hot + counts.warm + counts.cold,
      max: maxVal
    }));
  }, [rows, period]);

  const periodLabel = {
    weekly: "Weekly",
    monthly: "Monthly",
    yearly: "Yearly"
  }[period] || "Weekly";

  return (
    <div className="chart-card lead-trend-card">
      <div className="chart-header">
        <h3>Lead Trend ({periodLabel})</h3>
        <div className="trend-filters" style={{ gap: 10 }}>
          <select
            className="chip"
            value={period}
            onChange={e => setPeriod(e.target.value)}
            aria-label="Select trend period"
          >
            <option value="weekly">Weekly (last 7 days)</option>
            <option value="monthly">Monthly (last 30 days)</option>
            <option value="yearly">Yearly (last 365 days)</option>
          </select>
        </div>
      </div>

      <div className="trend-chart">
        <div className="trend-bars">
          {trendData.map((point, idx) => {
            const height = point.max > 0 ? (point.total / point.max) * 100 : 0;
            const hotPercent = point.total > 0 ? (point.hot / point.total) * 100 : 0;
            const warmPercent = point.total > 0 ? (point.warm / point.total) * 100 : 0;
            
            return (
              <div key={idx} className="trend-bar-wrapper">
                <div className="trend-bar-container">
                  <div 
                    className="trend-bar-stacked"
                    style={{ height: `${height}%` }}
                  >
                    {point.hot > 0 && (
                      <div 
                        className="trend-bar-segment hot"
                        style={{ height: `${hotPercent}%` }}
                        title={`Hot: ${point.hot}`}
                      >
                        <span className="trend-value">{point.hot > 0 ? point.hot : ''}</span>
                      </div>
                    )}
                    {point.warm > 0 && (
                      <div 
                        className="trend-bar-segment warm"
                        style={{ height: `${warmPercent}%` }}
                        title={`Warm: ${point.warm}`}
                      >
                        <span className="trend-value">{point.warm > 0 ? point.warm : ''}</span>
                      </div>
                    )}
                    {point.cold > 0 && (
                      <div 
                        className="trend-bar-segment cold"
                        style={{ height: 'auto', flex: 1 }}
                        title={`Cold: ${point.cold}`}
                      >
                        <span className="trend-value">{point.cold > 0 ? point.cold : ''}</span>
                      </div>
                    )}
                  </div>
                </div>
                <span className="trend-label">{point.date}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
