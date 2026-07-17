import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

function Forecast() {
  const [loading, setLoading] = useState(true);
  const [datasets, setDatasets] = useState([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);
  const [preview, setPreview] = useState([]);
  const [dateColumn, setDateColumn] = useState("");
  const [targetColumn, setTargetColumn] = useState("");
  const [periods, setPeriods] = useState(30);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const response = await api.get("/datasets");
        const list = response.data || [];
        setDatasets(list);
        if (list.length) {
          setSelectedDatasetId(list[0].dataset_id);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load datasets. Upload a dataset first.");
      } finally {
        setLoading(false);
      }
    };

    fetchDatasets();
  }, []);

  useEffect(() => {
    if (!selectedDatasetId) {
      setPreview([]);
      return;
    }

    const fetchPreview = async () => {
      setStatus("");
      try {
        const response = await api.get(`/datasets/preview/${selectedDatasetId}`);
        if (response.data?.error) {
          setError(response.data.error);
          setPreview([]);
          return;
        }
        setPreview(response.data || []);
        if (response.data?.length) {
          const columns = Object.keys(response.data[0]);
          setDateColumn(columns[0] || "");
          setTargetColumn(columns[1] || "");
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load dataset preview.");
        setPreview([]);
      }
    };

    fetchPreview();
  }, [selectedDatasetId]);

  const handleForecast = async () => {
    if (!selectedDatasetId || !dateColumn || !targetColumn) {
      setStatus("Select dataset, date column, and target column first.");
      return;
    }

    setStatus("Running forecast...");
    setForecast([]);

    try {
      const response = await api.get(
        `/datasets/forecast/${selectedDatasetId}`,
        {
          params: {
            date_column: dateColumn,
            target_column: targetColumn,
            periods
          }
        }
      );

      if (response.data?.forecast) {
        setForecast(response.data.forecast);
        setStatus("Forecast generated successfully.");
      } else {
        setStatus("Forecast service returned no data.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Forecast generation failed. Check the selected columns.");
    }
  };

  const availableColumns = preview?.length ? Object.keys(preview[0]) : [];

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Navbar />

        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Forecasting</p>
            <h1>Forecast a selected dataset</h1>
            <p className="dashboard-summary">
              Select the dataset, pick the date and target fields, then generate a forecast.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading dataset options...</div>
        ) : error ? (
          <div className="dashboard-empty error-state">{error}</div>
        ) : !datasets.length ? (
          <div className="dashboard-empty">
            No datasets found. Upload a dataset to use forecasting.
          </div>
        ) : (
          <div className="preview-container">
            <div className="preview-header">
              <div>
                <h2>Forecast setup</h2>
                <p className="preview-subtitle">
                  Choose the dataset and forecast settings you want to run.
                </p>
              </div>
            </div>

            <div className="upload-actions" style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <div style={{ width: "100%", maxWidth: "520px", marginBottom: "18px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#475569", fontWeight: 600 }}>
                  Dataset
                </label>
                <select
                  value={selectedDatasetId}
                  onChange={(e) => setSelectedDatasetId(Number(e.target.value))}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "14px", border: "1px solid #cbd5e1", background: "white", color: "#0f172a" }}
                >
                  {datasets.map((dataset) => (
                    <option key={dataset.dataset_id} value={dataset.dataset_id}>
                      {dataset.dataset_name} ({dataset.rows} rows, {dataset.columns} cols)
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ width: "100%", maxWidth: "520px", marginBottom: "18px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#475569", fontWeight: 600 }}>
                  Date column
                </label>
                <select
                  value={dateColumn}
                  onChange={(e) => setDateColumn(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "14px", border: "1px solid #cbd5e1", background: "white", color: "#0f172a" }}
                >
                  <option value="">Select date column</option>
                  {availableColumns.map((col) => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              <div style={{ width: "100%", maxWidth: "520px", marginBottom: "18px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#475569", fontWeight: 600 }}>
                  Target column
                </label>
                <select
                  value={targetColumn}
                  onChange={(e) => setTargetColumn(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "14px", border: "1px solid #cbd5e1", background: "white", color: "#0f172a" }}
                >
                  <option value="">Select target column</option>
                  {availableColumns.map((col) => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              <div style={{ width: "100%", maxWidth: "520px", display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "22px" }}>
                <div style={{ flex: "1 1 220px" }}>
                  <label style={{ display: "block", marginBottom: "8px", color: "#475569", fontWeight: 600 }}>
                    Forecast periods
                  </label>
                  <input
                    type="number"
                    min="7"
                    max="365"
                    value={periods}
                    onChange={(e) => setPeriods(Number(e.target.value))}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "14px", border: "1px solid #cbd5e1", background: "white", color: "#0f172a" }}
                  />
                </div>

                <button className="upload-button" onClick={handleForecast}>
                  Generate Forecast
                </button>
              </div>

              {status && (
                <p className={`upload-message ${status.includes("failed") || status.includes("Failed") ? "error" : "success"}`}>
                  {status}
                </p>
              )}
            </div>

            {preview.length > 0 && (
              <div style={{ marginTop: "24px" }}>
                <h3 style={{ marginBottom: "14px" }}>Preview columns</h3>
                <div className="dashboard-meta" style={{ flexWrap: "wrap" }}>
                  {availableColumns.map((column) => (
                    <span key={column} className="meta-chip" style={{ marginBottom: "10px" }}>{column}</span>
                  ))}
                </div>
              </div>
            )}

            {forecast.length > 0 && (
              <div style={{ marginTop: "28px" }}>
                <h3 style={{ marginBottom: "14px" }}>Forecast output</h3>
                <div className="preview-container">
                  <table className="preview-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Forecast</th>
                        <th>Lower</th>
                        <th>Upper</th>
                      </tr>
                    </thead>
                    <tbody>
                      {forecast.map((row, index) => (
                        <tr key={index}>
                          <td>{new Date(row.ds).toLocaleDateString()}</td>
                          <td>{row.yhat?.toFixed?.(2) ?? row.yhat}</td>
                          <td>{row.yhat_lower?.toFixed?.(2) ?? row.yhat_lower}</td>
                          <td>{row.yhat_upper?.toFixed?.(2) ?? row.yhat_upper}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Forecast;
