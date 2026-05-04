import { useEffect, useState } from "react";
import api from "../api";

export default function ReviewerDashboard() {
  const [initiatives, setInitiatives] = useState([]);

  const userId = 2; // hardcode for now

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await api.get(`/initiatives/reviewer/${userId}`);
    setInitiatives(res.data);
  };

  return (
    <div>
      <h2>My Initiatives</h2>

      {initiatives.map((i) => (
        <div key={i.id}>
          <h3>{i.title}</h3>
          <p>{i.description}</p>
        </div>
      ))}
    </div>
  );
}