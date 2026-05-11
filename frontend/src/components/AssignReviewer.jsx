import { useEffect, useState } from "react";
import api from "../api";

export default function AssignReviewers({ initiativeId }) {
  const [reviewers, setReviewers] = useState([]);
  const [selectedReviewerIds, setSelectedReviewerIds] = useState([]);
  const [message, setMessage] = useState("");

  //fetch all users and keep only REVIEWERS
  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        const res = await api.get("/users");
        const onlyReviewers = res.data.filter(
          (u) => u.role === "REVIEWER"
        );
        setReviewers(onlyReviewers);
      } catch (err) {
        console.error("Failed to load reviewers", err);
      }
    };

    fetchReviewers();
  }, []);

  //handle select change
  const handleSelectChange = (e) => {
    const values = Array.from(e.target.selectedOptions).map(
      (opt) => Number(opt.value)
    );
    setSelectedReviewerIds(values);
  };

  // send assignment to backend
  const handleAssign = async () => {
    try {
      await api.patch(`/initiatives/${initiativeId}/assign`, {
        reviewerIds: selectedReviewerIds
      });
      setMessage("Reviewers assigned successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to assign reviewers");
    }
  };

  return (
    <div style={styles.card}>
      <h3>Assign Reviewers</h3>

      <label>Select reviewers (REVIEWER role)</label>
      <select
        multiple
        value={selectedReviewerIds}
        onChange={handleSelectChange}
        style={styles.select}
      >
        {reviewers.map((r) => (
          <option key={r.id} value={r.id}>
            {r.username}
          </option>
        ))}
      </select>

      <button onClick={handleAssign} style={styles.button}>
        Assign Reviewers
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}

const styles = {
  card: {
    background: "#1f3054",
    padding: "20px",
    borderRadius: "12px",
    maxWidth: "400px",
  },
  select: {
    width: "100%",
    minHeight: "120px",
    marginTop: "8px",
  },
  button: {
    marginTop: "12px",
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  
};
