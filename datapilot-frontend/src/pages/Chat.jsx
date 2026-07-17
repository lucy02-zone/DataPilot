import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

function Chat() {
  const [loading, setLoading] = useState(true);
  const [datasets, setDatasets] = useState([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);
  const [preview, setPreview] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

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
        setPreview(response.data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load dataset preview.");
        setPreview([]);
      }
    };

    fetchPreview();
  }, [selectedDatasetId]);

  const askQuestion = async () => {
    if (!selectedDatasetId || !question.trim()) {
      setStatus("Select a dataset and type a question first.");
      return;
    }

    setStatus("Sending your question...");
    setAnswer("");
    setError("");

    try {
      const response = await api.post(
        `/datasets/chat/${selectedDatasetId}`,
        { question }
      );

      if (response.data?.answer) {
        setAnswer(response.data.answer);
        setStatus("");
      } else {
        setAnswer("");
        setStatus("No answer returned from the model.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to ask the dataset. Check your backend and try again.");
      setStatus("");
    }
  };

  const selectedDataset = datasets.find(
    (dataset) => dataset.dataset_id === selectedDatasetId
  );

  const availableColumns = preview?.length ? Object.keys(preview[0]) : [];

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Navbar />

        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Chat</p>
            <h1>Ask questions about your dataset</h1>
            <p className="dashboard-summary">
              Select a dataset, then ask questions and get answers from your data.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading dataset options...</div>
        ) : error ? (
          <div className="dashboard-empty error-state">{error}</div>
        ) : !datasets.length ? (
          <div className="dashboard-empty">
            No datasets found. Upload a dataset to use dataset chat.
          </div>
        ) : (
          <div className="preview-container">
            <div className="preview-header">
              <div>
                <h2>Dataset chat</h2>
                <p className="preview-subtitle">
                  Pick a dataset and ask any question about its structure or values.
                </p>
              </div>
            </div>

            <div className="upload-actions" style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <div style={{ width: "100%", maxWidth: "560px", marginBottom: "18px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#475569", fontWeight: 600 }}>
                  Choose dataset
                </label>
                <select
                  value={selectedDatasetId || ""}
                  onChange={(e) => {
                    setSelectedDatasetId(Number(e.target.value));
                    setAnswer("");
                    setStatus("");
                    setError("");
                  }}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "14px", border: "1px solid #cbd5e1", background: "white", color: "#0f172a" }}
                >
                  {datasets.map((dataset) => (
                    <option key={dataset.dataset_id} value={dataset.dataset_id}>
                      {dataset.dataset_name} ({dataset.rows} rows, {dataset.columns} cols)
                    </option>
                  ))}
                </select>
              </div>

              {selectedDataset && (
                <div className="dashboard-meta" style={{ marginBottom: "18px" }}>
                  <span className="meta-chip">ID: {selectedDataset.dataset_id}</span>
                  <span className="meta-chip">Rows: {selectedDataset.rows}</span>
                  <span className="meta-chip">Columns: {selectedDataset.columns}</span>
                </div>
              )}

              {availableColumns.length > 0 && (
                <div style={{ marginBottom: "22px" }}>
                  <h3 style={{ margin: "0 0 10px" }}>Available columns</h3>
                  <div className="dashboard-meta" style={{ flexWrap: "wrap" }}>
                    {availableColumns.map((column) => (
                      <span key={column} className="meta-chip" style={{ marginBottom: "10px" }}>{column}</span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ width: "100%", maxWidth: "720px", marginBottom: "18px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#475569", fontWeight: 600 }}>
                  Ask a question about this dataset
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={5}
                  placeholder="Example: What are the top 3 sales regions?"
                  style={{ width: "100%", padding: "14px", borderRadius: "18px", border: "1px solid #cbd5e1", resize: "vertical", background: "white", color: "#0f172a" }}
                />
              </div>

              <button className="upload-button" onClick={askQuestion}>
                Ask dataset
              </button>

              {status && (
                <p className={`upload-message ${status.includes("failed") || status.includes("Failed") ? "error" : "success"}`}>
                  {status}
                </p>
              )}

              {answer && (
                <div style={{ marginTop: "22px", width: "100%", maxWidth: "760px" }}>
                  <h3 style={{ marginBottom: "14px" }}>Answer</h3>
                  <div className="preview-container">
                    <p style={{ margin: 0, lineHeight: 1.8, color: "#334155" }}>{answer}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
