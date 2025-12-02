import { useState } from "react"
import { Box, CircularProgress, Container, CssBaseline, ThemeProvider, Typography, createTheme } from "@mui/material"
import { GameBoard } from "../components/GameBoard"
import { PlayerInfo } from "../components/PlayerInfo"
import { useGameState } from "../hooks/useGameState"
import type { Position } from "../model/game"

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#1976d2",
        },
        secondary: {
            main: "#dc004e",
        },
    },
})

export function QuoridorPage() {
    const gameId =
        typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("gameId") || "default" : "default"
    const [playerId] = useState<number>(1)

    const { gameState, connected, sendAction } = useGameState(gameId)

    const handleCellClick = (position: Position) => {
        if (gameState && gameState.currentPlayer === playerId && gameState.gameStatus === "playing") {
            sendAction({
                type: "move",
                playerId,
                position,
            })
        }
    }

    const handleWallClick = (position: Position, orientation: "horizontal" | "vertical") => {
        if (gameState && gameState.currentPlayer === playerId && gameState.gameStatus === "playing") {
            sendAction({
                type: "wall",
                playerId,
                position,
                orientation,
            })
        }
    }

    if (!connected || !gameState) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Container maxWidth="lg">
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        minHeight="100vh"
                        gap={2}
                    >
                        <CircularProgress size={60} />
                        <Typography variant="h5">Connecting to game service...</Typography>
                    </Box>
                </Container>
            </ThemeProvider>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <Box py={4}>

                    <Box display="flex" gap={4} flexWrap="wrap" justifyContent="center" mb={3}>
                        {gameState.players.map((player) => (
                            <PlayerInfo key={player.id} player={player} isActive={gameState.currentPlayer === player.id} />
                        ))}
                    </Box>

                    <Box display="flex" justifyContent="center">
                        <GameBoard
                            gameState={gameState}
                            onCellClick={handleCellClick}
                            onWallClick={handleWallClick}
                            currentPlayerId={playerId}
                        />
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default QuoridorPage
