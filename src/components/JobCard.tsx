import { type Job } from "../types"
import api from "../api/axios"

interface JobCardProps {
    job: Job
    onStatusChange: (id: number, status: string) => void
    onDelete: (id: number) => void
}

const statusColors: Record<string, string> = {
    APPLIED: "#2E75B6",
    INTERVIEW: "#FF8C00",
    OFFER: "#2E7D32",
    REJECTED: "#C00000"
}

const styles: Record<string, React.CSSProperties> = {
    card: { backgroundColor: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "16px", borderLeft: "4px solid #2E75B6" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" },
    company: { fontSize: "18px", fontWeight: "700", color: "#1a1a2e", margin: 0 },
    role: { fontSize: "14px", color: "#555", margin: "4px 0 0 0" },
    badge: { color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
    notes: { fontSize: "13px", color: "#777", marginBottom: "8px" },
    link: { fontSize: "13px", color: "#2E75B6", display: "block", marginBottom: "12px" },
    footer: { display: "flex", gap: "10px", alignItems: "center" },
    select: { padding: "6px 10px", borderRadius: "6px", border: "1px solid #ddd", fontSize: "13px", cursor: "pointer" },
    deleteBtn: { padding: "6px 14px", backgroundColor: "#fff0f0", color: "#C00000", border: "1px solid #ffcccc", borderRadius: "6px", fontSize: "13px", cursor: "pointer" },
    date: { fontSize: "12px", color: "#aaa", marginTop: "10px", marginBottom: 0 }
}

const JobCard = ({ job, onStatusChange, onDelete }: JobCardProps) => {

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value
        try {
            await api.put("/api/jobs/" + job.id + "/status", { status: newStatus })
            onStatusChange(job.id, newStatus)
        } catch (err) {
            alert("Failed to update status")
        }
    }

    const handleDelete = async () => {
        if (!window.confirm("Delete this application?")) return
        try {
            await api.delete("/api/jobs/" + job.id)
            onDelete(job.id)
        } catch (err) {
            alert("Failed to delete job")
        }
    }

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <div>
                    <h3 style={styles.company}>{job.companyName}</h3>
                    <p style={styles.role}>{job.role}</p>
                </div>
                <span style={{ ...styles.badge, backgroundColor: statusColors[job.status] }}>
                    {job.status}
                </span>
            </div>

            {job.notes && (
                <p style={styles.notes}>{job.notes}</p>
            )}

            {job.jobUrl && (
                <p style={styles.link}>{job.jobUrl}</p>
            )}

            <div style={styles.footer}>
                <select style={styles.select} value={job.status} onChange={handleStatusChange}>
                    <option value="APPLIED">Applied</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Rejected</option>
                </select>
                <button style={styles.deleteBtn} onClick={handleDelete}>Delete</button>
            </div>

            <p style={styles.date}>
                Applied: {new Date(job.appliedDate).toLocaleDateString()}
            </p>
        </div>
    )
}

export default JobCard