import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import ReactMarkdown from "react-markdown";

export default function IdeaList({ title = "All Ideas", userRole }) {
  const [ideas, setIdeas] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzedIdeas, setAnalyzedIdeas] = useState(new Set());
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

      console.log("RAW /ideas RESPONSE:", res.data);

      const ideasArray = Array.isArray(res.data)
          ? res.data
          : res.data?.content ?? [];

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
    setAnalyzedIdeas(prev => new Set(prev).add(id));
    fetchIdeas();
  };

  const toggleExpanded = (id) => {
    setExpandedIdeas(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const initiativeWinners = [
    { title: 'Q2 Innovation Sprint', team: 'Automation Hub', score: '94 pts' },
    { title: 'Green Process Reset', team: 'Sustainability Crew', score: '89 pts' },
    { title: 'Customer Pulse AI', team: 'CX Insights', score: '83 pts' },
  ];

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
            return (
              <div key={idea.id} className="idea-card">
                <div className="idea-card-header" onClick={() => toggleExpanded(idea.id)}>
                  <div className="idea-card-title">
                    <h3>{idea.title}</h3>
                    <p>{idea.type || 'Idea submission'}</p>
                  </div>
                  <div className="idea-card-meta">
                    <span className={`status-badge status-${(idea.status || 'OPEN').toLowerCase().replace('_', '-')}`}>
                      {(idea.status || 'OPEN').replace('_', ' ')}
                    </span>
                    {/* <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span> */}
                  </div>
                </div>
{/* 
                {isExpanded && ( */}
                  {(
                  <div className="idea-card-body">
                    <p><strong>Problem:</strong> {idea.problemStatement}</p>
                    {idea.potentialSolution && <p><strong>Solution:</strong> {idea.potentialSolution}</p>}

                    <div className="idea-card-actions">
                      <Link to={`/ideas/${idea.id}`} target="_blank" rel="noreferrer" className="btn-primary detail-button">
                        View details
                      </Link>
                      {userRole === 'REVIEWER' && (
                        <button className="btn-secondary" onClick={() => analyzeIdea(idea.id)}>
                          Analyze with AI
                        </button>
                      )}
                      {userRole === 'ADMIN' && (
                        <select
                          value={idea.status || 'OPEN'}
                          onChange={(e) => updateStatus(idea.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="OPEN">OPEN</option>
                          <option value="UNDER_REVIEW">UNDER REVIEW</option>
                          <option value="ACCEPTED">ACCEPTED</option>
                        </select>
                      )}
                    </div>

                    {analyzedIdeas.has(idea.id) && idea.aiSummary && (
                      <div className="ai-summary-card">
                        <strong>AI Insight:</strong>
                        <ReactMarkdown>{idea.aiSummary}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <aside className="initiative-sidebar">
          <div className="initiative-card">
            <div className="initiative-card-heading">
              <span className="eyebrow">Top initiative</span>
              <h3>Initiative winners</h3>
              <p>Latest winning teams from the current review cycle.</p>
            </div>

            <div className="winner-list">
              {initiativeWinners.map((winner, index) => (
                <div key={index} className="winner-item">
                  <div>
                    <strong>{winner.title}</strong>
                    <p>{winner.team}</p>
                  </div>
                  <span className="score-pill">{winner.score}</span>
                </div>
              ))}
            </div>

            <div className="initiative-footer">
              <div className="summary-pill">3 winners</div>
              <div className="summary-pill secondary">Highlights powered by review analytics</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}