import { Box, Paper } from "@mui/material"
import type { GameState, Position } from "../model/game"
import { GameCell } from "./GameCell"
import { WallSlot } from "./WallSlot"

interface GameBoardProps {
    gameState: GameState
    onCellClick: (position: Position) => void
    onWallClick: (position: Position, orientation: "horizontal" | "vertical") => void
    currentPlayerId: number
}

export function GameBoard({ gameState, onCellClick }: GameBoardProps) {
    const BOARD_SIZE = 9

    const getPlayerAtPosition = (row: number, col: number) => {
        return gameState.players.find((p) => p.position.row === row && p.position.col === col)
    }

    return (
        <Paper
            elevation={4}
            sx={{
                p: 3,
                display: "inline-block",
                bgcolor: "background.paper",
            }}
        >
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${BOARD_SIZE}, 50px)`,
                    gridTemplateRows: `repeat(${BOARD_SIZE}, 50px)`,
                    gap: "8px",
                    position: "relative",
                }}
            >
                {Array.from({ length: BOARD_SIZE }).map((_, row) =>
                    Array.from({ length: BOARD_SIZE }).map((_, col) => {
                        const player = getPlayerAtPosition(row, col)

                        return (
                            <GameCell
                                key={`${row}-${col}`}
                                position={{ row, col }}
                                player={player}
                                isValid={false}
                                onClick={() => onCellClick({ row, col })}
                            />
                        )
                    }),
                )}
            </Box>

            {/* Wall placement slots */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    pointerEvents: "none",
                }}
            >
                {Array.from({ length: BOARD_SIZE - 1 }).map((_, row) =>
                    Array.from({ length: BOARD_SIZE - 1 }).map((_, col) => (
                        <WallSlot
                            key={`wall-${row}-${col}`}
                            position={{ row, col }}
                        />
                    )),
                )}
            </Box>
        </Paper>
    )
}
