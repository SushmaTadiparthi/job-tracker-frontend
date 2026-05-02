import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { type Job, type JobRequest } from "../types";
import JobCard from "../components/JobCard";
import { useIsMobile } from "../hooks/useIsMobile";

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
  const isMobile = useIsMobile();

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

  const handleNotesChange = (id: number, notes: string) => {
    setJobs(jobs.map((job) =>
      job.id === id ? { ...job, notes } : job
    ));
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
    <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9" }}>

      {/* NAVBAR */}
      <nav style={{
        backgroundColor: "#0f172a",
        height: isMobile ? "56px" : "60px",
        padding: isMobile ? "0 16px" : "0 28px",
        display: "flex",
        alignItems: "center",
        gap: isMobile ? "10px" : "20px",
        borderBottom: "1px solid #1e293b",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <span style={{ fontSize: "17px", fontWeight: "700", color: "white", letterSpacing: "-0.3px", flexShrink: 0 }}>
          Job<span style={{ color: "#818cf8" }}>Tracker</span>
        </span>

        {!isMobile && (
          <div style={{ flex: 1, maxWidth: "380px", position: "relative" }}>
            <svg style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)" }}
              viewBox="0 0 24 24" width="14" height="14" stroke="#64748b" fill="none" strokeWidth="2.5">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
            <input
              style={{
                width: "100%", padding: "8px 14px 8px 34px",
                backgroundColor: "#1e293b", border: "1px solid #334155",
                borderRadius: "8px", color: "#e2e8f0", fontSize: "13px", outline: "none",
              }}
              type="text"
              placeholder="Search by company or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "auto" }}>
          {!isMobile && (
            <div style={{
              padding: "5px 12px", backgroundColor: "#1e293b", border: "1px solid #334155",
              borderRadius: "20px", fontSize: "12px", fontWeight: "500", whiteSpace: "nowrap",
            }}>
              <span style={{ color: "#818cf8", fontWeight: "700" }}>{jobs.length}</span>
              <span style={{ color: "#94a3b8" }}> Applications</span>
            </div>
          )}

          <div ref={profileRef} style={{ position: "relative" }}>
            <button
              style={{
                display: "flex", alignItems: "center", gap: isMobile ? "6px" : "9px",
                padding: isMobile ? "5px 8px 5px 5px" : "5px 12px 5px 5px",
                backgroundColor: "#1e293b", border: "1px solid #334155",
                borderRadius: "8px", cursor: "pointer",
              }}
              onClick={() => setShowProfileMenu((p) => !p)}
            >
              <div style={{
                width: "28px", height: "28px", borderRadius: "6px",
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: "700", color: "white", flexShrink: 0,
              }}>
                {initials}
              </div>
              {!isMobile && (
                <span style={{ fontSize: "13px", color: "#e2e8f0", fontWeight: "500" }}>
                  {user?.name?.split(" ")[0]}
                </span>
              )}
              <svg width="14" height="14" viewBox="0 0 24 24" stroke="#64748b" fill="none" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showProfileMenu && (
              <div style={{
                position: "absolute", top: "44px", right: "0",
                backgroundColor: "white", borderRadius: "10px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                minWidth: "220px", zIndex: 200,
                border: "1px solid #e2e8f0", overflow: "hidden",
              }}>
                <div style={{
                  padding: "14px 16px", backgroundColor: "#f8fafc",
                  display: "flex", alignItems: "center", gap: "10px",
                }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "8px",
                    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "13px", fontWeight: "700", color: "white", flexShrink: 0,
                  }}>
                    {initials}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>{user?.name}</p>
                    <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>{user?.email}</p>
                  </div>
                </div>
                <div style={{ height: "1px", backgroundColor: "#f1f5f9" }} />
                <Link to="/settings" style={{ display: "block", padding: "11px 16px", color: "#374151", textDecoration: "none", fontSize: "14px" }}
                  onClick={() => setShowProfileMenu(false)}>
                  ⚙ Settings
                </Link>
                <div style={{ height: "1px", backgroundColor: "#f1f5f9" }} />
                <button style={{
                  width: "100%", padding: "11px 16px", border: "none", background: "none",
                  color: "#dc2626", cursor: "pointer", fontSize: "14px", fontWeight: "600", textAlign: "left",
                }}
                  onClick={() => { logout(); navigate("/login"); }}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: isMobile ? "16px 12px" : "32px 16px" }}>

        {/* Mobile search */}
        {isMobile && (
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <svg style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)" }}
              viewBox="0 0 24 24" width="14" height="14" stroke="#94a3b8" fill="none" strokeWidth="2.5">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
            <input
              style={{
                width: "100%", padding: "10px 14px 10px 34px",
                backgroundColor: "white", border: "1px solid #e2e8f0",
                borderRadius: "8px", color: "#0f172a", fontSize: "14px",
                outline: "none", boxSizing: "border-box",
              }}
              type="text"
              placeholder="Search by company or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gap: isMobile ? "10px" : "14px",
          marginBottom: isMobile ? "16px" : "28px",
        }}>
          {stats.map((s) => (
            <div key={s.label} style={{
              backgroundColor: "white", borderRadius: "10px",
              padding: isMobile ? "14px" : "18px",
              border: "1px solid #e2e8f0",
              display: "flex", gap: "10px", alignItems: "flex-start",
            }}>
              <div style={{ width: "4px", height: "40px", borderRadius: "2px", backgroundColor: s.color, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "600", letterSpacing: "0.5px", margin: 0 }}>{s.label}</p>
                <p style={{ fontSize: isMobile ? "22px" : "26px", fontWeight: "700", color: "#0f172a", margin: "4px 0 0 0" }}>{s.count}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            My Applications ({jobs.length})
          </h2>
          <button
            style={{
              padding: "9px 16px",
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              color: "white", border: "none", borderRadius: "8px",
              fontSize: "13px", fontWeight: "600", cursor: "pointer",
            }}
            onClick={() => setShowForm((p) => !p)}
          >
            {showForm ? "✕ Cancel" : "+ Add Job"}
          </button>
        </div>

        {/* Add Job Form */}
        {showForm && (
          <div style={{
            backgroundColor: "white", borderRadius: "10px", padding: isMobile ? "16px" : "24px",
            marginBottom: "24px", border: "1px solid #e2e8f0",
          }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>
              New Application
            </h3>
            <form onSubmit={handleAddJob}>
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "10px", marginBottom: "10px",
              }}>
                <input style={inputStyle} value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  placeholder="Company name" required />
                <input style={inputStyle} value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="Job role / title" required />
              </div>
              <input
                style={{ ...inputStyle, marginBottom: "10px" } as React.CSSProperties}
                value={form.jobUrl}
                onChange={(e) => setForm({ ...form, jobUrl: e.target.value })}
                placeholder="Job URL (optional)"
              />
              <textarea
                style={{ ...inputStyle, minHeight: "72px", resize: "vertical" } as React.CSSProperties}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Notes about this role..."
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                <button style={{
                  padding: "10px 22px",
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                  color: "white", border: "none", borderRadius: "8px",
                  fontSize: "13px", fontWeight: "600", cursor: "pointer",
                  flex: isMobile ? "1" : "unset",
                }} type="submit">Add Application</button>
                <button style={{
                  padding: "10px 22px", backgroundColor: "#f1f5f9", color: "#475569",
                  border: "1px solid #e2e8f0", borderRadius: "8px",
                  fontSize: "13px", fontWeight: "600", cursor: "pointer",
                  flex: isMobile ? "1" : "unset",
                }} type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Job List */}
        {loading ? (
          <p style={{ textAlign: "center", color: "#94a3b8", padding: "48px" }}>Loading your applications...</p>
        ) : filteredJobs.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "48px 20px", backgroundColor: "white",
            borderRadius: "10px", border: "1px solid #e2e8f0",
          }}>
            <p style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px 0" }}>
              {searchTerm ? "No matches found" : "No applications yet"}
            </p>
            <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
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
              onNotesChange={handleNotesChange}
            />
          ))
        )}
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  fontSize: "14px",
  outline: "none",
  backgroundColor: "#f8fafc",
  fontFamily: "inherit",
  color: "#0f172a",
  width: "100%",
  boxSizing: "border-box",
};

export default Dashboard;