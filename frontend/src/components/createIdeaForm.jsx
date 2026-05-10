import { useState } from "react";
import api from "../api";
import "../App.css";

export default function CreateIdeaForm() {
  const [title, setTitle] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [potentialSolution, setPotentialSolution] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!title.trim() || !problemStatement.trim()) {
      setErrorMsg("Title and Problem Statement are required.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/ideas", {
        title: title.trim(),
        problemStatement: problemStatement.trim(),
        potentialSolution: potentialSolution.trim() || null,
      });

      setSuccessMsg("✅ Idea submitted successfully!");
      setTitle("");
      setProblemStatement("");
      setPotentialSolution("");
    } catch {
      setErrorMsg("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-glass-card form-glass-large">
        <h2 className="login-title">Create New Idea</h2>
        <p className="login-subtitle">
          Share your idea and help drive innovation.
        </p>

        <form onSubmit={handleSubmit}>
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
