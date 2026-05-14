import { useState } from "react";
import api from "../api";
import "../App.css";

export default function AddReviewerModal({ onClose, onSuccess }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    try {
      await api.post("/users", {
        username: username.trim(),
        email: email.trim() || `${username.trim()}@demo.com`,
        role: "REVIEWER",
      });

      onSuccess(); // refresh reviewers list
      onClose();
    } catch (e) {
      console.error(e);
      setError("Failed to add reviewer");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>Add Reviewer</h3>

        <div className="form-group">
          <label>Username</label>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>


        {error && <p className="login-error">{error}</p>}

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            Add Reviewer
          </button>
        </div>
      </div>
    </div>
  );
}
