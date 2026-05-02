import { useState } from "react"
import { type Job } from "../types"
import api from "../api/axios"
import { useIsMobile } from "../hooks/useIsMobile"

interface JobCardProps {
    job: Job
    onStatusChange: (id: number, status: string) => void
    onDelete: (id: number) => void
    onNotesChange: (id: number, notes: string) => void
}

const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
    APPLIED:   { bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe" },
    INTERVIEW: { bg: "#fffbeb", text: "#92400e", border: "#fcd34d" },
    OFFER:     { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
    REJECTED:  { bg: "#fef2f2", text: "#991b1b", border: "#fecaca" },
}

const JobCard = ({ job, onStatusChange, onDelete, onNotesChange }: JobCardProps) => {
    const [editingNotes, setEditingNotes] = useState(false)
    const [draftNotes, setDraftNotes] = useState(job.notes ?? "")
    const [savingNotes, setSavingNotes] = useState(false)
    const isMobile = useIsMobile()

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

    const handleSaveNotes = async () => {
        setSavingNotes(true)
        try {
            await api.put("/api/jobs/" + job.id, {
                companyName: job.companyName,
                role: job.role,
                jobUrl: job.jobUrl,
                notes: draftNotes,
            })
            onNotesChange(job.id, draftNotes)
            setEditingNotes(false)
        } catch (err) {
            alert("Failed to save notes")
        } finally {
            setSavingNotes(false)
        }
    }

    const handleCancelNotes = () => {
        setDraftNotes(job.notes ?? "")
        setEditingNotes(false)
    }

    const s = statusStyles[job.status]

    return (
        <div style={{
            backgroundColor: "white", borderRadius: "10px",
            padding: isMobile ? "14px" : "20px",
            marginBottom: "12px", border: "1px solid #e2e8f0",
        }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px", gap: "10px" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: isMobile ? "14px" : "15px", fontWeight: "700", color: "#0f172a", margin: 0, wordBreak: "break-word" }}>
                        {job.companyName}
                    </h3>
                    <p style={{ fontSize: "13px", color: "#64748b", margin: "3px 0 0 0", fontWeight: "500", wordBreak: "break-word" }}>
                        {job.role}
                    </p>
                </div>
                <span style={{
                    padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                    letterSpacing: "0.3px", flexShrink: 0,
                    backgroundColor: s.bg, color: s.text, border: `1px solid ${s.border}`,
                }}>
                    {job.status}
                </span>
            </div>

            {/* Job URL */}
            {job.jobUrl && (
                <a href={job.jobUrl} target="_blank" rel="noreferrer" style={{
                    fontSize: "13px", color: "#6366f1", textDecoration: "none",
                    display: "inline-block", marginBottom: "10px", fontWeight: "500",
                }}>
                    View Job Posting →
                </a>
            )}

            {/* Notes — inline, compact */}
            {!editingNotes ? (
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.5px", flexShrink: 0 }}>
                        NOTES
                    </span>
                    <span style={{
                        fontSize: "13px", color: draftNotes ? "#374151" : "#94a3b8",
                        fontStyle: draftNotes ? "normal" : "italic", flex: 1,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                        {draftNotes || "None"}
                    </span>
                    <button
                        style={{ background: "none", border: "none", color: "#6366f1", fontSize: "12px", fontWeight: "600", cursor: "pointer", padding: 0, flexShrink: 0 }}
                        onClick={() => setEditingNotes(true)}
                    >
                        {draftNotes ? "Edit" : "+ Add"}
                    </button>
                </div>
            ) : (
                <div style={{ marginBottom: "12px" }}>
                    <textarea
                        style={{
                            width: "100%", minHeight: "72px", padding: "8px 10px",
                            borderRadius: "6px", border: "1px solid #cbd5e1",
                            fontSize: "13px", fontFamily: "inherit", resize: "vertical",
                            outline: "none", backgroundColor: "#f8fafc", color: "#0f172a",
                            boxSizing: "border-box",
                        }}
                        value={draftNotes}
                        onChange={(e) => setDraftNotes(e.target.value)}
                        placeholder="Add notes about this role..."
                        autoFocus
                    />
                    <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                        <button
                            style={{
                                padding: "6px 16px",
                                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                                color: "white", border: "none", borderRadius: "6px",
                                fontSize: "12px", fontWeight: "600", cursor: "pointer",
                                flex: isMobile ? "1" : "unset",
                            }}
                            onClick={handleSaveNotes}
                            disabled={savingNotes}
                        >
                            {savingNotes ? "Saving..." : "Save"}
                        </button>
                        <button
                            style={{
                                padding: "6px 14px", backgroundColor: "#f1f5f9", color: "#475569",
                                border: "1px solid #e2e8f0", borderRadius: "6px",
                                fontSize: "12px", fontWeight: "600", cursor: "pointer",
                                flex: isMobile ? "1" : "unset",
                            }}
                            onClick={handleCancelNotes}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: isMobile ? "wrap" : "nowrap" }}>
                <select
                    style={{
                        padding: "7px 10px", borderRadius: "6px", border: "1px solid #e2e8f0",
                        fontSize: "13px", cursor: "pointer", backgroundColor: "#f8fafc",
                        color: "#374151", fontWeight: "500",
                        flex: isMobile ? "1" : "unset",
                    }}
                    value={job.status}
                    onChange={handleStatusChange}
                >
                    <option value="APPLIED">Applied</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Rejected</option>
                </select>

                <button
                    style={{
                        padding: "7px 14px", backgroundColor: "#fef2f2", color: "#dc2626",
                        border: "1px solid #fecaca", borderRadius: "6px",
                        fontSize: "13px", fontWeight: "600", cursor: "pointer",
                    }}
                    onClick={handleDelete}
                >
                    Delete
                </button>

                <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 0 auto", whiteSpace: "nowrap" }}>
                    {new Date(job.appliedDate).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric"
                    })}
                </p>
            </div>
        </div>
    )
}

export default JobCard