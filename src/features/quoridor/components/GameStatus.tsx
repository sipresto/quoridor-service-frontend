import { Alert, Box, Typography } from "@mui/material"
import type { GameState } from "../model/game"

interface GameStatusProps {
    gameState: GameState
}

export function GameStatus({ gameState }: GameStatusProps) {
    if (gameState.status === "FINISHED") {
        const winner = gameState.winner === 1 ? gameState.player1 : gameState.player2
        return (
            <Alert severity="success" sx={{ mb: 2 }}>
                <Typography variant="h6">Game Over! {winner.name} wins!</Typography>
                <Typography variant="body2">Player {gameState.winner}</Typography>
            </Alert>
        )
    }

    const currentPlayer = gameState.currentPlayer === 1 ? gameState.player1 : gameState.player2
    const currentPosition = gameState.currentPlayer === 1 ? gameState.board.player1Position : gameState.board.player2Position

    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="h5" gutterBottom>
                Current Turn: {currentPlayer.name} (Player {gameState.currentPlayer})
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Position: ({currentPosition.x}, {currentPosition.y})
            </Typography>
        </Box>
    )
}