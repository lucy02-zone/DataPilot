import { useEffect, useState } from "react";
import api from "../services/api";

function DatasetPreview({ preview: previewProp }) {
  const [preview, setPreview] = useState(previewProp || []);
  const [loading, setLoading] = useState(!previewProp?.length);

  useEffect(() => {
    if (previewProp?.length) {
      setPreview(previewProp);
      setLoading(false);
      return;
    }

    const fetchPreview = async () => {
      try {
        const response = await api.get("/datasets/preview/6");
        setPreview(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [previewProp]);

  if (loading) {
    return <h3>Loading dataset preview...</h3>;
  }

  if (!preview?.length) {
    return <h3>No Data Available</h3>;
  }

  return (
    <div className="preview-container">
      <div className="preview-header">
        <h2>Dataset Preview</h2>
        <p className="preview-subtitle">
          A quick look at the first few rows of your dataset.
        </p>
      </div>

      <table className="preview-table">
        <thead>
          <tr>
            {Object.keys(preview[0]).map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {preview.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, idx) => (
                <td key={idx}>{String(value)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DatasetPreview;