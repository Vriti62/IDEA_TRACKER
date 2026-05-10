import { useEffect, useMemo, useState } from "react";
import api from "../api";
import IdeasOverTimeChart from "./IdeasOverTime";

export default function ReviewerDashboard() {
  const [ideas, setIdeas] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);

  // review form state per idea
  const [scoreById, setScoreById] = useState({});
  const [commentById, setCommentById] = useState({});
  const [msgById, setMsgById] = useState({});
  const [reviewsByIdea, setReviewsByIdea] = useState({}); // { [ideaId]: ReviewResponse[] }

  useEffect(() => {
    fetchAssignedIdeas();
  }, []);

  const fetchAssignedIdeas = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reviewer/ideas");
      const list = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
      setIdeas(list);
    } catch (e) {
      console.error("Failed to load assigned ideas:", e);
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  const analyzeIdea = async (id) => {
    try {
      await api.post(`/ideas/${id}/analyze`);
      setMsgById((prev) => ({ ...prev, [id]: "AI analysis complete" }));
      await fetchAssignedIdeas(); // refresh so aiSummary updates
    } catch (e) {
      console.error(e);
      setMsgById((prev) => ({ ...prev, [id]: "AI analysis failed" }));
    }
  };

  const submitReview = async (id) => {
    const score = Number(scoreById[id]);
    const comment = (commentById[id] || "").trim();

    if (!score || score < 1 || score > 10) {
      setMsgById((prev) => ({ ...prev, [id]: " Score must be between 1 and 10" }));
      return;
    }
    if (!comment) {
      setMsgById((prev) => ({ ...prev, [id]: " Comment is required" }));
      return;
    }

    try {
      await api.post(`/ideas/${id}/review`, { score, comment });
      setMsgById((prev) => ({ ...prev, [id]: "Review submitted" }));
      await fetchReviews(id);
    } catch (e) {
      console.error(e);
      setMsgById((prev) => ({ ...prev, [id]: " Review submit failed (auth/role?)" }));
    }
  };

  const fetchReviews = async (ideaId) => {
    try {
      const res = await api.get(`/ideas/${ideaId}/reviews`);
      const list = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
      setReviewsByIdea((prev) => ({ ...prev, [ideaId]: list }));
    } catch (e) {
      console.error(e);
      setReviewsByIdea((prev) => ({ ...prev, [ideaId]: [] }));
    }
  };

  const chartData = useMemo(() => {
    // “Ideas assigned over time” chart based on createdAt if available
    const grouped = ideas.reduce((acc, item) => {
      const createdAt = item.createdAt || item.created_at;
      if (!createdAt) return acc;
      const label = new Date(createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(grouped).map((d) => ({ date: d, count: grouped[d] }));
  }, [ideas]);

  return (
    <div className="home-frame">
      <section className="hero-dark" style={{ gridTemplateColumns: "1fr" }}>
        <div className="hero-card">
          <div className="overview-top">
            <p className="overview-title">Reviewer Dashboard</p>
            <div className="overview-select">Assigned Ideas</div>
          </div>

          <div className="chart-panel">
            <IdeasOverTimeChart data={chartData} />
          </div>

          {loading && <p className="chart-loading">Loading assigned ideas…</p>}
          {!loading && ideas.length === 0 && <p className="chart-loading">No ideas assigned yet.</p>}

          {!loading &&
            ideas.map((idea) => {
              const open = expandedId === idea.id;
              const reviews = reviewsByIdea[idea.id] || [];

              return (
                <div key={idea.id} className="idea-card" style={{ marginTop: 14 }}>
                  <div
                    className="idea-card-header"
                    onClick={async () => {
                      const next = open ? null : idea.id;
                      setExpandedId(next);
                      if (!open) await fetchReviews(idea.id);
                    }}
                  >
                    <div className="idea-card-title">
                      <h3 style={{ margin: 0 }}>{idea.title}</h3>
                      <p style={{ margin: "6px 0 0" }}>{(idea.status || "OPEN").replace("_", " ")}</p>
                    </div>
                    <div className="expand-icon">{open ? "−" : "+"}</div>
                  </div>

                  {open && (
                    <div className="idea-card-body">
                      <p><strong>Problem:</strong> {idea.problemStatement}</p>
                      {idea.potentialSolution && <p><strong>Solution:</strong> {idea.potentialSolution}</p>}

                      {/* AI Insight */}
                      {idea.aiSummary && (
                        <div className="ai-summary-card">
                          <strong>AI Insight:</strong>
                          <p style={{ marginTop: 8 }}>{idea.aiSummary}</p>
                        </div>
                      )}

                      <div className="idea-card-actions">
                        <button className="btn-primary btn-hero" onClick={() => analyzeIdea(idea.id)}>
                          Analyze with AI
                        </button>
                      </div>

                      {/* Review Form */}
                      <div className="ai-summary-card">
                        <h4 style={{ marginTop: 0 }}>Submit Review</h4>

                        <div className="login-field">
                          <label>Score (1–10)</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={scoreById[idea.id] || ""}
                            onChange={(e) =>
                              setScoreById((prev) => ({ ...prev, [idea.id]: e.target.value }))
                            }
                            placeholder="e.g., 8"
                          />
                        </div>

                        <div className="login-field">
                          <label>Reviewer Comment</label>
                          <textarea
                            rows={4}
                            value={commentById[idea.id] || ""}
                            onChange={(e) =>
                              setCommentById((prev) => ({ ...prev, [idea.id]: e.target.value }))
                            }
                            placeholder="Write feedback the user/admin can read…"
                          />
                        </div>

                        <button className="btn-primary btn-hero" onClick={() => submitReview(idea.id)}>
                          Submit Review
                        </button>

                        {msgById[idea.id] && (
                          <p className="login-success">
                            {msgById[idea.id]}
                          </p>
                        )} 
                      </div>

                      {/* Existing reviews (visible to reviewer too) */}
                      <div className="ai-summary-card">
                        <h4 style={{ marginTop: 0 }}>Existing Reviews</h4>
                        {reviews.length === 0 ? (
                          <p style={{ margin: 0 }}>No reviews yet.</p>
                        ) : (
                          reviews.map((r) => (
                            <div key={r.id} style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                              <p style={{ margin: 0 }}>
                                <strong>{r.reviewerName}</strong> — <strong>{r.score}/10</strong>
                              </p>
                              <p style={{ margin: "6px 0 0" }}>{r.comment}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}
``