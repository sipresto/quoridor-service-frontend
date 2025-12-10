import { Box } from "@mui/material"
import type { Position } from "../model/game"

interface GameCellProps {
    position: Position
    playerNumber: number | null
    isValidMove?: boolean
    onClick: (pos: Position) => void
}

const playerColors: Record<number, string> = {
    1: "#3b82f6",
    2: "#ef4444"
}

export function GameCell({ position, playerNumber, isValidMove, onClick }: GameCellProps) {
    const color = playerNumber ? playerColors[playerNumber] : undefined

    return (
        <Box
            onClick={() => onClick(position)}
            sx={{
                width: 50,
                height: 50,
                border: 2,
                borderColor: isValidMove ? "success.main" : "divider",
                borderRadius: 1,
                bgcolor: color || (isValidMove ? "rgba(46, 125, 50, 0.1)" : "background.default"),
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                "&:hover": {
                    bgcolor: color || (isValidMove ? "rgba(46, 125, 50, 0.2)" : "action.hover"),
                    transform: "scale(1.05)",
                },
            }}
        >
            {playerNumber && (
                <Box
                    sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        bgcolor: "white",
                        border: 3,
                        borderColor: color,
                        zIndex: 2,
                    }}
                />
            )}

            {isValidMove && !playerNumber && (
                <Box
                    sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "success.main",
                        opacity: 0.6,
                    }}
                />
            )}
        </Box>
    )
}