import { createContext } from 'react'

export type User = {
    username: string
    name: string
    email?: string
    roles: string[]
    accessToken: string
    idToken?: string
}

export type SecurityContext = {
    isInitialised: boolean
    isAuthenticated: () => boolean
    loggedInUser: User | undefined
    refreshUserData: (forceTokenRefresh?: boolean) => Promise<void>
}

export default createContext<SecurityContext>({
    isInitialised: false,
    isAuthenticated: () => false,
    loggedInUser: undefined,
    refreshUserData: async () => {},
})