import { useState } from "react";
import api from "../services/api";

function Register() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async (e) => {

    e.preventDefault();

    await api.post(
      "/auth/register",
      {
        username,
        email,
        password
      }
    );

    alert("Registration Successful");
  };

  return (

    <form onSubmit={registerUser}>

      <input
        placeholder="Username"
        onChange={(e) =>
          setUsername(e.target.value)
        }
      />

      <input
        placeholder="Email"
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <button>
        Register
      </button>

    </form>

  );
}

export default Register;