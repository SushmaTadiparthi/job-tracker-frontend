import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { type Job, type JobRequest } from "../types";
import JobCard from "../components/JobCard";

const Dashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState<JobRequest>({
    companyName: "",
    role: "",
    jobUrl: "",
    notes: "",
  });

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchJobs(); }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get<Job[]>("/api/jobs");
      setJobs(response.data);
    } catch (err) {
      console.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post<Job>("/api/jobs", form);
      setJobs([response.data, ...jobs]);
      setForm({ companyName: "", role: "", jobUrl: "", notes: "" });
      setShowForm(false);
    } catch (err) {
      alert("Failed to add job");
    }
  };

  const handleStatusChange = (id: number, status: string) => {
    setJobs(jobs.map((job) =>
      job.id === id ? { ...job, status: status as Job["status"] } : job
    ));
  };

  const handleDelete = (id: number) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: "APPLIED",   count: jobs.filter((j) => j.status === "APPLIED").length,   color: "#3b82f6" },
    { label: "INTERVIEW", count: jobs.filter((j) => j.status === "INTERVIEW").length, color: "#f59e0b" },
    { label: "OFFER",     count: jobs.filter((j) => j.status === "OFFER").length,     color: "#10b981" },
    { label: "REJECTED",  count: jobs.filter((j) => j.status === "REJECTED").length,  color: "#ef4444" },
  ];

  const initials = user?.name
    ?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "U";

  return (
    <div style={styles.container}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <span style={styles.logoText}>
          Job<span style={styles.logoAccent}>Tracker</span>
        </span>

        <div style={styles.searchWrap}>
          <svg style={styles.searchIcon} viewBox="0 0 24 24" width="14" height="14"
            stroke="#64748b" fill="none" strokeWidth="2.5">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" />
          </svg>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search by company or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={styles.navRight}>
          <div style={styles.countBadge}>
            <span style={styles.countNum}>{jobs.length}</span>
            <span style={styles.countLabel}> Applications</span>
          </div>

          <div ref={profileRef} style={{ position: "relative" }}>
            <button style={styles.profileBtn} onClick={() => setShowProfileMenu((p) => !p)}>
              <div style={styles.avatar}>{initials}</div>
              <span style={styles.profileName}>{user?.name?.split(" ")[0]}</span>
              <svg width="14" height="14" viewBox="0 0 24 24"
                stroke="#64748b" fill="none" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showProfileMenu && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownHeader}>
                  <div style={styles.dropdownAvatar}>{initials}</div>
                  <div>
                    <p style={styles.dropdownName}>{user?.name}</p>
                    <p style={styles.dropdownEmail}>{user?.email}</p>
                  </div>
                </div>
                <div style={styles.dropdownDivider} />
                <Link to="/settings" style={styles.dropdownItem}
                  onClick={() => setShowProfileMenu(false)}>
                  ⚙ Settings
                </Link>
                <div style={styles.dropdownDivider} />
                <button style={styles.dropdownSignOut}
                  onClick={() => { logout(); navigate("/login"); }}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={styles.content}>
        {/* Stats */}
        <div style={styles.statsRow}>
          {stats.map((s) => (
            <div key={s.label} style={styles.statCard}>
              <div style={{ ...styles.statBar, backgroundColor: s.color }} />
              <div>
                <p style={styles.statLabel}>{s.label}</p>
                <p style={styles.statNumber}>{s.count}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={styles.toolbar}>
          <h2 style={styles.sectionTitle}>My Applications ({jobs.length})</h2>
          <button style={styles.addBtn} onClick={() => setShowForm((p) => !p)}>
            {showForm ? "✕ Cancel" : "+ Add Job"}
          </button>
        </div>

        {/* Add Job Form */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>New Application</h3>
            <form onSubmit={handleAddJob}>
              <div style={styles.formRow}>
                <input
                  style={styles.formInput}
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  placeholder="Company name"
                  required
                />
                <input
                  style={styles.formInput}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="Job role / title"
                  required
                />
              </div>
              <input
                style={{ ...styles.formInput, width: "100%", marginBottom: "10px" }}
                value={form.jobUrl}
                onChange={(e) => setForm({ ...form, jobUrl: e.target.value })}
                placeholder="Job URL (optional)"
              />
              <textarea
                style={{ ...styles.formInput, width: "100%", minHeight: "72px", resize: "vertical" } as React.CSSProperties}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Notes about this role..."
              />
              <div style={styles.formButtons}>
                <button style={styles.submitBtn} type="submit">Add Application</button>
                <button style={styles.cancelBtn} type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Job List */}
        {loading ? (
          <p style={styles.loadingText}>Loading your applications...</p>
        ) : filteredJobs.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyTitle}>
              {searchTerm ? "No matches found" : "No applications yet"}
            </p>
            <p style={styles.emptySubtitle}>
              {searchTerm ? "Try a different search term" : 'Click "+ Add Job" to track your first application!'}
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: "100vh", backgroundColor: "#f1f5f9" },

  navbar: {
    backgroundColor: "#0f172a",
    height: "60px",
    padding: "0 28px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    borderBottom: "1px solid #1e293b",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logoText: { fontSize: "18px", fontWeight: "700", color: "white", letterSpacing: "-0.3px", flexShrink: 0 },
  logoAccent: { color: "#818cf8" },

  searchWrap: { flex: 1, maxWidth: "380px", position: "relative" },
  searchIcon: { position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)" },
  searchInput: {
    width: "100%",
    padding: "8px 14px 8px 34px",
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "8px",
    color: "#e2e8f0",
    fontSize: "13px",
    outline: "none",
  },

  navRight: { display: "flex", alignItems: "center", gap: "10px", marginLeft: "auto" },
  countBadge: {
    padding: "5px 12px",
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },
  countNum: { color: "#818cf8", fontWeight: "700" },
  countLabel: { color: "#94a3b8" },

  profileBtn: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "5px 12px 5px 5px",
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "8px",
    cursor: "pointer",
  },
  avatar: {
    width: "28px",
    height: "28px",
    borderRadius: "6px",
    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "700",
    color: "white",
    flexShrink: 0,
  },
  profileName: { fontSize: "13px", color: "#e2e8f0", fontWeight: "500" },

  dropdown: {
    position: "absolute",
    top: "44px",
    right: "0",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    minWidth: "220px",
    zIndex: 200,
    border: "1px solid #e2e8f0",
    overflow: "hidden",
  },
  dropdownHeader: {
    padding: "14px 16px",
    backgroundColor: "#f8fafc",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  dropdownAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "700",
    color: "white",
    flexShrink: 0,
  },
  dropdownName: { margin: 0, fontSize: "14px", fontWeight: "600", color: "#0f172a" },
  dropdownEmail: { margin: 0, fontSize: "12px", color: "#64748b" },
  dropdownDivider: { height: "1px", backgroundColor: "#f1f5f9" },
  dropdownItem: {
    display: "block",
    padding: "11px 16px",
    color: "#374151",
    textDecoration: "none",
    fontSize: "14px",
  },
  dropdownSignOut: {
    width: "100%",
    padding: "11px 16px",
    border: "none",
    background: "none",
    color: "#dc2626",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    textAlign: "left",
  },

  content: { maxWidth: "860px", margin: "0 auto", padding: "32px 16px" },

  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "28px" },
  statCard: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "18px",
    border: "1px solid #e2e8f0",
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },
  statBar: { width: "4px", height: "44px", borderRadius: "2px", flexShrink: 0 },
  statLabel: { fontSize: "11px", color: "#94a3b8", fontWeight: "600", letterSpacing: "0.5px", margin: 0 },
  statNumber: { fontSize: "26px", fontWeight: "700", color: "#0f172a", margin: "4px 0 0 0" },

  toolbar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  sectionTitle: { fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 },
  addBtn: {
    padding: "9px 20px",
    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },

  formCard: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "24px",
    marginBottom: "24px",
    border: "1px solid #e2e8f0",
  },
  formTitle: { margin: "0 0 16px 0", fontSize: "15px", fontWeight: "700", color: "#0f172a" },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "10px" },
  formInput: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#f8fafc",
    fontFamily: "inherit",
    color: "#0f172a",
  },
  formButtons: { display: "flex", gap: "10px", marginTop: "14px" },
  submitBtn: {
    padding: "10px 22px",
    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "10px 22px",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },

  loadingText: { textAlign: "center", color: "#94a3b8", padding: "48px" },
  empty: {
    textAlign: "center",
    padding: "64px 20px",
    backgroundColor: "white",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
  },
  emptyTitle: { fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px 0" },
  emptySubtitle: { fontSize: "14px", color: "#64748b", margin: 0 },
};

export default Dashboard;