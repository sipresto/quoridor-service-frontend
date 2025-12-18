import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"
import {Box, Button, Stack, Typography} from "@mui/material";
import type {GameState} from "../model/game.ts";
import {useState} from "react";


interface gameFinishedProps {
    gameState: GameState
    onRematch: () => void
}

export function GameFinished({gameState, onRematch} : gameFinishedProps) {
    const VITE_PLATFORM_URL: string = import.meta.env.VITE_PLATFORM_URL;
    const [isRematch, setRematch] = useState(false);


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
                    disabled={isRematch}
                    onClick={() => {
                        onRematch()
                        setRematch(true);
                    }}
                >
                    Rematch
                </Button>

                <Button
                    variant="outlined"
                    size="large"
                    // TODO: link this to the lobby page
                    onClick={ () => window.location.href = VITE_PLATFORM_URL}
                >
                    Return to Game Platform
                </Button>
            </Stack>

        </Box>
        )
}