import { Alert, Typography } from "@mui/material"
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
            </Alert>
        )
    }
}