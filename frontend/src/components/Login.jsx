import { useState } from "react";
import { useNavigate, useLocation , Link } from "react-router-dom";
import api from "../api";
import "../App.css";

export default function Login({ onLogin, title = "Login" }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || "/";

 const handleLogin = async () => {
  setError("");
  setLoading(true);
  try {
    const response = await api.post("/auth/login", {
      username,
      password,
    });

    const { role } = response.data;

    const basicAuth = btoa(`${username}:${password}`);
    localStorage.setItem("auth", basicAuth);

    onLogin(username, role);

    navigate(redirectTo, { replace: true });
  } catch {
    setError("Invalid credentials");
  } finally {
    setLoading(false);
  }
};

  return (
  <div className="login-overlay">
    <div className="login-glass-card">
        <h2 className="login-title">{title}</h2>
        <p className="login-subtitle">Welcome back. Please sign in to continue.</p>

        <div className="login-field">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="login-field">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        {error && <p className="login-error">{error}</p>}

        <p className="login-footer">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}