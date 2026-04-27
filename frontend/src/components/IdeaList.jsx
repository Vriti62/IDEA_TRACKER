import { useEffect, useState } from "react";
import api from "../api";

export default function IdeaList() {
  const [ideas, setIdeas] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchIdeas();
  }, [status]);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      let url = "/ideas";

      if (status) {
        url += `?status=${status}`;
      }

      const res = await api.get(url);
      setIdeas(res.data.content);
    } catch (err) {
      console.error("Error fetching ideas:", err);
    } finally {
      setLoading(false);
    }
  };

  //Status update function
  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/ideas/${id}/status`, {
        status: newStatus,
      });

      fetchIdeas(); // refresh after update
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "system-ui" }}>

      <h2>All Ideas</h2>

      {/* FILTER */}
      <div style={{ marginBottom: 20 }}>
        <label>Status Filter: </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: 8, borderRadius: 6, marginLeft: 10 }}
        >
          <option value="">All</option>
          <option value="OPEN">OPEN</option>
          <option value="UNDER_REVIEW">UNDER_REVIEW</option>
          <option value="ACCEPTED">ACCEPTED</option>
        </select>
      </div>

      {loading && <p>Loading ideas...</p>}
      {!loading && ideas.length === 0 && <p>No ideas found.</p>}

      {/* IDEA LIST */}
      {ideas.map((idea) => (
        <div
          key={idea.id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            borderRadius: 10,
            marginBottom: 15,
          }}
        >
          <h3>{idea.title}</h3>

          <p><strong>Problem:</strong> {idea.problemStatement}</p>

          {idea.potentialSolution && (
            <p><strong>Solution:</strong> {idea.potentialSolution}</p>
          )}

          {/* STATUS DROPDOWN */}
          <div style={{ marginTop: 10 }}>
            <label><strong>Status: </strong></label>
            <select
              value={idea.status}
              onChange={(e) => updateStatus(idea.id, e.target.value)}
              style={{ padding: 6, borderRadius: 6, marginLeft: 10 }}
            >
              <option value="OPEN">OPEN</option>
              <option value="UNDER_REVIEW">UNDER_REVIEW</option>
              <option value="ACCEPTED">ACCEPTED</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}