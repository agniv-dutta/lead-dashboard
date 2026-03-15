import { useMemo } from "react";

export default function InsightsDelta({ rows = [] }) {
  const deltas = useMemo(() => {
    if (!rows || rows.length === 0) return [];

    // Group by date
    const byDate = rows.reduce((acc, r) => {
      const d = (r.created_at || r.opty_created_date || "").split("T")[0];
      if (!d) return acc;
      acc[d] = acc[d] || [];
      acc[d].push(r);
      return acc;
    }, {});

    const dates = Object.keys(byDate).sort();
    const today = dates[dates.length - 1];
    const yesterday = dates[dates.length - 2];

    if (!today || !yesterday) return [];

    const todayRows = byDate[today] || [];
    const yesterdayRows = byDate[yesterday] || [];

    const countStatus = (rows) => {
      const hot = rows.filter(r => (r.lead_classification_status || "").toLowerCase() === "hot").length;
      const warm = rows.filter(r => (r.lead_classification_status || "").toLowerCase() === "warm").length;
      const cold = rows.filter(r => (r.lead_classification_status || "").toLowerCase() === "cold").length;
      return { hot, warm, cold };
    };

    const t = countStatus(todayRows);
    const y = countStatus(yesterdayRows);

    const diff = (a, b) => a - b;

    const modelCounts = (rows) => rows.reduce((acc, r) => {
      const m = (r.model || r.Model || "Unknown");
      acc[m] = (acc[m] || 0) + 1;
      return acc;
    }, {});

    const tModels = modelCounts(todayRows);
    const yModels = modelCounts(yesterdayRows);

    const risingModel = Object.keys(tModels)
      .map(m => ({ model: m, delta: (tModels[m] || 0) - (yModels[m] || 0) }))
      .sort((a, b) => b.delta - a.delta)[0];

    const items = [];

    const dh = diff(t.hot, y.hot);
    if (dh !== 0) items.push({ icon: dh > 0 ? "▲" : "▼", text: `Hot leads ${dh > 0 ? "+" : ""}${dh}` });

    const dw = diff(t.warm, y.warm);
    if (dw !== 0) items.push({ icon: dw > 0 ? "▲" : "▼", text: `Warm leads ${dw > 0 ? "+" : ""}${dw}` });

    const dc = diff(t.cold, y.cold);
    if (dc !== 0) items.push({ icon: dc > 0 ? "▲" : "▼", text: `Cold leads ${dc > 0 ? "+" : ""}${dc}` });

    if (risingModel && risingModel.delta !== 0) {
      items.push({ icon: risingModel.delta > 0 ? "🔥" : "↘", text: `${risingModel.model} interest ${risingModel.delta > 0 ? "rising" : "falling"} (${risingModel.delta > 0 ? "+" : ""}${risingModel.delta})` });
    }

    return items.slice(0, 4);
  }, [rows]);

  return (
    <div className="chart-card insights-delta-card">
      <h3>What changed since yesterday?</h3>
      <div className="insights-delta-list">
        {deltas.length === 0 && <p className="muted">Not enough data yet</p>}
        {deltas.map((d, i) => (
          <div key={i} className="delta-item">
            <span className="delta-icon">{d.icon}</span>
            <span className="delta-text">{d.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
