import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMessage, setPwMessage] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage("");
    setPwError("");

    if (newPassword !== confirmPassword) { setPwError("New passwords do not match"); return; }
    if (newPassword.length < 6) { setPwError("Password must be at least 6 characters"); return; }

    setPwLoading(true);
    try {
      await api.put("/api/user/password", { currentPassword, newPassword });
      setPwMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPwError(err.response?.data?.message || "Current password is incorrect");
    } finally {
      setPwLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This will permanently delete all your job applications and cannot be undone.")) return;
    if (!window.confirm("Last warning — all your data will be permanently deleted. Continue?")) return;

    setDeleteLoading(true);
    try {
      await api.delete("/api/user/account");
      logout();
      navigate("/login");
    } catch (err) {
      alert("Failed to delete account. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const initials = user?.name
    ?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "U";

  return (
    <div style={styles.container}>
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <span style={styles.logoText}>
          Job<span style={styles.logoAccent}>Tracker</span>
        </span>
        <Link to="/dashboard" style={styles.backLink}>
          ← Back to Dashboard
        </Link>
      </nav>

      <div style={styles.content}>
        <h2 style={styles.pageTitle}>Account Settings</h2>

        {/* Account Info */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.avatarLg}>{initials}</div>
            <div>
              <p style={styles.accountName}>{user?.name}</p>
              <p style={styles.accountEmail}>{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Change Password</h3>
          <p style={styles.cardSubtitle}>Update your password to keep your account secure</p>

          {pwMessage && <p style={styles.success}>{pwMessage}</p>}
          {pwError && <p style={styles.error}>{pwError}</p>}

          <form onSubmit={handlePasswordUpdate}>
            <div style={styles.field}>
              <label style={styles.label}>Current Password</label>
              <input style={styles.input} type="password" value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password" required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>New Password</label>
              <input style={styles.input} type="password" value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters" required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Confirm New Password</label>
              <input style={styles.input} type="password" value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password" required />
            </div>
            <button style={pwLoading ? styles.buttonDisabled : styles.button}
              type="submit" disabled={pwLoading}>
              {pwLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div style={styles.dangerCard}>
          <h3 style={styles.dangerTitle}>Danger Zone</h3>
          <p style={styles.dangerText}>
            Permanently delete your account and all job application data. This cannot be undone.
          </p>
          <button
            style={deleteLoading ? styles.buttonDisabled : styles.deleteBtn}
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete My Account"}
          </button>
        </div>
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
    justifyContent: "space-between",
    borderBottom: "1px solid #1e293b",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logoText: { fontSize: "18px", fontWeight: "700", color: "white", letterSpacing: "-0.3px" },
  logoAccent: { color: "#818cf8" },
  backLink: {
    fontSize: "13px",
    color: "#94a3b8",
    textDecoration: "none",
    fontWeight: "500",
  },

  content: { maxWidth: "600px", margin: "0 auto", padding: "32px 16px" },
  pageTitle: { fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "24px" },

  card: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "24px",
    marginBottom: "20px",
    border: "1px solid #e2e8f0",
  },
  cardHeader: { display: "flex", alignItems: "center", gap: "14px" },
  avatarLg: {
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "700",
    color: "white",
    flexShrink: 0,
  },
  accountName: { margin: 0, fontSize: "15px", fontWeight: "700", color: "#0f172a" },
  accountEmail: { margin: "3px 0 0 0", fontSize: "13px", color: "#64748b" },

  cardTitle: { margin: "0 0 4px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a" },
  cardSubtitle: { color: "#94a3b8", fontSize: "13px", marginBottom: "20px", marginTop: "2px" },

  field: { marginBottom: "16px" },
  label: { display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "13px", color: "#374151" },
  input: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    backgroundColor: "#f8fafc",
    color: "#0f172a",
  },
  button: {
    padding: "10px 24px",
    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  buttonDisabled: {
    padding: "10px 24px",
    backgroundColor: "#cbd5e1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "not-allowed",
  },
  success: {
    color: "#166534",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "13px",
  },
  error: {
    color: "#991b1b",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "13px",
  },

  dangerCard: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "24px",
    marginBottom: "20px",
    border: "1px solid #fecaca",
  },
  dangerTitle: { margin: "0 0 8px 0", fontSize: "16px", fontWeight: "700", color: "#991b1b" },
  dangerText: { color: "#94a3b8", fontSize: "13px", marginBottom: "16px" },
  deleteBtn: {
    padding: "10px 24px",
    backgroundColor: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Settings;