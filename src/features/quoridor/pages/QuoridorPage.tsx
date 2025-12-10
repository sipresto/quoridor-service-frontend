import { Box, CircularProgress, Container, CssBaseline, ThemeProvider, Typography, Alert, Snackbar } from "@mui/material"
import { useMemo } from "react"
import { useParams } from "react-router-dom"
import { GameBoard } from "../components/GameBoard"
import { PlayerInfo } from "../components/PlayerInfo"
import { GameStatus } from "../components/GameStatus"
import { useGameState } from "../hooks/useGameState"
import { useMovePlayer } from "../hooks/useMovePlayer"
import { usePlaceWall } from "../hooks/usePlaceWall"
import { quoridorTheme } from "../theme"
import type { Position } from "../model/game"

export function QuoridorPage() {
    const { id } = useParams<{ id: string }>()

    const { gameId } = useMemo(() => {
        const params = new URLSearchParams(window.location.search)

        const idFromPath = id
        const idFromQuery = params.get("gameId")
        const finalGameId = idFromPath || idFromQuery || "test-game-id"

        return {
            gameId: finalGameId
        }
    }, [id])

    const { gameState, isLoading, error } = useGameState(gameId)
    const { move, isPending: isMoving, error: moveError } = useMovePlayer(gameId)
    const { placeWall, isPending: isPlacingWall, error: wallError } = usePlaceWall(gameId)

    const handleCellClick = (position: Position) => {
        if (gameState && gameState.status === "IN_PROGRESS") {
            // Allow manual control of whichever player's turn it is
            void move(gameState.currentPlayer, position)
        }
    }

    const handleWallClick = (position: Position, orientation: "HORIZONTAL" | "VERTICAL") => {
        if (gameState && gameState.status === "IN_PROGRESS") {
            const backendPosition = { ...position }

            if (orientation === "VERTICAL") {
                backendPosition.x += 1
            } else if (orientation === "HORIZONTAL") {
                backendPosition.y += 1
            }

            void placeWall(gameState.currentPlayer, backendPosition, orientation)
        }
    }

    if (isLoading) {
        return (
            <ThemeProvider theme={quoridorTheme}>
                <CssBaseline />
                <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center' }}>
                    <CircularProgress />
                </Container>
            </ThemeProvider>
        )
    }

    if (error || !gameState) {
        return (
            <ThemeProvider theme={quoridorTheme}>
                <CssBaseline />
                <Container maxWidth="lg" sx={{ mt: 4 }}>
                    <Alert severity="error">
                        {error instanceof Error ? error.message : "Could not load game. Is the backend running?"}
                    </Alert>
                </Container>
            </ThemeProvider>
        )
    }

    return (
        <ThemeProvider theme={quoridorTheme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <Box py={4}>
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
                        {(isMoving || isPlacingWall) && <Typography variant="caption" sx={{ mt: 1 }}>Sending move...</Typography>}
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default QuoridorPage