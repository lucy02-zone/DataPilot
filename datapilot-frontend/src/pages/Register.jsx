import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/auth.css";

function Register() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const registerUser = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post(
        "/auth/register",
        { username, email, password }
      );
      setMessage("Registration successful. You can now login.");
    } catch (err) {
      console.error("Register Error:", err);
      setError(err.response?.data?.detail || "Registration failed. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create an account</h1>
          <p>Register and start using DataPilot for dataset analytics.</p>
        </div>

        <form className="auth-form" onSubmit={registerUser}>
          {message && <div className="auth-alert success">{message}</div>}
          {error && <div className="auth-alert error">{error}</div>}

          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

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
            Register
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/">Login here</Link>.
        </div>
      </div>
    </div>
  );
}

export default Register;