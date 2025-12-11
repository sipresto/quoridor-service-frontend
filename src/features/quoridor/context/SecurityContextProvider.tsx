import { type PropsWithChildren, useEffect, useState, useCallback, useRef } from 'react'
import SecurityContext, { type User } from './SecurityContext'
import { getToken } from '../services/authToken'
import { setupAxiosInterceptors } from '../services/axiosInstance'

export default function SecurityContextProvider({ children }: PropsWithChildren) {
    const [loggedInUser, setLoggedInUser] = useState<User | undefined>(undefined)
    const [isInitialised, setIsInitialised] = useState(false)
    const initRef = useRef(false)

    const refreshUserData = useCallback(async (): Promise<void> => {
        setTimeout(() => {
            window.location.href = import.meta.env.VITE_PLATFORM_URL || 'http://localhost:5173'
        }, 1000)
    }, [])

    useEffect(() => {
        if (initRef.current) return
        initRef.current = true

        const initialize = () => {
            try {
                const token = getToken()

                if (token) {
                    try {
                        const tokenParts = token.split('.')
                        if (tokenParts.length === 3) {
                            const payload = JSON.parse(atob(tokenParts[1]))

                            const user: User = {
                                username: payload.preferred_username || '',
                                name: payload.name || payload.preferred_username || '',
                                email: payload.email,
                                roles: payload.realm_access?.roles || [],
                                accessToken: token,
                                idToken: token,
                            }

                            setLoggedInUser(user)
                            setupAxiosInterceptors(token)
                        }
                    } catch {
                        setupAxiosInterceptors(token)
                    }
                }

                setIsInitialised(true)
            } catch {
                setIsInitialised(true)
            }
        }

        setTimeout(initialize, 0)
    }, [refreshUserData])

    const login = useCallback(() => {
        window.location.href = import.meta.env.VITE_PLATFORM_URL || 'http://localhost:5173'
    }, [])

    const logout = useCallback(() => {
        setLoggedInUser(undefined)
        window.location.href = import.meta.env.VITE_PLATFORM_URL || 'http://localhost:5173'
    }, [])

    const isAuthenticated = useCallback(() => {
        return !!getToken()
    }, [])

    return (
        <SecurityContext.Provider value={{
            isInitialised,
            isAuthenticated,
            loggedInUser,
            login,
            logout,
            keycloakInstance: null,
            refreshUserData,
        }}>
            {children}
        </SecurityContext.Provider>
    )
}