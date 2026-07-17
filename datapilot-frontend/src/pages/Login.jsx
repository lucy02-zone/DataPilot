import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response = await api.post(
        "/auth/login",
        {
          email,
          password
        }
      );

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      alert("Login Successful");

      navigate("/dashboard");

    } catch (error) {

      console.error("Login Error:", error);

      if (error.response) {

        alert(
          error.response.data.detail ||
          "Login Failed"
        );

        console.log(
          error.response.data
        );

      } else {

        alert(
          "Cannot connect to server"
        );

      }

    }

  };

  return (

    <div>

      <h1>DataPilot Login</h1>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <br /><br />

        <button type="submit">
          Login
        </button>

      </form>

    </div>

  );
}

export default Login;