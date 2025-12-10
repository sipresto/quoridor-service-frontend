import { type PropsWithChildren, useEffect, useState, useCallback, useRef } from 'react';
import SecurityContext, {type User} from './SecurityContext';
import { getToken } from '../services/authToken';
import { setupAxiosInterceptors } from '../services/axiosInstance';

export default function SecurityContextProvider({ children }: PropsWithChildren) {
    console.log('SecurityContextProvider rendering');

    const [loggedInUser, setLoggedInUser] = useState<User | undefined>(undefined);
    const [isInitialised, setIsInitialised] = useState(false);
    const initRef = useRef(false);

    const refreshUserData = useCallback(async (): Promise<void> => {
        console.log('refreshUserData called');
        // Can't refresh token here - must go back to platform
        console.warn('Token refresh not available in game. Returning to platform for refresh.');

        // Redirect to platform to get fresh token
        setTimeout(() => {
            window.location.href = import.meta.env.VITE_PLATFORM_URL || 'http://localhost:5173';
        }, 1000);
    }, []);

    useEffect(() => {
        console.log('SecurityContextProvider useEffect running');

        if (initRef.current) {
            console.log('Already initialized, skipping');
            return;
        }
        initRef.current = true;

        const initialize = () => {
            console.log('SecurityContextProvider: initialize function called');
            try {
                const token = getToken();
                console.log('SecurityContextProvider: Token found:', !!token);

                if (token) {
                    // Try to decode token to get user info
                    try {
                        const tokenParts = token.split('.');
                        if (tokenParts.length === 3) {
                            const payload = JSON.parse(atob(tokenParts[1]));
                            console.log('Token payload:', payload);

                            const user: User = {
                                username: payload.preferred_username || '',
                                name: payload.name || payload.preferred_username || '',
                                email: payload.email,
                                roles: payload.realm_access?.roles || [],
                                accessToken: token,
                                idToken: token,
                            };

                            console.log('Setting loggedInUser:', user);
                            setLoggedInUser(user);

                            // Setup axios with the token
                            console.log('Setting up axios interceptors');
                            setupAxiosInterceptors(token);
                        }
                    } catch (parseError) {
                        console.warn('Could not parse token, but using it anyway:', parseError);
                        // Still set up axios even if we can't parse
                        setupAxiosInterceptors(token);
                    }
                } else {
                    console.error('No token found. Game must be launched from platform.');
                }

                console.log('SecurityContextProvider: Setting isInitialised to true');
                setIsInitialised(true);
            } catch (error) {
                console.error('Security initialization failed:', error);
                console.log('SecurityContextProvider: Setting isInitialised to true despite error');
                setIsInitialised(true);
            }
        };

        // Use setTimeout to ensure initialization happens after render
        setTimeout(initialize, 0);
    }, [refreshUserData]);

    const login = useCallback(() => {
        console.log('login called');
        // Redirect to platform for login
        window.location.href = import.meta.env.VITE_PLATFORM_URL || 'http://localhost:5173';
    }, []);

    const logout = useCallback(() => {
        console.log('logout called');
        setLoggedInUser(undefined);
        // Redirect back to platform
        window.location.href = import.meta.env.VITE_PLATFORM_URL || 'http://localhost:5173';
    }, []);

    const isAuthenticated = useCallback(() => {
        const token = getToken();
        const authenticated = !!token;
        console.log('isAuthenticated called, returning:', authenticated);
        return authenticated;
    }, []);

    console.log('SecurityContextProvider returning with:', {
        isInitialised,
        loggedInUser: !!loggedInUser,
        isAuthenticated: isAuthenticated()
    });

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
    );
}