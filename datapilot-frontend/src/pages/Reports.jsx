import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

function Reports() {
  const [loading, setLoading] = useState(true);
  const [datasets, setDatasets] = useState([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);
  const [error, setError] = useState("");
  const [downloadStatus, setDownloadStatus] = useState("");

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const response = await api.get("/datasets");
        setDatasets(response.data || []);
        if (response.data?.length) {
          setSelectedDatasetId(response.data[0].dataset_id);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load dataset list. Upload a dataset first.");
      } finally {
        setLoading(false);
      }
    };

    fetchDatasets();
  }, []);

  const downloadReport = async () => {
    if (!selectedDatasetId) return;
    setDownloadStatus("Generating report...");

    try {
      const response = await api.get(
        `/datasets/report/${selectedDatasetId}`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: "application/pdf"
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `datapilot-report-${selectedDatasetId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setDownloadStatus("Report downloaded successfully.");
    } catch (err) {
      console.error(err);
      setDownloadStatus("Failed to download report. Try again.");
    }
  };

  const selectedDataset = datasets.find(
    (dataset) => dataset.dataset_id === selectedDatasetId
  );

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Navbar />

        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Reports</p>
            <h1>Generate downloadable analysis reports</h1>
            <p className="dashboard-summary">
              Select a dataset and download a PDF analysis report based on that file.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading available datasets...</div>
        ) : error ? (
          <div className="dashboard-empty error-state">{error}</div>
        ) : !datasets.length ? (
          <div className="dashboard-empty">
            No datasets available. Upload a dataset to enable report generation.
          </div>
        ) : (
          <div className="preview-container">
            <div className="preview-header">
              <div>
                <h2>Select dataset for report</h2>
                <p className="preview-subtitle">
                  Choose a file below and download its generated PDF report.
                </p>
              </div>
            </div>

            <div className="upload-actions" style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <label style={{ width: "100%", marginBottom: "16px" }}>
                <span style={{ display: "block", marginBottom: "8px", color: "#475569", fontWeight: 600 }}>
                  Dataset file
                </span>
                <select
                  value={selectedDatasetId ?? ""}
                  onChange={(e) => {
                    setSelectedDatasetId(Number(e.target.value));
                    setDownloadStatus("");
                  }}
                  style={{
                    width: "100%",
                    maxWidth: "420px",
                    padding: "12px 14px",
                    borderRadius: "14px",
                    border: "1px solid #cbd5e1",
                    background: "white",
                    color: "#0f172a"
                  }}
                >
                  {datasets.map((dataset) => (
                    <option
                      key={dataset.dataset_id}
                      value={dataset.dataset_id}
                    >
                      {dataset.dataset_name} ({dataset.rows} rows, {dataset.columns} cols)
                    </option>
                  ))}
                </select>
              </label>

              <button className="upload-button" onClick={downloadReport}>
                Download Report PDF
              </button>
            </div>

            {selectedDataset && (
              <div className="dashboard-meta" style={{ marginTop: "22px" }}>
                <span className="meta-chip">ID: {selectedDataset.dataset_id}</span>
                <span className="meta-chip">Rows: {selectedDataset.rows}</span>
                <span className="meta-chip">Columns: {selectedDataset.columns}</span>
              </div>
            )}

            {downloadStatus && (
              <p className={`upload-message ${downloadStatus.includes("Failed") ? "error" : "success"}`}>
                {downloadStatus}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
