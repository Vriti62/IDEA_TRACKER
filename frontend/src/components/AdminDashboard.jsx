import { useEffect, useState } from "react";
import api from "../api";

export default function AdminDashboard() {
  const [initiatives, setInitiatives] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    fetchInitiatives();
    fetchReviewers();
  }, []);

  const fetchInitiatives = async () => {
    const res = await api.get("/initiatives");
    setInitiatives(res.data);
  };

  const fetchReviewers = async () => {
    const res = await api.get("/users?role=REVIEWER");
    setReviewers(res.data);
  };

  const assignReviewers = async (initiativeId) => {
    const reviewerIds = selected[initiativeId];
    if (!reviewerIds || reviewerIds.length === 0) {
      alert("Select reviewer(s)");
      return;
    }

    await api.patch(`/initiatives/${initiativeId}/assign`, {
      reviewerIds
    });

    alert("✅ Reviewers assigned");
  };

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>

      {initiatives.map((i) => (
        <div key={i.id} className="idea-card">
          <h3>{i.title}</h3>
          <p>{i.description}</p>

          <select
            multiple
            onChange={(e) =>
              setSelected(prev => ({
                ...prev,
                [i.id]: Array.from(e.target.selectedOptions)
                               .map(o => Number(o.value))
              }))
            }
          >
            {reviewers.map(r => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <button
            className="btn-primary btn-hero"
            onClick={() => assignReviewers(i.id)}
          >
            Assign Reviewers
          </button>
        </div>
      ))}
    </div>
  );
}