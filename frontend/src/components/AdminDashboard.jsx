import { useEffect, useMemo, useState } from "react";
import api from "../api";
import AddReviewerModal from "./AddReviewerModal";
import "../App.css";

export default function AdminDashboard() {
  const [initiatives, setInitiatives] = useState([]);
  const [users, setUsers] = useState([]);

  // per-initiative selections + messages
  const [selectedByInit, setSelectedByInit] = useState({}); 
  const [msgByInit, setMsgByInit] = useState({}); 
  const [loadingByInit, setLoadingByInit] = useState({}); 
  const [showAddReviewer, setShowAddReviewer] = useState(false);
  const [dropdownOpenByInit, setDropdownOpenByInit] = useState({});


  useEffect(() => {
    fetchInitiatives();
    fetchUsers();
  }, []);

  
  const fetchInitiatives = async () => {
    const res = await api.get("/initiatives"); // admin endpoint
    setInitiatives(Array.isArray(res.data) ? res.data : res.data?.content ?? []);
  };

  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers(Array.isArray(res.data) ? res.data : res.data?.content ?? []);
  };

  // only reviewers in dropdown
  const reviewers = useMemo(() => {
    return users.filter(u => String(u.role || "").toUpperCase() === "REVIEWER");
  }, [users]);

  const onChangeReviewers = (initiativeId, e) => {
    const ids = Array.from(e.target.selectedOptions).map(o => Number(o.value));
    setSelectedByInit(prev => ({ ...prev, [initiativeId]: ids }));
  };

  const toggleDropdown = (id) => {
    setDropdownOpenByInit(prev => ({ ...prev, [id]: !prev[id] }));
  };

const assignReviewers = async (initiativeId) => {
  const reviewerIds = selectedByInit[initiativeId] || [];

  if (reviewerIds.length === 0) {
    setMsgByInit(prev => ({
      ...prev,
      [initiativeId]: "Select at least 1 reviewer"
    }));
    return;
  }

  try {
    setLoadingByInit(prev => ({ ...prev, [initiativeId]: true }));
    setMsgByInit(prev => ({ ...prev, [initiativeId]: "" }));


    await api.patch(`/initiatives/${initiativeId}/assign`, {
      reviewerIds
    });

    setMsgByInit(prev => ({
      ...prev,
      [initiativeId]: "Reviewers assigned"
    }));

    setDropdownOpenByInit(prev => ({ ...prev, [initiativeId]: false }));
    await fetchInitiatives();

  } catch (err) {
    console.error(err);
    setMsgByInit(prev => ({
      ...prev,
      [initiativeId]: "Assign failed (check backend logs)"
    }));
  } finally {
    setLoadingByInit(prev => ({ ...prev, [initiativeId]: false }));
  }
};

  return (
    <div className="home-frame">
      <section className="hero-dark" style={{ gridTemplateColumns: "1fr" }}>
        <div className="hero-card">
          <div className="overview-top">
            <p className="overview-title">Admin Dashboard</p>
            <div className="overview-select">Initiatives</div>
          </div>

            <button
              className="btn-primary btn-hero"
              style={{ width: '200px', height: '50px', marginBottom: 20 }}
              onClick={() => setShowAddReviewer(true)}
              >
              + Add Reviewer
          </button>
            {showAddReviewer && (
        <AddReviewerModal
          onClose={() => setShowAddReviewer(false)}
          onSuccess={fetchUsers}
        />
      )}

          {initiatives.length === 0 && (
            <p className="chart-loading">No initiatives found.</p>
          )}

          {initiatives.map((i) => (
            <div key={i.id} className="ai-summary-card" style={{ marginTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ margin: 0 }}>{i.title}</h3>
                  <p style={{ margin: "6px 0 0", color: "rgba(0, 11, 26, 0.78)" }}>{i.description}</p>
                </div>

                <span className="status-pill status-open">
                  {i.status ? String(i.status) : "ONGOING"}
                </span>
              </div>

              <div className="dropdown">
  <button
    className="dropdown-trigger"
    onClick={() => toggleDropdown(i.id)}
  >
    {selectedByInit[i.id]?.length
      ? `${selectedByInit[i.id].length} reviewer(s) selected`
      : "Select reviewers"}
    ▾
  </button>

                {dropdownOpenByInit[i.id] && (
                  <div className="dropdown-menu">
                    {reviewers.map(r => {
                      const checked = (selectedByInit[i.id] || []).includes(r.id);
                      return (
                        <label key={r.id} className="dropdown-item">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setSelectedByInit(prev => {
                                const current = prev[i.id] || [];
                                return {
                                  ...prev,
                                  [i.id]: checked
                                    ? current.filter(x => x !== r.id)
                                    : [...current, r.id]
                                };
                              })
                            }
                          />
                          {r.username}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
              <button
                className="btn-primary btn-hero"
                onClick={() => assignReviewers(i.id)}
            disabled={loadingByInit[i.id]}
              >
                {loadingByInit[i.id] ? "Assigning..." : "Assign Reviewers"}
              </button>

              {msgByInit[i.id] && (
                <p className={msgByInit[i.id]?.toLowerCase().includes("failed") ? "login-error" : "login-success"}>
                  {msgByInit[i.id]}
                </p>

              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}