import { useState } from "react";
import CreateIdeaForm from "./components/CreateIdeaForm";
import IdeaList from "./components/IdeaList";
import AssignReviewers from "./components/AssignReviewer";
import CreateInitiative from "./components/CreateInitiative";
import "./App.css";

function App() {
  const [view, setView] = useState("ideas");
    const role = "ADMIN"; // or REVIEWER
  return (
    <div>

      {/*  NAVBAR */}
      <nav style={styles.navbar}>
        <h2>💡 IdeaTracker</h2>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setView("ideas")}>Ideas</button>
          <button onClick={() => setView("createIdea")}>Create Idea</button>
          <button onClick={() => setView("createInitiative")}>Create Initiative</button>
          <button onClick={() => setView("assign")}>Assign Reviewers</button>
        </div>
      </nav>

      {/* HERO */}
      <header style={styles.hero}>
        <h1>Submit & Manage AI Ideas</h1>
        <p>AI-powered idea tracking system</p>
      </header>

      {/* MAIN */}
      <main style={{ padding: "20px" }}>
        {view === "ideas" && <IdeaList />}
        {view === "createIdea" && <CreateIdeaForm />}
        {view === "createInitiative" && <CreateInitiative />}
        {view === "assign" && <AssignReviewers />}
      </main>

    </div>
  );

{role === "ADMIN" && <CreateInitiative />}
{role === "ADMIN" && <AssignReviewers />}
{role === "REVIEWER" && <ReviewerDashboard />}
}

export default App;

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    background: "#1e293b",
    color: "white",
  },
  hero: {
    textAlign: "center",
    padding: "40px",
    background: "#f1f5f9",
  },
};