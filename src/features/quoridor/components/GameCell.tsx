import { Box } from "@mui/material"
import type { Position } from "../model/game"

interface GameCellProps {
    position: Position
    playerNumber: number | null
    onClick: (pos: Position) => void
}

const playerColors: Record<number, string> = {
    1: "#3b82f6",
    2: "#ef4444"
}

export function GameCell({ position, playerNumber, onClick }: GameCellProps) {
    const color = playerNumber ? playerColors[playerNumber] : undefined

    return (
        <Box
            onClick={() => onClick(position)}
            sx={{
                width: 50,
                height: 50,
                border: 2,
                borderColor: "divider",
                borderRadius: 1,
                bgcolor: color || "background.default",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                    bgcolor: color || "action.hover",
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
                    }}
                />
            )}
        </Box>
    )
}