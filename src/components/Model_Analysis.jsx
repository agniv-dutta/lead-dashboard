import { useMemo } from "react";
import LeadTrend from "./LeadTrend";
import ConversionFunnel from "./ConversionFunnel";
import LeadQualityScore from "./LeadQualityScore";
import SmartAlerts from "./SmartAlerts";
import BestPerformingPincode from "./BestPerformingPincode";
import InsightsDelta from "./InsightsDelta";
import CallDensityMap from "./CallDensityMap";
import SalesStageHeatmap from "./SalesStageHeatmap";
import "./SierraAnalysis.css";

export default function ModelAnalysis({ selectedModel = "All Models", data = [], loading = false, lastUpdated = null, onRefresh }) {

  const stats = useMemo(() => {
    const hot = data.filter(d => d.lead_classification_status === "Hot").length;
    const warm = data.filter(d => d.lead_classification_status === "Warm").length;
    const cold = data.filter(d => d.lead_classification_status === "Cold").length;

    return {
      hot,
      warm,
      cold,
      total: data.length
    };
  }, [data]);

  const topRows = data.slice(0, 200);
  const headerLabel = (selectedModel || "All Models").toLowerCase() === "all models"
    ? "All Models"
    : selectedModel;

  return (
    <div className="sierra-analysis-root">
      <header className="sierra-header">
        <h1>{headerLabel} Detailed Analysis</h1>
        <p className="muted">
          Calls, pincodes, lead quality and sales-stage mapping
        </p>
        <div className="summary-grid">
          <div className="summary-item">
            <strong>Last Update:</strong> {lastUpdated || "n/a"}
          </div>
          <button className="btn" type="button" onClick={onRefresh}>Refresh</button>
        </div>
      </header>

      <div className="sierra-summary-cards">
        <div className="card primary">
          <div className="card-value">{stats.total}</div>
          <div className="card-label">Total Records</div>
        </div>
        <div className="card">
          <div className="card-value">{stats.hot}</div>
          <div className="card-label">Hot Leads</div>
        </div>
        <div className="card">
          <div className="card-value">{stats.warm}</div>
          <div className="card-label">Warm Leads</div>
        </div>
        <div className="card">
          <div className="card-value">{stats.cold}</div>
          <div className="card-label">Cold Leads</div>
        </div>
      </div>

      {/* Lead Trend & Quality Score + Funnel */}
      {loading ? (
        <div className="skeleton skeleton-card" />
      ) : (
        <LeadTrend rows={data} />
      )}

      <div className="viz-grid">
        {loading ? (
          <div className="skeleton skeleton-card" />
        ) : (
          <LeadQualityScore rows={data} />
        )}
        {loading ? (
          <div className="skeleton skeleton-card" />
        ) : (
          <ConversionFunnel rows={data} />
        )}
      </div>

      {/* Yesterday deltas, Alerts & Pincode insights */}
      {loading ? (
        <div className="skeleton skeleton-card" />
      ) : (
        <InsightsDelta rows={data} />
      )}
      <div className="viz-grid">
        {loading ? <div className="skeleton skeleton-card" /> : <SmartAlerts rows={data} />}
        {loading ? <div className="skeleton skeleton-card" /> : <BestPerformingPincode rows={data} />}
      </div>

      <div className="viz-grid">
        {loading ? <div className="skeleton skeleton-card" /> : <CallDensityMap rows={data} />}
        {loading ? <div className="skeleton skeleton-card" /> : <SalesStageHeatmap rows={data} />}
      </div>

      <section className="panel right">
        <h3>Raw Table (first 200 rows)</h3>
        <div className="table-scroll">
          {loading ? (
            <div className="skeleton skeleton-table" />
          ) : (
          <table className="raw-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Model</th>
                <th>Pin</th>
                <th>Lead Class</th>
                <th>Sales Stage</th>
              </tr>
            </thead>
            <tbody>
              {topRows.map((r, i) => (
                <tr key={i}>
                  <td>{r.customer_name || r.Customer || "N/A"}</td>
                  <td>{r.phone_number || r.Phone || "N/A"}</td>
                  <td>{r.model || r.Model || "N/A"}</td>
                  <td>{r.pin_code || r.Pin || "N/A"}</td>
                  <td>{r.lead_classification_status || r.Lead_Class || "N/A"}</td>
                  <td>{r.updated_sales_stage || r.Sales_Stage || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </section>
    </div>
  );
}
