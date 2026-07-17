import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="navbar">
      <h2>DataPilot Analytics Platform</h2>
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;