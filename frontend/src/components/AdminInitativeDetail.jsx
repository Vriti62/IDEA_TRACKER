import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

export default function AdminInitiativeDetail() {
  const { id } = useParams();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchIdeas();
  }, [id]);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/initiatives/${id}/ideas`);
      setIdeas(res.data);
    } catch (e) {
      console.error(e);
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <Link to="/initiatives">← Back to Initiatives</Link>

      <h2>Ideas in this Initiative</h2>

      {loading && <p>Loading ideas…</p>}

      {!loading && ideas.length === 0 && (
        <p>No ideas submitted yet.</p>
      )}

      {ideas.map((idea) => (
        <div key={idea.id} className="idea-card">
          <h3>{idea.title}</h3>
          <p>{idea.problemStatement}</p>
          <p><strong>Status:</strong> {idea.status}</p>

          {/* Reviewer remarks */}
          <h4>Reviewer Remarks</h4>
          {idea.reviews && idea.reviews.length > 0 ? (
            idea.reviews.map((r) => (
              <div key={r.id} className="ai-summary-card">
                <strong>{r.reviewerName}</strong> — {r.score}/10
                <p>{r.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      ))}
    </div>
  );
}