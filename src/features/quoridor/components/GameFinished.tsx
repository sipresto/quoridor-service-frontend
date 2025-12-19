import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import {Box, Button, Stack, Typography} from "@mui/material";
import type {GameState} from "../model/game.ts";


interface gameFinishedProps {
    gameState: GameState
    onRematch: () => void
}

export function GameFinished({gameState, onRematch} : gameFinishedProps) {
    const VITE_PLATFORM_URL: string = import.meta.env.VITE_PLATFORM_URL;

    const handleRematchClick = () => {
        onRematch();
    };

    const canRematch = gameState.player1WantsRematch && gameState.player2WantsRematch;


    return (
        <Box
            textAlign="center"
            p={4}
            borderRadius={3}
            boxShadow={3}
            bgcolor="background.paper"
        >
            <EmojiEventsIcon color="primary" sx={{ fontSize: 64, mb: 2 }} />

            <Typography variant="h4" gutterBottom>
                Game Finished
            </Typography>

            <Typography variant="h6" color="text.secondary" gutterBottom>
                {gameState.winner === 1
                    ? `${gameState.player1.name} wins the game!`
                    : `${gameState.player2.name} wins the game!`}
            </Typography>

            <Stack spacing={2} mt={4}>
                <Button
                    variant="contained"
                    size="large"
                    disabled={canRematch}
                    onClick={handleRematchClick}
                >
                    {gameState.player2.isHuman
                        ? gameState.player1WantsRematch && gameState.player2WantsRematch
                            ? "Rematch Ready!"
                            : `Rematch ${gameState.player1WantsRematch || gameState.player2WantsRematch ? "1/2" : "0/2"}`
                        : "Rematch"
                    }
                </Button>

                <Button
                    variant="outlined"
                    size="large"
                    onClick={() => window.location.href = VITE_PLATFORM_URL}
                >
                    Return to Game Platform
                </Button>
            </Stack>

        </Box>
    )
}