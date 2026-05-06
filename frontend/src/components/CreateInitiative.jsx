import { useState } from "react";
import api from "../api";

export default function CreateInitiative() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      await api.post("/initiatives", { title, description });

      setMessage("Initiative created successfully!");
      setTitle("");
      setDescription("");
    } catch (err) {
      setMessage("Failed to create initiative", err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Initiative</h2>

        <div style={styles.inputGroup}>
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter initiative title"
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the initiative..."
            rows={4}
            style={styles.textarea}
          />
        </div>

        <button onClick={handleSubmit} style={styles.button}>
          Create Initiative
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "70vh",
  },
  card: {
    background: "#dbe0ec",
    padding: "30px",
    borderRadius: "16px",
    width: "420px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    border: "1px solid #1f2937",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
    gap: "6px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #374151",
    background: "#4f5678",
    color: "white",
  },
  textarea: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #374151",
    background: "#7f89ba",
    color: "white",
    resize: "none",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#897e9c",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
  },
  message: {
    marginTop: "15px",
    textAlign: "center",
  },
};