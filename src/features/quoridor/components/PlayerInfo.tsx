import { Box, Chip, Paper, Typography } from "@mui/material"
import type { Player } from "../model/game"

interface PlayerInfoProps {
    player: Player
    isActive: boolean
}

export function PlayerInfo({ player, isActive }: PlayerInfoProps) {
    return (
        <Paper
            elevation={isActive ? 8 : 2}
            sx={{
                p: 2,
                border: isActive ? 2 : 0,
                borderColor: player.color,
                transition: "all 0.3s ease",
            }}
        >
            <Box display="flex" alignItems="center" gap={2}>
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: player.color,
                        border: 2,
                        borderColor: "divider",
                    }}
                />
                <Box flex={1}>
                    <Typography variant="h6">Player {player.id}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Position: ({player.position.row}, {player.position.col})
                    </Typography>
                </Box>
                <Chip
                    label={`${player.wallsRemaining} walls`}
                    color={isActive ? "primary" : "default"}
                    variant={isActive ? "filled" : "outlined"}
                />
            </Box>
        </Paper>
    )
}
