import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/auth.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

    const handleLogin = async (e) => {
      e.preventDefault();
      setMessage("");
      setError("");

      try {
        const response = await api.post(
          "/auth/login",
          { email, password }
        );

        localStorage.setItem("token", response.data.access_token);
        setMessage("Login successful. Redirecting...");
        setTimeout(() => navigate("/dashboard"), 700);
      } catch (err) {
        console.error("Login Error:", err);
        setError(
          err.response?.data?.detail ||
          "Login failed. Please try again."
        );
      }
    };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>DataPilot Login</h1>
          <p>Sign in to access your datasets, chat, forecasting, and reports.</p>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          {message && <div className="auth-alert success">{message}</div>}
          {error && <div className="auth-alert error">{error}</div>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-button">
            Login
          </button>
        </form>

        <div className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Register here</Link>.
        </div>
      </div>
    </div>
  );
}

export default Login;