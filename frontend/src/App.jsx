import { useState } from "react";
import CreateIdeaForm from "./components/CreateIdeaForm";
import IdeaList from "./components/IdeaList";
import "./App.css";

function App() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      {/*navbar*/}
      <nav style={styles.navbar}>
        <h2 style={{ margin: 0 }}>💡 IdeaTracker</h2>
        <button
          style={styles.button}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "View Ideas" : "Create Idea"}
        </button>
      </nav>

      <header style={styles.hero}>
        <h1>Submit & Manage AI Ideas</h1>
        <p>
          A centralized platform to track automation ideas, review them,
          and bring innovation to life.
        </p>
      </header>

      <main style={{ padding: "20px" }}>
        {showForm ? <CreateIdeaForm /> : <IdeaList />}
      </main>

    </div>
  );
}

export default App;

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "#1e293b",
    color: "white",
  },
  button: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
  },
  hero: {
    textAlign: "center",
    padding: "40px 20px",
    background: "#f1f5f9",
  },
};