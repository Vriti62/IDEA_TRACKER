import { useState, useEffect } from "react";
import api from "../api";
import "../App.css";

export default function CreateIdeaForm() {
  const [title, setTitle] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [potentialSolution, setPotentialSolution] = useState("");
  const [initiativeId, setInitiativeId] = useState("");

  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [initError, setInitError] = useState("")

  useEffect(() => {
    const fetchInitiatives = async () => {
      try {
        setInitError("");
        const res = await api.get("/initiatives/public"); 
        const data = res.data;

        const list = Array.isArray(data) ? data : (data?.content ?? []);
        setInitiatives(list);
      } catch (e) {
        console.error("Initiatives fetch failed:", e);
        setInitiatives([]);
        setInitError(
          e?.response?.status === 403
            ? "You are not allowed to view initiatives (security rule)."
            : "Failed to load initiatives."
        );
      }
    };

  fetchInitiatives();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!title.trim() || !problemStatement.trim()) {
      setErrorMsg("Title and Problem Statement are required.");
      return;
    }

    if (!initiativeId) {
      setErrorMsg("Please select an initiative.");
      return;
    }

    setLoading(true);
    try {
       if (!initiativeId) {
        setErrorMsg("Please select an initiative.");
        return;
      }
      await api.post("/ideas", {
        title: title.trim(),
        problemStatement: problemStatement.trim(),
        potentialSolution: potentialSolution.trim() || null,
        initiativeId: Number(initiativeId)
      });

      setSuccessMsg("Idea submitted successfully!");
      setTitle("");
      setProblemStatement("");
      setPotentialSolution("");
      setInitiativeId("");
    } catch {
      setErrorMsg("Something went wrong while submitting idea.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-glass-card form-glass-large">
        <h2 className="login-title">Create New Idea</h2>
        <p className="login-subtitle">
          Submit your idea under an initiative.
        </p>

        <form onSubmit={handleSubmit}>
          {/*  Initiative Dropdown */}
          <div className="login-field">
            <label>Initiative *</label>
            <select
              value={initiativeId}
              onChange={(e) => setInitiativeId(e.target.value)}
              required
            >
              <option value="">Select an initiative</option>
              {initiatives.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.title}
                </option>
              ))}
            </select>
          </div>

          <div className="login-field">
            <label>Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a catchy title"
            />
          </div>

          <div className="login-field">
            <label>Problem Statement *</label>
            <textarea
              rows={4}
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              placeholder="Describe the problem your idea solves"
            />
          </div>

          <div className="login-field">
            <label>Potential Solution (optional)</label>
            <textarea
              rows={3}
              value={potentialSolution}
              onChange={(e) => setPotentialSolution(e.target.value)}
              placeholder="Describe how you would solve this problem"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Idea"}
          </button>

          {successMsg && <p className="login-success">{successMsg}</p>}
          {errorMsg && <p className="login-error">{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
}