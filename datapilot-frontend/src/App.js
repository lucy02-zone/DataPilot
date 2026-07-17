import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadDataset from "./pages/UploadDataset";
import DatasetDetail from "./pages/DatasetDetail";
import Forecast from "./pages/Forecast";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/upload"
          element={<UploadDataset />}
        />

        <Route
          path="/dataset/:id"
          element={<DatasetDetail />}
        />

        <Route
          path="/forecast"
          element={<Forecast />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;