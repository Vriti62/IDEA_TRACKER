import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import ReactMarkdown from "react-markdown";

export default function IdeaDetail() {
  const { id } = useParams();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIdea = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/ideas/${id}`);
        setIdea(res.data);
      } catch (err) {
        setError(err?.response?.data || "Could not load idea details.");
      } finally {
        setLoading(false);
      }
    };

    fetchIdea();
  }, [id]);

  const formatDate = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleString();
  };

  return (
    <div className="idea-detail-page">
      <div className="detail-header">
        <div>
          <Link to="/" className="detail-back-link">← Back to dashboard</Link>
          <h1>{idea?.title || "Idea details"}</h1>
          <p className="detail-subtitle">A clear view of the idea, status, author, and review context.</p>
        </div>
        <div className="detail-status-block">
          {idea?.status && (
            <span className={`status-badge status-${idea.status.toLowerCase().replace('_', '-')}`}>
              {idea.status.replace('_', ' ')}
            </span>
          )}
          {/* <Link to={`/ideas/${id}`} target="_blank" rel="noreferrer" className="btn-primary detail-button">
            Open in new tab
          </Link> */}
        </div>
      </div>

      {loading && <p className="empty-state">Loading idea details...</p>}
      {error && <p className="empty-state">{error}</p>}

      {idea && (
        <div className="detail-grid">
          <section className="detail-main-card">
            <div className="detail-metadata">
              <div>
                <span className="detail-label">Posted by</span>
                <p>{idea.createdBy || idea.createdByName || "Anonymous"}</p>
              </div>
              <div>
                <span className="detail-label">Created</span>
                <p>{formatDate(idea.createdAt)}</p>
              </div>
              <div>
                <span className="detail-label">Last updated</span>
                <p>{formatDate(idea.updatedAt)}</p>
              </div>
            </div>

            <div className="detail-section">
              <h2>Problem statement</h2>
              <p>{idea.problemStatement}</p>
            </div>

            <div className="detail-section">
              <h2>Potential solution</h2>
              <p>{idea.potentialSolution || "No solution provided yet."}</p>
            </div>

            {/* <div className="detail-section">
              <h2>AI review insight</h2>
              {idea.aiSummary ? (
                <ReactMarkdown>{idea.aiSummary}</ReactMarkdown>
              ) : (
                <p className="muted">This idea has not been analyzed by AI yet.</p>
              )}
            </div> */}
          </section>

          <aside className="detail-sidebar-card">
            <div className="detail-sidebar-block">
              <h3>Review history</h3>
              <p className="muted">No reviewer scores are available yet. As reviewers submit their feedback, this area will show scores, comments, and reviewer names.</p>
            </div>

            <div className="detail-sidebar-block">
              <h3>Recent activity</h3>
              <ul className="activity-list">
                <li>Idea created</li>
                <li>Awaiting reviewer assignment</li>
                <li>AI summary available when review begins</li>
              </ul>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
