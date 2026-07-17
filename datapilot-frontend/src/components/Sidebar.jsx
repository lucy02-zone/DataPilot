import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">

      <h2>DataPilot</h2>

      <Link to="/dashboard">Dashboard</Link>

      <Link to="/upload">Upload Dataset</Link>

      <Link to="/history">Dataset History</Link>

      <Link to="/forecast">Forecasting</Link>

      <Link to="/reports">Reports</Link>

    </div>
  );
}

export default Sidebar;