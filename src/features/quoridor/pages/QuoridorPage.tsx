import {
    Box, CircularProgress, Container, Typography, Alert, Snackbar
} from "@mui/material"
import { useMemo, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { GameBoard } from "../components/GameBoard"
import { PlayerInfo } from "../components/PlayerInfo"
import { GameStatus } from "../components/GameStatus"
import { useGameState } from "../hooks/useGameState"
import { useMovePlayer } from "../hooks/useMovePlayer"
import { usePlaceWall } from "../hooks/usePlaceWall"
import type { Position } from "../model/game"

export function QuoridorPage() {
    console.log('=== QUORIDOR PAGE START ===');
    console.log('Component rendering');

    const { id } = useParams<{ id: string }>()
    console.log('useParams id:', id);

    useEffect(() => {
        console.log('QuoridorPage mounted');
        return () => console.log('QuoridorPage unmounted');
    }, []);

    const { gameId } = useMemo(() => {
        const params = new URLSearchParams(window.location.search)
        console.log('URL search params:', Array.from(params.entries()));

        const idFromPath = id
        const idFromQuery = params.get("gameId")
        const finalGameId = idFromPath || idFromQuery || "test-game-id"

        console.log('Determined gameId:', finalGameId);
        return {
            gameId: finalGameId
        }
    }, [id])

    console.log('Using gameId:', gameId);

    // Use the hooks but handle errors gracefully
    const { gameState, isLoading, error } = useGameState(gameId)
    const { move, isPending: isMoving, error: moveError } = useMovePlayer(gameId)
    const { placeWall, isPending: isPlacingWall, error: wallError } = usePlaceWall(gameId)

    // Temporary state to show something while debugging
    const [showDebug, setShowDebug] = useState(true);

    const handleCellClick = (position: Position) => {
        if (gameState && gameState.status === "IN_PROGRESS") {
            void move(gameState.currentPlayer, position)
        }
    }

    const handleWallClick = (position: Position, orientation: "HORIZONTAL" | "VERTICAL") => {
        if (gameState && gameState.status === "IN_PROGRESS") {
            void placeWall(gameState.currentPlayer, position, orientation)
        }
    }

    if (isLoading) {
        console.log('Showing loading state');
        return (
            <Container maxWidth="lg" sx={{
                display: 'flex',
                justifyContent: 'center',
                height: '100vh',
                alignItems: 'center',
                backgroundColor: '#f5f5f5'
            }}>
                <Box textAlign="center">
                    <CircularProgress />
                    <Typography sx={{ mt: 2 }}>Loading game {gameId}...</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Debug: Component is rendering
                    </Typography>
                </Box>
            </Container>
        )
    }

    if (error || !gameState) {
        console.log('Showing error state:', error);
        return (
            <Container maxWidth="lg" sx={{
                mt: 4,
                backgroundColor: '#ffebee',
                p: 3,
                borderRadius: 1
            }}>
                <Alert severity="error">
                    {error instanceof Error ? error.message : "Could not load game. Is the backend running?"}
                </Alert>
                <Typography sx={{ mt: 2 }}>
                    Game ID: {gameId}
                </Typography>
                <Typography>
                    URL: {window.location.href}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Check the Network tab for API requests to /api/games/quoridor
                </Typography>
            </Container>
        )
    }

    console.log('Rendering full game UI with gameState:', gameState);

    return (
        <Container maxWidth="lg">
            <Box py={4}>
                {/* Debug banner - can be removed later */}
                {showDebug && (
                    <Box sx={{
                        backgroundColor: '#e3f2fd',
                        p: 2,
                        mb: 2,
                        borderRadius: 1,
                        border: '1px solid #bbdefb'
                    }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" color="primary">
                                DEBUG: Quoridor Page is rendering! Game ID: {gameId}
                            </Typography>
                            <Typography
                                variant="caption"
                                onClick={() => setShowDebug(false)}
                                sx={{ cursor: 'pointer', color: 'primary.main' }}
                            >
                                Hide
                            </Typography>
                        </Box>
                    </Box>
                )}

                <Snackbar open={!!moveError || !!wallError} autoHideDuration={6000}>
                    <Alert severity="error">Invalid Move or Server Error</Alert>
                </Snackbar>

                <GameStatus gameState={gameState} />

                <Box display="flex" gap={4} flexWrap="wrap" justifyContent="center" mb={3}>
                    <PlayerInfo
                        player={gameState.player1}
                        position={gameState.board.player1Position}
                        wallsRemaining={gameState.player1WallsRemaining}
                        isActive={gameState.currentPlayer === 1}
                    />
                    <PlayerInfo
                        player={gameState.player2}
                        position={gameState.board.player2Position}
                        wallsRemaining={gameState.player2WallsRemaining}
                        isActive={gameState.currentPlayer === 2}
                    />
                </Box>

                <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center">
                    <GameBoard
                        gameState={gameState}
                        onCellClick={handleCellClick}
                        onWallClick={handleWallClick}
                    />
                    {(isMoving || isPlacingWall) && (
                        <Typography variant="caption" sx={{ mt: 1 }}>
                            Sending move...
                        </Typography>
                    )}
                </Box>
            </Box>
        </Container>
    )
}

export default QuoridorPage