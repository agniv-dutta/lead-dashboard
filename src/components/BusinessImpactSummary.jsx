export default function BusinessImpactSummary() {
  return (
    <div className="impact-summary-card">
      <div className="impact-header">
        <span className="impact-icon">📌</span>
        <h3>Business Impact Summary</h3>
      </div>
      
      <div className="impact-content">
        <p className="impact-main">
          Using <strong>AI-driven lead classification</strong>, dealerships can improve 
          hot-lead conversion by up to <span className="highlight">18–22%</span>, 
          reduce response time by <span className="highlight">65%</span>, and prioritize 
          sales efforts more effectively.
        </p>
        
        <div className="impact-metrics">
          <div className="impact-metric">
            <div className="impact-value">18-22%</div>
            <div className="impact-label">Conversion Improvement</div>
          </div>
          <div className="impact-metric">
            <div className="impact-value">65%</div>
            <div className="impact-label">Faster Response Time</div>
          </div>
          <div className="impact-metric">
            <div className="impact-value">3x</div>
            <div className="impact-label">Better Lead Prioritization</div>
          </div>
        </div>

        <div className="impact-benefits">
          <h4>Key Benefits</h4>
          <ul>
            <li>✓ Automated lead scoring reduces manual classification effort</li>
            <li>✓ Real-time insights enable faster sales team response</li>
            <li>✓ Data-driven decision making improves resource allocation</li>
            <li>✓ Predictive analytics identify high-value opportunities early</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
