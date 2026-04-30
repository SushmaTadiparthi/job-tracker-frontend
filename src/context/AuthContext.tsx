import { createContext, useContext, useState, type ReactNode } from "react"
import { type User } from "../types"

interface AuthContextType {
    user: User | null
    token: string | null
    login: (token: string, user: User) => void
    logout: () => void
    isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    )
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem("user")
        return saved ? JSON.parse(saved) : null
    })

    const login = (newToken: string, userData: User) => {
        localStorage.setItem("token", newToken)
        localStorage.setItem("user", JSON.stringify(userData))
        setToken(newToken)
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{
            user, token, login, logout,
            isLoggedIn: !!token
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth must be used within AuthProvider")
    return context
}