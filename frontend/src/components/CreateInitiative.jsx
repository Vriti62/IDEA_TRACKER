import { useState } from "react";
import api from "../api";
import "../App.css";

export default function CreateInitiative() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [excelLoading, setExcelLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!title.trim() || !description.trim()) {
      setErrorMsg("Title and Description are required.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/initiatives", {
        title: title.trim(),
        description: description.trim(),
      });

      setSuccessMsg("Initiative created successfully!");
      setTitle("");
      setDescription("");
    } catch (e) {
      setErrorMsg("Something went wrong while creating initiative.", e);
    } finally {
      setLoading(false);
    }
  };

  //excel
  const handleInitiativeExcelUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  setExcelLoading(true);
  setErrorMsg("");
  try {
    const res = await api.post("/initiatives/parse-excel", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    const data = res.data;

    // autofill fields
    setTitle(data.title || "");
    setDescription(data.description || "");
  } catch (e) {
    setErrorMsg("Failed to read Excel file.",e);
  } finally {
    setExcelLoading(false);
  }
};

  return (
    <div className="login-overlay">
      <div className="login-glass-card form-glass-large">
        <h2 className="login-title">Create New Initiative</h2>
        <p className="login-subtitle">
          Define an initiative to collect and evaluate ideas.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="login-field">

            
          <label>Upload Initiative via Excel (.xlsx)</label>
            <input
              type="file"
              accept=".xlsx"
              onChange={handleInitiativeExcelUpload}
            />
            {excelLoading && <small>Reading Excel…</small>}

            <label>Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter initiative title"
            />
          </div>

          <div className="login-field">
            <label>Description *</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the initiative purpose"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Initiative"}
          </button>

          {successMsg && <p className="login-success">{successMsg}</p>}
          {errorMsg && <p className="login-error">{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
}