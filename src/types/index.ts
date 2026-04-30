export interface User {
    email: string
    name: string
}

export interface Job {
    id: number
    companyName: string
    role: string
    jobUrl: string
    notes: string
    status: "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED"
    appliedDate: string
    updatedAt: string
}

export interface AuthResponse {
    token: string
    email: string
    name: string
}

export interface JobRequest {
    companyName: string
    role: string
    jobUrl: string
    notes: string
}