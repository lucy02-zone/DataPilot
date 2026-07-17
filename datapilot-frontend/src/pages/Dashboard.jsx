import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {

  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {

    api
      .get("/datasets/dashboard/6")
      .then((response) => {
        setDashboard(response.data);
      });

  }, []);

  if (!dashboard)
    return <h2>Loading...</h2>;

  return (

    <div>

      <h1>DataPilot Dashboard</h1>

      <h3>
        Rows:
        {dashboard.overview.rows}
      </h3>

      <h3>
        Columns:
        {dashboard.overview.columns}
      </h3>

      <h3>
        Health Score:
        {dashboard.overview.health_score}
      </h3>

      <h2>AI Insights</h2>

      <pre>
        {dashboard.insights.ai_insights}
      </pre>

    </div>

  );
}

export default Dashboard;