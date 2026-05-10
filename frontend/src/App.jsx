import { BrowserRouter as Router, Routes, Route, NavLink, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import api from "./api";

import CreateIdeaForm from "./components/CreateIdeaForm";
import IdeaList from "./components/IdeaList";
import IdeaDetail from "./components/IdeaDetail";
import Signup from "./components/Signup";
import AssignReviewers from "./components/AssignReviewer";
import CreateInitiative from "./components/CreateInitiative";
import Login from "./components/Login";
import ReviewerDashboard from "./components/ReviewerDashboard";
import Profile from "./components/Profile";
import IdeasOverTimeChart from "./components/IdeasOverTime";
import RequireAuth from "./components/RequireAuth";
import AdminDashboard from "./components/AdminDashboard";
import AdminInitiatives from "./components/AdminInitiatives";
import AdminInitiativeDetail from "./components/AdminInitativeDetail";

import "./App.css";

function App() {
  const [user, setUser] = useState(null); // { username, role }
  const [ideas, setIdeas] = useState([]); // store ideas for metrics + chart
  const [chartData, setChartData] = useState([]);
  const [loadingIdeas, setLoadingIdeas] = useState(false);

  // restore user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    if (!user) return;  
    fetchIdeasForHome();
  }, [user]);

  const fetchIdeasForHome = async () => {
    setLoadingIdeas(true);
    try {
      const res = await api.get("/ideas");

      // backend may return Page {content:[...]} OR plain array [...]
      const data = res.data;
      const list = Array.isArray(data) ? data : data?.content ?? [];

      setIdeas(list);

      // Build chart data: ideas count per day (like "Apr 1", "Apr 8", etc.)
      const grouped = list.reduce((acc, item) => {
        const createdAt = item.createdAt || item.created_at || item.created_on;
        if (!createdAt) return acc;

        const label = new Date(createdAt).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        });

        acc[label] = (acc[label] || 0) + 1;
        return acc;
      }, {});

      const graph = Object.keys(grouped).map((key) => ({
        date: key,
        count: grouped[key],
      }));

      // sort labels by actual date order (best-effort)
      graph.sort((a, b) => {
        const da = new Date(a.date + " 2026");
        const db = new Date(b.date + " 2026");
        return da - db;
      });

      setChartData(graph);
    } catch (e) {
      console.error("Home ideas fetch failed:", e);
      setIdeas([]);
      setChartData([]);
    } finally {
      setLoadingIdeas(false);
    }
  };

  const handleLogin = (username, role) => {
    const nextUser = { username, role };
    setUser(nextUser);
    localStorage.setItem("user", JSON.stringify(nextUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/initiatives", label: "Initiatives" },
    { to: "/ideas", label: "Ideas" }
  ];

  const normalizedRole = user?.role?.toString().toUpperCase();
const roleAction = normalizedRole
  ? normalizedRole === "ADMIN"
    ? { to: "/admin-dashboard", label: "Admin Dashboard" }
    : normalizedRole === "REVIEWER"
    ? { to: "/reviewer-dashboard", label: "Review Dashboard" }
    : { to: "/my-ideas", label: "My Ideas" }
  : null;


  // metrics derived from ideas list (instead of hard-coded)
  const metrics = useMemo(() => {
    const totalIdeas = ideas.length;
    const underReview = ideas.filter((i) => i.status === "UNDER_REVIEW").length;
    const accepted = ideas.filter((i) => i.status === "ACCEPTED").length;
    const open = ideas.filter((i) => i.status === "OPEN").length;

    return {
      activeInitiatives: 24, // keep static unless you have initiatives endpoint
      ideasSubmitted: totalIdeas,
      underReview,
      winnersPublished: accepted, // you can rename later
      open,
    };
  }, [ideas]);

  return (
    <Router>
      <div className="app-shell app-dark">
        <header className="topbar-dark">
          <div className="topbar-brand">
            <div className="brand-icon">💡</div>
            <div className="brand-copy">
              <span className="brand-name">Initiative Tracker</span>
              <span className="brand-tagline">
                Manage initiatives, spark innovation, and win faster.
              </span>
            </div>
          </div>

          <nav className="topbar-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `topbar-link${isActive ? " active" : ""}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="topbar-actions">
            {/* user--Submit Idea */}
          {normalizedRole !== "ADMIN" && normalizedRole !== "REVIEWER" && (
            <Link to="/create-idea" className="btn-primary btn-cta">
              Submit Idea
            </Link>
          )}

          {/* admin only--Create Initiative */}
          {normalizedRole === "ADMIN" && (
            <Link to="/create-initiative" className="btn-primary btn-cta">
              Create Initiative
            </Link>
          )}

            {user ? (
              <>
                {roleAction && (
                  <Link to={roleAction.to} className="btn-primary btn-hero">
                    {roleAction.label}
                  </Link>
                )}
                <Link to="/profile" className="user-chip user-chip-dark">
                  {user.username} ({user.role})
                </Link>
                <button className="btn-primary btn-hero" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary btn-hero">
                Login
              </Link>
            )}
          </div>
        </header>

        <main className="main-content home-page">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  metrics={metrics}
                  chartData={chartData}
                  loadingIdeas={loadingIdeas}
                />
              }
            />
            <Route
            path="/initiatives"
            element={
              normalizedRole === "ADMIN" ? (
                <RequireAuth user={user}>
                  <AdminInitiatives />
                </RequireAuth>
              ) : (
                <Home
                  metrics={metrics}
                  chartData={chartData}
                  loadingIdeas={loadingIdeas}
                />
              )
            }
          />

          <Route
            path="/initiatives/:id"
            element={
              <RequireAuth user={user}>
                <AdminInitiativeDetail />
              </RequireAuth>
            }
          />
            <Route path="/ideas" element={<IdeaList title="Ideas" userRole={user?.role} />} />
            <Route
              path="/competitions"
              element={
                <Home
                  metrics={metrics}
                  chartData={chartData}
                  loadingIdeas={loadingIdeas}
                />
              }
            />

            <Route
          path="/create-idea"
          element={
            <RequireAuth user={user}>
              <CreateIdeaForm />
            </RequireAuth>
          }
          />

            <Route path="/my-ideas" element={<IdeaList title="My Ideas" userRole={user?.role} />} />
            <Route path="/ideas/:id" element={<IdeaDetail />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/login" element={<Login onLogin={handleLogin} title="Login" />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/admin" element={<Login onLogin={handleLogin} title="Admin Login" />} />
            <Route path="/reviewer" element={<Login onLogin={handleLogin} title="Reviewer Login" />} />

            <Route path="/create-initiative" element={<CreateInitiative />} />
            <Route path="/assign-reviewers" element={<AssignReviewers />} />
            <Route path="/reviewer-dashboard" element={<ReviewerDashboard />} />
            <Route
              path="/admin-dashboard"
              element={
                <RequireAuth user={user}>
                  <AdminDashboard />
                </RequireAuth>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Home({ metrics, chartData, loadingIdeas }) {
  return (
    <div className="home-frame">
      <section className="hero-dark">
        <div className="hero-copy">
          <span className="eyebrow">Turn ideas into action.</span>
          <h1>Manage initiatives, run idea challenges, and drive innovation — all in one place.</h1>
          <p className="hero-description">
            Track initiatives, review ideas faster, and use AI insights to drive better outcomes.
          </p>

          <div className="hero-actions">
            <Link to="/ideas" className="btn-primary btn-hero">
              Explore Initiatives
            </Link>
            <Link to="/create-idea" className="btn-primary btn-hero">
              Submit Idea
            </Link>
            
          </div>
        </div>

        <div className="hero-card">
          <div className="overview-top">
            <p className="overview-title">Overview</p>
            <div className="overview-select">This Month</div>
          </div>

          <div className="overview-grid">
            <div className="overview-metric">
              <span>Active Initiatives</span>
              <strong>{metrics.activeInitiatives}</strong>
            </div>
            <div className="overview-metric">
              <span>Ideas Submitted</span>
              <strong>{metrics.ideasSubmitted}</strong>
            </div>
            <div className="overview-metric">
              <span>Under Review</span>
              <strong>{metrics.underReview}</strong>
            </div>
            <div className="overview-metric">
              <span>Winners Published</span>
              <strong>{metrics.winnersPublished}</strong>
            </div>
          </div>

          <div className="chart-panel">
            {loadingIdeas ? (
              <p className="chart-loading">Loading chart…</p>
            ) : (
              <IdeasOverTimeChart data={chartData} />
            )}
          </div>
        </div>
      </section>

      <section className="feature-row">
        <div className="feature-card">
          <h3>Centralized Initiatives</h3>
          <p>Track all initiatives in one place from submission to impact.</p>
        </div>
        <div className="feature-card">
          <h3>AI Idea Enrichment</h3>
          <p>Enhance ideas with AI insights and smarter suggestions.</p>
        </div>
        <div className="feature-card">
          <h3>Duplicate Detection</h3>
          <p>Identify similar ideas instantly to keep efforts unique.</p>
        </div>
      </section>

      <section className="featured-initiatives">
        <div className="featured-header">
          <h2>Featured Initiatives</h2>
          <Link to="/initiatives" className="view-all-link">
            View all initiatives →
          </Link>
        </div>

        <div className="initiative-list">
          <div className="initiative-card">
            <div className="initiative-title-row">
              <h3>Sustainable Workplaces Program</h3>
              <span className="status-pill status-open">Open</span>
            </div>
            <p>Ideas to reduce environmental footprint and promote sustainability.</p>
            <Link to="/ideas" className="initiative-link">
              View Initiative
            </Link>
          </div>

          <div className="initiative-card">
            <div className="initiative-title-row">
              <h3>Customer Experience Innovation</h3>
              <span className="status-pill status-under-review">Under Review</span>
            </div>
            <p>Enhance customer experience through innovative ideas and technology.</p>
            <Link to="/ideas" className="initiative-link">
              View Initiative
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;