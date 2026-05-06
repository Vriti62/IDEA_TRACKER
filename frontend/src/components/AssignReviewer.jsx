import { useState } from "react";
import api from "../api";

export default function AssignReviewers() {
  const [initiativeId, setInitiativeId] = useState("");
  const [reviewerIds, setReviewerIds] = useState("");
  const [message, setMessage] = useState("");

  const handleAssign = async () => {
    try {
      const ids = reviewerIds.split(",").map(Number);

      await api.patch(`/initiatives/${initiativeId}/assign`, ids);

      setMessage("Reviewers assigned successfully!");
      setInitiativeId("");
      setReviewerIds("");
    } catch (err) {
      setMessage("Failed to assign reviewers", err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Assign Reviewers</h2>

        <div style={styles.inputGroup}>
          <label>Initiative</label>
          <input
            value={initiativeId}
            onChange={(e) => setInitiativeId(e.target.value)}
            placeholder="Enter initiative ID"
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label>Reviewer</label>
          <input
            value={reviewerIds}
            onChange={(e) => setReviewerIds(e.target.value)}
            placeholder="e.g. 1,2,3"
            style={styles.input}
          />
        </div>

        <button onClick={handleAssign} style={styles.button}>
          Assign Reviewers
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
    background: "#e3e9f6",
    padding: "30px",
    borderRadius: "16px",
    width: "400px",
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
    background: "#7c8ccd",
    color: "white",
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