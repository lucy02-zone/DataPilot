import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import OverviewCards from "../components/OverviewCards";
import DatasetPreview from "../components/DatasetPreview";
import api from "../services/api";

import "../styles/dashboard.css";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/datasets/dashboard/latest");
        setDashboardData(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard data. Upload a dataset to get started.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <Navbar />

        {loading ? (
          <div className="loading-state">Loading dashboard...</div>
        ) : error ? (
          <div className="dashboard-empty error-state">{error}</div>
        ) : !dashboardData ? (
          <div className="dashboard-empty">
            No dataset available. Upload a dataset to see live analytics.
          </div>
        ) : (
          <>
            <div className="dashboard-header">
              <div>
                <p className="eyebrow">Latest dataset</p>
                <h1>{dashboardData.dataset_name}</h1>
                <p className="dashboard-summary">
                  Overview details generated from the most recently uploaded dataset.
                </p>
              </div>
              <div className="dashboard-meta">
                <div className="meta-chip">Dataset ID: {dashboardData.dataset_id}</div>
                <div className="meta-chip">
                  {dashboardData.overview.rows.toLocaleString()} rows
                </div>
              </div>
            </div>

            <OverviewCards data={dashboardData.overview} />
            <DatasetPreview preview={dashboardData.preview} />
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;