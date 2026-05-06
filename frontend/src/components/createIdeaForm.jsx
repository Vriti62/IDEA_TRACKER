import { useState } from "react";
import api from "../api.js";

export default function CreateIdeaForm() {
    const [title, setTitle] = useState("");
    const [problemStatement, setProblemStatement] = useState("");
    const [potentialSolution, setPotentialSolution] = useState("");

    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const resetMessages = () => {
        setSuccessMsg("");
        setErrorMsg("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        resetMessages();

        if (!title.trim() || !problemStatement.trim()) {
            setErrorMsg("Title and Problem Statement are required.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                title: title.trim(),
                problemStatement: problemStatement.trim(),
                potentialSolution: potentialSolution.trim() || null,
            };

            const res = await api.post("/ideas", payload);

            setSuccessMsg(`Idea added! `);

            setTitle("");
            setProblemStatement("");
            setPotentialSolution("");
        } catch (err) {
            const apiMsg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Something went wrong.";
            setErrorMsg(apiMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-h)' }}>Create New Idea</h2>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.5rem" }}>
                <div className="form-group">
                    <label>Title *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a catchy title for your idea"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Problem Statement *</label>
                    <textarea
                        value={problemStatement}
                        onChange={(e) => setProblemStatement(e.target.value)}
                        placeholder="Describe the problem your idea solves"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Potential Solution (optional)</label>
                    <textarea
                        value={potentialSolution}
                        onChange={(e) => setPotentialSolution(e.target.value)}
                        placeholder="Describe how you would solve this problem"
                    />
                </div>

                <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>
                    {loading ? "Submitting..." : "Submit Idea"}
                </button>

                {successMsg && <p style={{ color: "#28a745", textAlign: "center", marginTop: "1rem" }}>{successMsg}</p>}
                {errorMsg && <p style={{ color: "#dc3545", textAlign: "center", marginTop: "1rem" }}>{errorMsg}</p>}
            </form>
        </div>
    );
}