import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/signup", {
        name: username,
        password,
      });

      setMessage(response.data || "Signup successful. You can log in now.");
      setUsername("");
      setPassword("");
      setRole("USER");
    } catch (err) {
      setError(
        err?.response?.data || "Could not sign up. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "var(--text-h)" }}>
        Sign up for IdeaTracker
      </h2>

      <form onSubmit={handleSignup} style={{ display: "grid", gap: "1rem" }}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a secure password"
          />
        </div>

        <button type="submit" className="btn-primary" style={{ width: "100%", padding: "1rem" }}>
          {loading ? "Signing up..." : "Create account"}
        </button>
      </form>

      {message && <p style={{ color: "#28a745", textAlign: "center", marginTop: "1rem" }}>{message}</p>}
      {error && <p style={{ color: "#dc3545", textAlign: "center", marginTop: "1rem" }}>{error}</p>}

      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        Already have an account? <Link to="/admin">Login</Link>
      </p>
    </div>
  );
}
