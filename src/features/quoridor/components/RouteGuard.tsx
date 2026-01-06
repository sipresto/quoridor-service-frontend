import { type PropsWithChildren, useContext, useEffect, useState } from 'react'
import { Box, Typography, Button, CircularProgress, Paper } from '@mui/material'
import SecurityContext from '../context/SecurityContext'
import { getToken } from '../services/authToken'

export function RouteGuard({ children }: PropsWithChildren) {
    const { isInitialised, isAuthenticated } = useContext(SecurityContext)
    const [hasToken, setHasToken] = useState<boolean>(false)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        const token = getToken()
        setHasToken(!!token)
        setChecking(false)
    }, [])

    if (checking) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Box textAlign="center">
                    <CircularProgress />
                    <Typography sx={{ mt: 2 }}>Checking authentication...</Typography>
                </Box>
            </Box>
        )
    }

    if (hasToken && !isInitialised) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Box textAlign="center">
                    <CircularProgress />
                    <Typography sx={{ mt: 2 }}>Loading game security...</Typography>
                </Box>
            </Box>
        )
    }

    if (!hasToken || !isAuthenticated()) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                p={2}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        maxWidth: 600,
                        textAlign: 'center',
                        backgroundColor: '#f8f9fa'
                    }}
                >
                    <Typography variant="h5" gutterBottom color="error">
                        Authentication Required
                    </Typography>

                    <Typography variant="body1">
                        No authentication token found. Please launch the game from the main platform.
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Game URL: {window.location.origin}
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => window.location.href = "/"}
                        sx={{ mt: 2 }}
                    >
                        Go to Platform
                    </Button>
                </Paper>
            </Box>
        )
    }

    return <>{children}</>
}