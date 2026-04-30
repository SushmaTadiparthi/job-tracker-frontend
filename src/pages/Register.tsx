import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import { type AuthResponse } from "../types"

const Register = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const response = await api.post<AuthResponse>("/api/auth/register", {
                name,
                email,
                password
            })
            login(response.data.token, {
                email: response.data.email,
                name: response.data.name
            })
            navigate("/dashboard")
        } catch (err) {
            setError("Registration failed. Email may already be taken.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Create Account</h2>
                <p style={styles.subtitle}>Start tracking your job applications</p>

                {error && <p style={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            style={styles.input}
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Sushma Tadiparthi"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            style={styles.input}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="sushma@gmail.com"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={styles.input}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min 6 characters"
                            required
                        />
                    </div>

                    <button
                        style={loading ? styles.buttonDisabled : styles.button}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p style={styles.link}>
                    Already have an account?{" "}
                    <Link to="/login" style={styles.linkText}>Sign In</Link>
                </p>
            </div>
        </div>
    )
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f0f2f5"
    },
    card: {
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px"
    },
    title: {
        textAlign: "center",
        fontSize: "24px",
        fontWeight: "bold",
        color: "#1a1a2e",
        marginBottom: "4px"
    },
    subtitle: {
        textAlign: "center",
        color: "#666",
        marginBottom: "24px"
    },
    field: { marginBottom: "16px" },
    label: {
        display: "block",
        marginBottom: "6px",
        fontWeight: "500",
        color: "#333"
    },
    input: {
        width: "100%",
        padding: "10px 14px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "14px",
        boxSizing: "border-box"
    },
    button: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#2E75B6",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        marginTop: "8px"
    },
    buttonDisabled: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#aaa",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        cursor: "not-allowed",
        marginTop: "8px"
    },
    error: {
        color: "red",
        backgroundColor: "#fff0f0",
        padding: "10px",
        borderRadius: "6px",
        marginBottom: "16px",
        fontSize: "14px"
    },
    link: {
        textAlign: "center",
        marginTop: "20px",
        color: "#666",
        fontSize: "14px"
    },
    linkText: { color: "#2E75B6", fontWeight: "600" }
}

export default Register