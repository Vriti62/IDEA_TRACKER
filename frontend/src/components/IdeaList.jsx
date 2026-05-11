import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import ReactMarkdown from "react-markdown";

export default function IdeaList({ title = "All Ideas", userRole }) {
  const [ideas, setIdeas] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  //  AI visibility per idea (button controlled)
  const [showAI, setShowAI] = useState({});

  //  expand / collapse per idea
  const [expandedIdeas, setExpandedIdeas] = useState(new Set());

  useEffect(() => {
    fetchIdeas();
  }, [status]);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      let url = "/ideas";
      if (status) url += `?status=${status}`;

      const res = await api.get(url);
      const ideasArray = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
      setIdeas(ideasArray);
    } catch (err) {
      console.error("Error fetching ideas:", err);
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    await api.patch(`/ideas/${id}/status`, { status: newStatus });
    fetchIdeas();
  };

  const analyzeIdea = async (id) => {
    await api.post(`/ideas/${id}/analyze`);
    setShowAI(prev => ({ ...prev, [id]: true }));
    fetchIdeas();
  };

  const toggleExpanded = (id) => {
    setExpandedIdeas(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="idea-list">
      <div className="idea-list-header">
        <div>
          <h2>{title}</h2>
          <p>Browse the latest submissions with clear cards and quick actions.</p>
        </div>
      </div>

      {loading && <p className="empty-state">Loading ideas...</p>}
      {!loading && ideas.length === 0 && <p className="empty-state">No ideas found.</p>}

      <div className="idea-list-grid">
        <div className="idea-list-panel">
          {ideas.map((idea) => {
            const isExpanded = expandedIdeas.has(idea.id);
            const aiVisible = !!showAI[idea.id];

            return (
              <div key={idea.id} className="idea-card">
                <div className="idea-card-header" onClick={() => toggleExpanded(idea.id)}>
                  <div className="idea-card-title">
                    <h3>{idea.title}</h3>
                    <p>{idea.type || "Idea submission"}</p>
                  </div>

                  <span className={`status-badge status-${(idea.status || "OPEN").toLowerCase().replace("_", "-")}`}>
                    {(idea.status || "OPEN").replace("_", " ")}
                  </span>
                </div>

                {isExpanded && (
                  <div className="idea-card-body" key={`body-${idea.id}-${aiVisible ? "ai" : "no-ai"}`}>
                    <p><strong>Problem:</strong> {idea.problemStatement}</p>
                    {idea.potentialSolution && <p><strong>Solution:</strong> {idea.potentialSolution}</p>}

                    <div className="idea-card-actions">
                      <Link
                        to={`/ideas/${idea.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary"
                      >
                        View details
                      </Link>

                      {userRole === "REVIEWER" && (
                        <button
                          className="btn-secondary"
                          disabled={aiVisible}
                          onClick={() => analyzeIdea(idea.id)}
                        >
                          {aiVisible ? "Analyzed" : "Analyze with AI"}
                        </button>
                      )}

                      {userRole === "ADMIN" && (
                        <select
                          value={idea.status || "OPEN"}
                          onChange={(e) => updateStatus(idea.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="OPEN">OPEN</option>
                          <option value="UNDER_REVIEW">UNDER REVIEW</option>
                          <option value="ACCEPTED">ACCEPTED</option>
                        </select>
                      )}
                    </div>

                    {/* ✅ STRICT button-controlled AI */}
                    {aiVisible && (
                      <div className="ai-summary-card">
                        <strong>AI Insight</strong>
                        <div className="ai-summary-text">
                          <ReactMarkdown>
                            {idea.aiSummary || "Analyzing idea…"}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* sidebar can stay as you have */}
      </div>
    </div>
  );
}
