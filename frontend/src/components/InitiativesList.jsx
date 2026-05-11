import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function InitiativesList({ userRole }) {
  const [initiatives, setInitiatives] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [ideasByInit, setIdeasByInit] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitiatives();
  }, []);

  const fetchInitiatives = async () => {
    const res = await api.get("/initiatives/public");
    setInitiatives(res.data || []);
  };

  const fetchIdeas = async (initiativeId) => {
    if (ideasByInit[initiativeId]) return; // already loaded

    const res = await api.get(`/initiatives/${initiativeId}/ideas`);
    setIdeasByInit(prev => ({
      ...prev,
      [initiativeId]: res.data || []
    }));
  };

  return (
    <div className="page-container">
      <h2>Initiatives</h2>

      <div className="initiative-grid">
        {initiatives.map(init => {
          const open = expandedId === init.id;
          const ideas = ideasByInit[init.id] || [];

          return (
            <div key={init.id} className="initiative-card">

              {/* HEADER */}
              <div
                className="initiative-header"
                onClick={async () => {
                  const next = open ? null : init.id;
                  setExpandedId(next);
                  if (!open) await fetchIdeas(init.id);
                }}
              >
                <div>
                  <h3>{init.title}</h3>
                  <p className="initiative-desc">{init.description}</p>
                </div>
                <span className="expand-icon">{open ? "−" : "+"}</span>
              </div>

              {/* USER CTA */}
              {userRole === "USER" && (
                <div className="initiative-actions">
                  <button
                    className="btn-secondary btn-small"
                    onClick={() =>
                      navigate("/create-idea", {
                        state: { initiativeId: init.id },
                      })
                    }
                  >
                    Submit an idea →
                  </button>
                </div>
              )}

              {/* IDEAS UNDER INITIATIVE */}
              {open && (
                <div className="initiative-ideas">
                  {ideas.length === 0 ? (
                    <p className="muted-text">No ideas submitted yet.</p>
                  ) : (
                    ideas.map(idea => (
                      <div key={idea.id} className="idea-mini-card">
                        <strong>{idea.title}</strong>
                        <p className="muted-text">
                          Status: {(idea.status || "OPEN").replace("_", " ")}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}