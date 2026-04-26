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
        <div style={{ maxWidth: 640, margin: "40px auto", fontFamily: "system-ui" }}>
            <h2>Create Idea</h2>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                />

                <textarea
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    placeholder="Problem Statement"
                />

                <textarea
                    value={potentialSolution}
                    onChange={(e) => setPotentialSolution(e.target.value)}
                    placeholder="Solution (optional)"
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Idea"}
                </button>

                {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}
                {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
            </form>
        </div>
    );
}