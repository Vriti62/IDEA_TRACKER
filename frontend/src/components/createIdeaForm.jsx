import { useState, useEffect } from "react";
import api from "../api";
import "../App.css";

export default function CreateIdeaForm() {
  const [initiativeId, setInitiativeId] = useState("");
  const[title, setTitle] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [potentialSolution, setPotentialSolution] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [initiatives, setInitiatives] = useState([]);

  const [excelLoading, setExcelLoading] = useState(false);
  const [excelResult, setExcelResult] = useState(null); // {created, skipped, errors[]}

  const [initError, setInitError] = useState("");

  const fetchInitiatives = async () => {
    try {
      setInitError("");
      const res = await api.get("/initiatives");
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

  useEffect(() => {
    fetchInitiatives();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    setExcelResult(null);

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
    } catch (e) {
      setErrorMsg(
        e?.response?.data?.message ||
        e?.response?.data ||
        "Something went wrong while submitting idea."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ USERS UPLOAD IDEAS VIA EXCEL
   * Calls: POST /api/ideas/parse-excel
   * Backend should return: { created, skipped, errors: [] }
   */
  const handleIdeasExcelUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setExcelLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    setExcelResult(null);

    try {
      const res = await api.post("/ideas/parse-excel", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setExcelResult(res.data);
      setSuccessMsg("Ideas uploaded successfully via Excel!");
    } catch (e) {
      setErrorMsg(
        e?.response?.data?.message ||
        e?.response?.data ||
        "Failed to upload ideas Excel."
      );
    } finally {
      setExcelLoading(false);
      // reset file input so user can re-upload same file if needed
      e.target.value = "";
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-glass-card form-glass-large">
        <h2 className="login-title">Create New Idea</h2>
        <p className="login-subtitle">Submit your idea under an initiative.</p>

        {/* ✅ Excel upload for USERS: bulk ideas */}
        <div className="login-field">
          <label>Upload Ideas via Excel (.xlsx)</label>
          <input type="file" accept=".xlsx" onChange={handleIdeasExcelUpload} />
          {excelLoading && <small>Uploading & processing Excel…</small>}
        </div>

        {excelResult && (
          <div className="ai-summary-card" style={{ marginBottom: 16 }}>
            <strong>Excel Upload Summary</strong>
            <div className="ai-summary-text">
              <p>Created: {excelResult.created ?? 0}</p>
              <p>Skipped: {excelResult.skipped ?? 0}</p>
              {Array.isArray(excelResult.errors) && excelResult.errors.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <p style={{ marginBottom: 6 }}><strong>Errors:</strong></p>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {excelResult.errors.slice(0, 10).map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                  {excelResult.errors.length > 10 && (
                    <small>Showing first 10 errors.</small>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Initiative dropdown */}
        <form onSubmit={handleSubmit}>
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
            {initError && <p className="login-error">{initError}</p>}
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