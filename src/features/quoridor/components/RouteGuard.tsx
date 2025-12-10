import { type PropsWithChildren, useContext, useEffect, useState } from 'react';
import SecurityContext from '../context/SecurityContext';
import { getToken } from '../services/authToken';

export function RouteGuard({ children }: PropsWithChildren) {
    console.log('RouteGuard rendering');

    const { isInitialised, isAuthenticated } = useContext(SecurityContext);
    const [hasToken, setHasToken] = useState<boolean>(false);
    const [checking, setChecking] = useState(true);

    console.log('RouteGuard context:', {
        isInitialised,
        isAuthenticated: isAuthenticated(),
        hasToken
    });

    useEffect(() => {
        console.log('RouteGuard useEffect running');
        const token = getToken();
        console.log('Token found in RouteGuard:', !!token);
        setHasToken(!!token);
        setChecking(false);
    }, []);

    // Debug: Show what's happening
    console.log('RouteGuard state:', { checking, hasToken, isInitialised });

    if (checking) {
        console.log('RouteGuard: Showing checking state');
        return <div>Checking authentication...</div>;
    }

    // If we have a token but context isn't initialized yet, wait
    if (hasToken && !isInitialised) {
        console.log('RouteGuard: Has token but context not initialized, waiting...');
        return <div>Loading game security...</div>;
    }

    // If no token at all, show error
    if (!hasToken) {
        console.log('RouteGuard: No token found');
        return (
            <div style={{
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: '#f8f9fa',
                color: '#495057',
                borderRadius: '8px',
                margin: '2rem'
            }}>
                <h3>Authentication Required</h3>
                <p>No authentication token found. Please launch the game from the main platform.</p>
                <p>URL: {window.location.href}</p>
                <button
                    onClick={() => window.location.href = import.meta.env.VITE_PLATFORM_URL || 'http://localhost:5173'}
                    style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
                >
                    Go to Platform
                </button>
            </div>
        );
    }

    console.log('RouteGuard: All checks passed, rendering children');
    return <>{children}</>;
}