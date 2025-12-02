import { Box } from "@mui/material"
import type { Player, Position } from "../model/game"

interface GameCellProps {
    position: Position
    player: Player | undefined
    isValid: boolean
    onClick: () => void
}

export function GameCell({ player, isValid, onClick }: GameCellProps) {
    return (
        <Box
            onClick={onClick}
            sx={{
                width: 50,
                height: 50,
                border: 2,
                borderColor: "divider",
                borderRadius: 1,
                bgcolor: player ? player.color : "background.default",
                cursor: isValid ? "pointer" : "default",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                    bgcolor: player ? player.color : isValid ? "action.hover" : "background.default",
                    transform: isValid ? "scale(1.05)" : "none",
                },
            }}
        >
            {player && (
                <Box
                    sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        bgcolor: "white",
                        border: 3,
                        borderColor: player.color,
                    }}
                />
            )}
        </Box>
    )
}
