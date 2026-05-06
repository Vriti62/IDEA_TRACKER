import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Login({ onLogin, title = "Login" }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError("");
        setLoading(true);
        try {
            const response = await api.post("/auth/login", {
                name: username,
                password,
            });

            const { role } = response.data;
            const basicAuth = btoa(`${username}:${password}`);
            localStorage.setItem("auth", basicAuth);
            onLogin(username, role);
        } catch (err) {
            const message = err?.response?.data?.message || err?.response?.data || "Invalid credentials";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>{title}</h2>

            <div className="form-group">
                <label>Username</label>
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button onClick={handleLogin} className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? "Signing in..." : "Login"}
            </button>

            {error && <p style={{ color: "#dc3545", textAlign: "center", marginTop: "1rem" }}>{error}</p>}

            <p style={{ textAlign: "center", marginTop: "1rem" }}>
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    );
}