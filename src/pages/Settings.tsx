import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"

const Settings = () => {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [pwMessage, setPwMessage] = useState("")
    const [pwError, setPwError] = useState("")
    const [pwLoading, setPwLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setPwMessage("")
        setPwError("")

        if (newPassword !== confirmPassword) {
            setPwError("New passwords do not match")
            return
        }

        if (newPassword.length < 6) {
            setPwError("Password must be at least 6 characters")
            return
        }

        setPwLoading(true)
        try {
            await api.put("/api/user/password", { currentPassword, newPassword })
            setPwMessage("Password updated successfully!")
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
        } catch (err: any) {
            setPwError(err.response?.data?.message || "Current password is incorrect")
        } finally {
            setPwLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account? This will permanently delete all your job applications. This cannot be undone."
        )
        if (!confirmed) return

        const doubleConfirm = window.confirm(
            "Last warning — all your data will be permanently deleted. Continue?"
        )
        if (!doubleConfirm) return

        setDeleteLoading(true)
        try {
            await api.delete("/api/user/account")
            logout()
            navigate("/login")
        } catch (err) {
            alert("Failed to delete account. Please try again.")
        } finally {
            setDeleteLoading(false)
        }
    }

    return (
        <div style={styles.container}>

            {/* Navbar */}
            <div style={styles.navbar}>
                <h1 style={styles.navTitle}>Job Tracker</h1>
                <div style={styles.navRight}>
                    <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
                    <span style={styles.welcome}>Hi, {user?.name}</span>
                </div>
            </div>

            <div style={styles.content}>
                <h2 style={styles.pageTitle}>Account Settings</h2>

                {/* Change Password */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Change Password</h3>
                    <p style={styles.cardSubtitle}>Update your password to keep your account secure</p>

                    {pwMessage && <p style={styles.success}>{pwMessage}</p>}
                    {pwError && <p style={styles.error}>{pwError}</p>}

                    <form onSubmit={handlePasswordUpdate}>
                        <div style={styles.field}>
                            <label style={styles.label}>Current Password</label>
                            <input
                                style={styles.input}
                                type="password"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                                required
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>New Password</label>
                            <input
                                style={styles.input}
                                type="password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                placeholder="Min 6 characters"
                                required
                            />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Confirm New Password</label>
                            <input
                                style={styles.input}
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                placeholder="Repeat new password"
                                required
                            />
                        </div>
                        <button
                            style={pwLoading ? styles.buttonDisabled : styles.button}
                            type="submit"
                            disabled={pwLoading}
                        >
                            {pwLoading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </div>

                {/* Account Info */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Account Info</h3>
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Name</span>
                        <span style={styles.infoValue}>{user?.name}</span>
                    </div>
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Email</span>
                        <span style={styles.infoValue}>{user?.email}</span>
                    </div>
                </div>

                {/* Danger Zone */}
                <div style={styles.dangerCard}>
                    <h3 style={styles.dangerTitle}>Danger Zone</h3>
                    <p style={styles.dangerText}>
                        Permanently delete your account and all job application data.
                        This action cannot be undone.
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
    )
}

const styles: Record<string, React.CSSProperties> = {
    container: { minHeight: "100vh", backgroundColor: "#f0f2f5" },
    navbar: {
        backgroundColor: "#1a1a2e",
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    navTitle: { color: "white", margin: 0, fontSize: "20px" },
    navRight: { display: "flex", alignItems: "center", gap: "20px" },
    navLink: { color: "#aaa", textDecoration: "none", fontSize: "14px" },
    welcome: { color: "#aaa", fontSize: "14px" },
    content: { maxWidth: "600px", margin: "0 auto", padding: "24px 16px" },
    pageTitle: { color: "#1a1a2e", marginBottom: "24px" },
    card: {
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    },
    cardTitle: { margin: "0 0 4px 0", color: "#1a1a2e", fontSize: "18px" },
    cardSubtitle: { color: "#888", fontSize: "13px", marginBottom: "20px" },
    field: { marginBottom: "16px" },
    label: { display: "block", marginBottom: "6px", fontWeight: "500", fontSize: "14px" },
    input: {
        width: "100%",
        padding: "10px 14px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "14px",
        boxSizing: "border-box"
    },
    button: {
        padding: "10px 24px",
        backgroundColor: "#2E75B6",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer"
    },
    buttonDisabled: {
        padding: "10px 24px",
        backgroundColor: "#aaa",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        cursor: "not-allowed"
    },
    success: {
        color: "#2E7D32",
        backgroundColor: "#E8F5E9",
        padding: "10px",
        borderRadius: "6px",
        marginBottom: "16px",
        fontSize: "14px"
    },
    error: {
        color: "#C00000",
        backgroundColor: "#fff0f0",
        padding: "10px",
        borderRadius: "6px",
        marginBottom: "16px",
        fontSize: "14px"
    },
    infoRow: {
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid #f0f0f0"
    },
    infoLabel: { color: "#888", fontSize: "14px" },
    infoValue: { color: "#1a1a2e", fontWeight: "500", fontSize: "14px" },
    dangerCard: {
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid #ffcccc"
    },
    dangerTitle: { margin: "0 0 8px 0", color: "#C00000", fontSize: "18px" },
    dangerText: { color: "#888", fontSize: "13px", marginBottom: "16px" },
    deleteBtn: {
        padding: "10px 24px",
        backgroundColor: "#C00000",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer"
    }
}

export default Settings