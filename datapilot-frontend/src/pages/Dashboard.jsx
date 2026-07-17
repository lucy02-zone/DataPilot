import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import OverviewCards from "../components/OverviewCards";

function Dashboard() {

  return (

    <div className="layout">

      <Sidebar />

      <div className="content">

        <Navbar />

        <OverviewCards />

      </div>

    </div>

  );
}

export default Dashboard;