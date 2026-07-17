import { useState } from "react";
import api from "../services/api";

function UploadDataset() {

  const [file, setFile] = useState(null);

  const uploadDataset = async () => {

    const formData = new FormData();

    formData.append(
      "file",
      file
    );

    await api.post(
      "/datasets/upload",
      formData
    );

    alert("Dataset Uploaded");
  };

  return (

    <div>

      <h1>Upload Dataset</h1>

      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
      />

      <button onClick={uploadDataset}>
        Upload
      </button>

    </div>

  );
}

export default UploadDataset;