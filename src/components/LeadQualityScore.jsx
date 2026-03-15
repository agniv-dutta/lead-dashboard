import { useMemo } from "react";

export default function LeadQualityScore({ rows = [] }) {
  const quality = useMemo(() => {
    if (rows.length === 0) return { score: 0, grade: "N/A", color: "#9ca3af" };

    const hot = rows.filter(r => r.lead_classification_status === "Hot").length;
    const warm = rows.filter(r => r.lead_classification_status === "Warm").length;
    const total = rows.length;

    const score = ((hot * 1.0 + warm * 0.5) / total) * 100;
    
    let grade, color;
    if (score >= 60) {
      grade = "Excellent";
      color = "#10b981";
    } else if (score >= 40) {
      grade = "Good";
      color = "#f59e0b";
    } else if (score >= 20) {
      grade = "Average";
      color = "#fb923c";
    } else {
      grade = "Poor";
      color = "#ef4444";
    }

    return { score: score.toFixed(1), grade, color };
  }, [rows]);

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (quality.score / 100) * circumference;

  return (
    <div className="chart-card quality-score-card">
      <h3>Lead Quality Score</h3>
      <p className="muted">Overall lead health metric</p>
      
      <div className="quality-gauge">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="var(--border)"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke={quality.color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
          <text
            x="60"
            y="55"
            textAnchor="middle"
            fontSize="24"
            fontWeight="800"
            fill="var(--text)"
          >
            {quality.score}
          </text>
          <text
            x="60"
            y="75"
            textAnchor="middle"
            fontSize="12"
            fill="var(--muted)"
          >
            {quality.grade}
          </text>
        </svg>
      </div>
    </div>
  );
}
