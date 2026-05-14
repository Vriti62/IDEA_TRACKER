import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import ReactMarkdown from "react-markdown";

export default function IdeaList({ title = "All Ideas", userRole }) {
  const [ideas, setIdeas] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // AI visibility per idea
  const [showAI, setShowAI] = useState({});

  // Expand / collapse states
  const [expandedIdeas, setExpandedIdeas] = useState(new Set());
  const [expandedInitiatives, setExpandedInitiatives] = useState(new Set());

  useEffect(() => {
    fetchIdeas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      let url = "/ideas";
      if (status) url += `?status=${status}`;

      const res = await api.get(url);

      const ideasArray = Array.isArray(res.data)
        ? res.data
        : res.data?.content ?? [];

      setIdeas(ideasArray);

      // auto-expand first initiative
      if (expandedInitiatives.size === 0 && ideasArray.length > 0) {
        const firstKey =
          ideasArray[0]?.initiativeId != null
            ? String(ideasArray[0].initiativeId)
            : "unassigned";
        setExpandedInitiatives(new Set([firstKey]));
      }
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
    setShowAI((prev) => ({ ...prev, [id]: true }));
    fetchIdeas();
  };

  const toggleIdeaExpanded = (id) => {
    setExpandedIdeas((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleInitiativeExpanded = (key) => {
    setExpandedInitiatives((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const groupedByInitiative = useMemo(() => {
    const map = new Map();

    for (const idea of ideas) {
      const key =
        idea.initiativeId != null
          ? String(idea.initiativeId)
          : "unassigned";

      if (!map.has(key)) {
        map.set(key, {
          key,
          initiativeId: idea.initiativeId ?? null,
          initiativeTitle:
            idea.initiativeTitle ||
            (idea.initiativeId != null
              ? `Initiative #${idea.initiativeId}`
              : "Unassigned initiative"),
          ideas: [],
        });
      }

      map.get(key).ideas.push(idea);
    }

    const groups = Array.from(map.values()).sort((a, b) =>
      (a.initiativeTitle || "").localeCompare(b.initiativeTitle || "")
    );

    for (const g of groups) {
      g.ideas.sort((x, y) => {
        const a = x.createdAt ? new Date(x.createdAt).getTime() : 0;
        const b = y.createdAt ? new Date(y.createdAt).getTime() : 0;
        return b - a;
      });
    }

    return groups;
  }, [ideas]);

  const downloadIdeasExcel = async (initiativeId) => {
    if (!initiativeId) return;

    try {
      const res = await api.get(`/ideas/${initiativeId}/export-excel`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ideas_initiative_${initiativeId}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Excel export failed", e);
      alert("Failed to export ideas.");
    }
  };

  return (
    <div className="idea-list">
      <div className="idea-list-header">
        <div>
          <h2>{title}</h2>
          <p>Browse the latest submissions grouped by initiative.</p>
        </div>

        <div className="idea-list-filters">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="status-select"
          >
            <option value="">All statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="UNDER_REVIEW">UNDER REVIEW</option>
            <option value="ACCEPTED">ACCEPTED</option>
          </select>
        </div>
      </div>

      {loading && <p className="empty-state">Loading ideas...</p>}
      {!loading && ideas.length === 0 && (
        <p className="empty-state">No ideas found.</p>
      )}

      <div className="idea-list-grid">
        <div className="idea-list-panel">
          {groupedByInitiative.map((group) => {
            const isGroupExpanded = expandedInitiatives.has(group.key);

            return (
              <div key={group.key} className="initiative-group">
               
                <div
                  className="initiative-group-header"
                  onClick={() => toggleInitiativeExpanded(group.key)}
                  role="button"
                >
                  <div className="initiative-group-title">
                    <h3>{group.initiativeTitle}</h3>
                    <p className="muted">{group.ideas.length} idea(s)</p>
                  </div>

                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {group.initiativeId && (
                      <button
                        className="btn-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadIdeasExcel(group.initiativeId);
                        }}
                      >
                        Export Ideas (Excel)
                      </button>
                    )}
                    <div className="initiative-group-chevron">
                      {isGroupExpanded ? "▾" : "▸"}
                    </div>
                  </div>
                </div>

               
                {isGroupExpanded && (
                  <div className="initiative-group-body">
                    {group.ideas.map((idea) => {
                      const isIdeaExpanded = expandedIdeas.has(idea.id);
                      const aiVisible = !!showAI[idea.id];

                      return (
                        <div key={idea.id} className="idea-card">
                          <div
                            className="idea-card-header"
                            onClick={() => toggleIdeaExpanded(idea.id)}
                          >
                            <div className="idea-card-title">
                              <h4>{idea.title}</h4>
                              <p>{idea.type || "Idea submission"}</p>
                            </div>

                            <span
                              className={`status-badge status-${(idea.status || "OPEN")
                                .toLowerCase()
                                .replace("_", "-")}`}
                            >
                              {(idea.status || "OPEN").replace("_", " ")}
                            </span>
                          </div>

                          {isIdeaExpanded && (
                            <div className="idea-card-body">
                              <p>
                                <strong>Problem:</strong> {idea.problemStatement}
                              </p>

                              {idea.potentialSolution && (
                                <p>
                                  <strong>Solution:</strong>{" "}
                                  {idea.potentialSolution}
                                </p>
                              )}

                              <div className="idea-card-actions">
                                <Link
                                  to={`/ideas/${idea.id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn-primary"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  View details
                                </Link>

                                {userRole === "REVIEWER" && (
                                  <button
                                    className="btn-secondary"
                                    disabled={aiVisible}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      analyzeIdea(idea.id);
                                    }}
                                  >
                                    {aiVisible ? "Analyzed" : "Analyze with AI"}
                                  </button>
                                )}

                                {userRole === "ADMIN" && (
                                  <select
                                    value={idea.status || "OPEN"}
                                    onChange={(e) =>
                                      updateStatus(idea.id, e.target.value)
                                    }
                                    className="status-select"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <option value="OPEN">OPEN</option>
                                    <option value="UNDER_REVIEW">
                                      UNDER REVIEW
                                    </option>
                                    <option value="ACCEPTED">ACCEPTED</option>
                                  </select>
                                )}
                              </div>

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
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}