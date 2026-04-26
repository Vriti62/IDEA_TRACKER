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
      setIdeas(res.data.content); // because of Pageable
    } catch (err) {
      console.error("Error fetching ideas:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "system-ui" }}>

      <h2>All Ideas</h2>

      {/* 🔥 Status Filter */}
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

      {/* 🔄 Loading */}
      {loading && <p>Loading ideas...</p>}

      {/* 📦 Idea List */}
      {!loading && ideas.length === 0 && <p>No ideas found.</p>}

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
          <p><strong>Status:</strong> {idea.status}</p>
        </div>
      ))}
    </div>
  );
}