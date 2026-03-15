import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";

const ALL_MODELS = "All Models";

export function useLeadsData(initialModel = ALL_MODELS) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedModel, setSelectedModel] = useState(initialModel);

  useEffect(() => {
    setSelectedModel(initialModel);
  }, [initialModel]);

  const fetchData = () => {
    setLoading(true);
    fetch("/model_analysis.csv")
      .then(res => res.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: results => {
            const data = results.data;
            setRows(data);
            // derive last updated from latest created_at/opty_created_date
            const dates = data
              .map(r => (r.created_at || r.opty_created_date || "").split("T")[0])
              .filter(Boolean)
              .sort();
            setLastUpdated(dates.length ? dates[dates.length - 1] : null);
            setLoading(false);
          }
        });
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const filteredData = useMemo(() => {
    const all = !selectedModel
      || selectedModel.toUpperCase() === "ALL"
      || selectedModel.toLowerCase() === ALL_MODELS.toLowerCase();

    if (all) return rows;
    return rows.filter(r => (r.model || r.Model || "").toLowerCase() === selectedModel.toLowerCase());
  }, [rows, selectedModel]);

  const hotLeads = useMemo(
    () => filteredData.filter(r => r.lead_classification_status === "Hot").length,
    [filteredData]
  );
  const warmLeads = useMemo(
    () => filteredData.filter(r => r.lead_classification_status === "Warm").length,
    [filteredData]
  );
  const coldLeads = useMemo(
    () => filteredData.filter(r => r.lead_classification_status === "Cold").length,
    [filteredData]
  );

  return {
    data: filteredData,
    rows,
    loading,
    lastUpdated,
    refetch: fetchData,
    selectedModel,
    setSelectedModel,
    totalRecords: filteredData.length,
    hotLeads,
    warmLeads,
    coldLeads
  };
}
