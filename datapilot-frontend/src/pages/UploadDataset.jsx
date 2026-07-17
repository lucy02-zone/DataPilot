import { useState } from "react";
import api from "../services/api";
import "../styles/upload.css";

function UploadDataset() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const uploadDataset = async () => {
    if (!file) {
      setMessageType("error");
      setMessage("Please choose a CSV file before uploading.");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/datasets/upload", formData);
      setMessageType("success");
      setMessage("Dataset uploaded successfully.");
      setFile(null);
    } catch (error) {
      setMessageType("error");
      setMessage("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-card">
        <div className="upload-header">
          <span className="eyebrow">DataPilot</span>
          <h1>Upload your dataset</h1>
          <p>Bring in a CSV file to begin analysis, forecasting, and reporting.</p>
        </div>

        <label className="upload-dropzone" htmlFor="dataset-file">
          <input
            id="dataset-file"
            type="file"
            accept=".csv"
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              setFile(selectedFile);
              setMessage("");
              setMessageType("");
            }}
          />
          <div className="dropzone-content">
            <div className="dropzone-icon">📦</div>
            <div className="dropzone-title">
              {file ? `Selected file: ${file.name}` : "Choose a CSV file"}
            </div>
            <div className="dropzone-subtitle">
              Click here to browse your files and upload a dataset.
            </div>
          </div>
        </label>

        {file && (
          <div className="file-info">
            <strong>Ready to upload:</strong> {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </div>
        )}

        <div className="upload-actions">
          <button className="upload-button" onClick={uploadDataset} disabled={loading}>
            {loading ? "Uploading..." : "Upload Dataset"}
          </button>
        </div>

        {message && (
          <div className={`upload-message ${messageType}`}>{message}</div>
        )}
      </div>
    </div>
  );
}

export default UploadDataset;