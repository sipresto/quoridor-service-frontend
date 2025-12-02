import { Alert, Box, Typography } from "@mui/material"
import type { GameState } from "../model/game"

interface GameStatusProps {
    gameState: GameState
}

export function GameStatus({ gameState }: GameStatusProps) {
    if (gameState.gameStatus === "finished") {
        const winner = gameState.players.find((p) => p.id === gameState.winner)
        return (
            <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="h6">Game Over! Player {gameState.winner} Wins!</Typography>
                {winner && <Typography variant="body2">Winner color: {winner.color}</Typography>}
            </Alert>
        )
    }

    const currentPlayer = gameState.players.find((p) => p.id === gameState.currentPlayer)

    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="h5" gutterBottom>
                Current Turn: Player {gameState.currentPlayer}
            </Typography>
            {currentPlayer && (
                <Typography variant="body1" color="text.secondary">
                    Playing as:{" "}
                    <Box component="span" sx={{ color: currentPlayer.color, fontWeight: "bold" }}>
                        {currentPlayer.color}
                    </Box>
                </Typography>
            )}
        </Box>
    )
}
