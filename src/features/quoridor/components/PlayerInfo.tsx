import { Box, Chip, Paper, Typography } from "@mui/material"
import type { Player, Position } from "../model/game"

interface PlayerInfoProps {
    player: Player
    position: Position
    wallsRemaining: number
    isActive: boolean
}

const playerColors: Record<number, string> = {
    1: "#3b82f6",
    2: "#ef4444"
}

export function PlayerInfo({ player, wallsRemaining, isActive }: PlayerInfoProps) {
    const playerNumber = player.isHuman ? 1 : 2
    const color = playerColors[playerNumber] || "#6b7280"

    return (
        <Paper
            elevation={isActive ? 8 : 2}
            sx={{
                p: 2,
                border: isActive ? 2 : 0,
                borderColor: color,
                transition: "all 0.3s ease", width: 280,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}
        >
            <Box display="flex" alignItems="center" gap={2} width="100%">
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: color,
                        border: 2,
                        borderColor: "divider",
                        flexShrink: 0
                    }}
                />

                <Box flex={1} minWidth={0}>
                    <Typography variant="h6" noWrap title={player.name}>
                        {player.name}
                    </Typography>
                </Box>

                <Chip
                    label={`${wallsRemaining} walls`}
                    color={isActive ? "primary" : "default"}
                    variant={isActive ? "filled" : "outlined"}
                />
            </Box>
        </Paper>
    )
}