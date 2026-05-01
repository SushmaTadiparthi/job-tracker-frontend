import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { type Job, type JobRequest } from "../types";
import JobCard from "../components/JobCard";

const Dashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<JobRequest>({
    companyName: "",
    role: "",
    jobUrl: "",
    notes: "",
  });

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch jobs on load
  useEffect(() => {
    fetchJobs();
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
    setJobs(
      jobs.map((job) =>
        job.id === id ? { ...job, status: status as Job["status"] } : job,
      ),
    );
  };

  const handleDelete = (id: number) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h1 style={styles.navTitle}>Job Tracker</h1>
        <div style={styles.navRight}>
          <span style={styles.welcome}>Hi, {user?.name}</span>
          <Link to="/settings" style={styles.settingsLink}>
            Settings
          </Link>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div style={styles.content}>
        {/* Stats */}
        <div style={styles.statsRow}>
          {["APPLIED", "INTERVIEW", "OFFER", "REJECTED"].map((status) => (
            <div key={status} style={styles.statCard}>
              <p style={styles.statNumber}>
                {jobs.filter((j) => j.status === status).length}
              </p>
              <p style={styles.statLabel}>{status}</p>
            </div>
          ))}
        </div>

        {/* Add Job Button */}
        <div style={styles.actionRow}>
          <h2 style={styles.sectionTitle}>My Applications ({jobs.length})</h2>
          <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Add Job"}
          </button>
        </div>

        {/* Add Job Form */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>New Application</h3>
            <form onSubmit={handleAddJob}>
              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>Company Name *</label>
                  <input
                    style={styles.input}
                    value={form.companyName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        companyName: e.target.value,
                      })
                    }
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Role *</label>
                  <input
                    style={styles.input}
                    value={form.role}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        role: e.target.value,
                      })
                    }
                    placeholder="Enter job title"
                    required
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Job URL</label>
                  <input
                    style={styles.input}
                    value={form.jobUrl}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        jobUrl: e.target.value,
                      })
                    }
                    placeholder="e.g. https://careers.google.com/..."
                  />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Notes</label>
                  <input
                    style={styles.input}
                    value={form.notes}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        notes: e.target.value,
                      })
                    }
                    placeholder="Add notes"
                  />
                </div>
              </div>
              <button style={styles.submitBtn} type="submit">
                Add Application
              </button>
            </form>
          </div>
        )}

        {/* Job List */}
        {loading ? (
          <p style={styles.loading}>Loading your applications...</p>
        ) : jobs.length === 0 ? (
          <div style={styles.empty}>
            <p>No applications yet.</p>
            <p>Click "+ Add Job" to track your first application!</p>
          </div>
        ) : (
          jobs.map((job) => (
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
  container: { minHeight: "100vh", backgroundColor: "#f0f2f5" },
  navbar: {
    backgroundColor: "#1a1a2e",
    padding: "16px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navTitle: { color: "white", margin: 0, fontSize: "20px" },
  navRight: { display: "flex", alignItems: "center", gap: "16px" },
  welcome: { color: "#aaa", fontSize: "14px" },
  logoutBtn: {
    padding: "6px 16px",
    backgroundColor: "transparent",
    color: "white",
    border: "1px solid #555",
    borderRadius: "6px",
    cursor: "pointer",
  },
  content: { maxWidth: "800px", margin: "0 auto", padding: "24px 16px" },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    marginBottom: "24px",
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "16px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  statNumber: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: 0,
  },
  statLabel: { fontSize: "11px", color: "#888", margin: "4px 0 0 0" },
  actionRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  sectionTitle: { margin: 0, color: "#1a1a2e" },
  addBtn: {
    padding: "10px 20px",
    backgroundColor: "#2E75B6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  formCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  formTitle: { margin: "0 0 16px 0", color: "#1a1a2e" },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  field: { display: "flex", flexDirection: "column" },
  label: { fontSize: "13px", fontWeight: "500", marginBottom: "4px" },
  input: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  submitBtn: {
    marginTop: "16px",
    padding: "10px 24px",
    backgroundColor: "#2E75B6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  loading: { textAlign: "center", color: "#888", padding: "40px" },
  empty: {
    textAlign: "center",
    color: "#888",
    padding: "60px 20px",
    backgroundColor: "white",
    borderRadius: "12px",
  },
  settingsLink: {
    color: "#aaa",
    textDecoration: "none",
    fontSize: "14px",
  },
};

export default Dashboard;
