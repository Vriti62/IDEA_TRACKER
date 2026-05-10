import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminInitiatives() {
  const [initiatives, setInitiatives] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitiatives();
  }, []);

  const fetchInitiatives = async () => {
    const res = await api.get("/initiatives");
    setInitiatives(res.data);
  };

  return (
    <div className="dashboard">
      <h2>All Initiatives</h2>

      {initiatives.length === 0 && <p>No initiatives found.</p>}

      {initiatives.map((i) => (
        <div
          key={i.id}
          className="idea-card"
          onClick={() => navigate(`/initiatives/${i.id}`)}
          style={{ cursor: "pointer" }}
        >
          <h3>{i.title}</h3>
          <p>{i.description}</p>

          <span className={`status-pill ${
            i.status === "CLOSED" ? "status-closed" : "status-open"
          }`}>
            {i.status ?? "ONGOING"}
          </span>
        </div>
      ))}
    </div>
  );
}
