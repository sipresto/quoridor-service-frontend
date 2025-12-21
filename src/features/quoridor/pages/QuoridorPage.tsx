import {
    Box,
    CircularProgress,
    Container,
    CssBaseline,
    ThemeProvider,
    Alert,
    Snackbar,
    Tooltip
} from "@mui/material"
import FlagIcon from '@mui/icons-material/Flag';
import {useEffect, useMemo, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"
import { GameBoard } from "../components/GameBoard"
import { PlayerInfo } from "../components/PlayerInfo"
import { GameStatus } from "../components/GameStatus"
import { useGameState } from "../hooks/useGameState"
import { useMovePlayer } from "../hooks/useMovePlayer"
import { usePlaceWall } from "../hooks/usePlaceWall"
import { quoridorTheme } from "../theme"
import type { Position } from "../model/game"
import {useResign} from "../hooks/useResign.ts";
import {GameFinished} from "../components/GameFinished.tsx";
import {useRematch} from "../hooks/useRematch.ts";
import {ResignDialog} from "../components/ResignDialog.tsx";
import {useLeave} from "../hooks/useLeave.ts";
import {useMakeAiMove} from "../hooks/useMakeAiMove.ts";

export function QuoridorPage() {
    const { id } = useParams<{ id: string }>()

    const { gameId } = useMemo(() => {
        const params = new URLSearchParams(window.location.search)
        const idFromPath = id
        const idFromQuery = params.get("gameId")
        const finalGameId = idFromPath || idFromQuery || "test-game-id"

        return {
            gameId: finalGameId
        }
    }, [id])

    const [confirmResignOpen, setConfirmResignOpen] = useState(false)
    const { gameState, isLoading, error } = useGameState(gameId)
    const navigate = useNavigate()
    const { move, error: moveError, setError: setMoveError } = useMovePlayer(gameId)
    const { placeWall, error: wallError, setError: setWallError } = usePlaceWall(gameId)
    const { triggerAiMove, isPending: aiMovePending } = useMakeAiMove(gameId || "");
    const { resignGame, error: resignError, setError: setResignError } = useResign(gameId)
    const { rematch, error: rematchError, setError: setRematchError } = useRematch(gameId)
    const { leave } = useLeave(gameId)

    useEffect(() => {
        if (!gameState || gameState.status !== "IN_PROGRESS" || aiMovePending) {
            return
        }

        const currentPlayer = gameState.currentPlayer === 1
            ? gameState.player1
            : gameState.player2

        if (!currentPlayer.isHuman) {
            const timer = setTimeout(() => {
                triggerAiMove()
            }, 500)

            return () => clearTimeout(timer)
        }
    }, [gameState, aiMovePending, triggerAiMove])

    const handleCellClick = (position: Position) => {
        if (gameState && gameState.status === "IN_PROGRESS") {
            void move(position)
        }
    }

    const handleWallClick = (position: Position, orientation: "HORIZONTAL" | "VERTICAL") => {
        if (gameState && gameState.status === "IN_PROGRESS") {
            const backendPosition = { ...position }
            if (orientation === "HORIZONTAL") {
                backendPosition.y += 1
            } else {
                backendPosition.x += 1
            }
            void placeWall(backendPosition, orientation)
        }
    }

    const handleResignClick = () => {
        if (gameState && gameState.status === "IN_PROGRESS") {
            void resignGame()
        }
    }

    if (gameState && gameState.status === "FINISHED") {
        if (gameState.newId !== null) {
            navigate(`/${gameState.newId}`)
        }
    }

    const handleRematch = async () => {
        const newGame = await rematch()

        if (newGame) {
            navigate(`/${newGame.id}`)
        }
    }

    const handleLeave = async () => {
        await leave()
    }

    const handleCloseError = () => {
        setMoveError(null)
        setWallError(null)
        setResignError(null)
        setRematchError(null)
    }

    if (isLoading) {
        return (
            <ThemeProvider theme={quoridorTheme}>
                <CssBaseline />
                <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center' }}>
                    <CircularProgress />
                </Container>
            </ThemeProvider>
        )
    }

    if (error || !gameState) {
        return (
            <ThemeProvider theme={quoridorTheme}>
                <CssBaseline />
                <Container maxWidth="lg" sx={{ mt: 4 }}>
                    <Alert severity="error">
                        {error instanceof Error ? error.message : "Could not load game. Is the backend running?"}
                    </Alert>
                </Container>
            </ThemeProvider>
        )
    }

    if (gameState.status === "FINISHED") {
        return (
            <ThemeProvider theme={quoridorTheme}>
                <CssBaseline />
                <Container
                    maxWidth="sm"
                    sx={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <GameFinished gameState={gameState} onLeave={handleLeave} onRematch={handleRematch} />
                </Container>
            </ThemeProvider>
        )
    }

    return (
        <ThemeProvider theme={quoridorTheme}>
            <CssBaseline />
            <Container maxWidth="lg">
                <Box py={4}>
                    <Snackbar
                        open={!!moveError || !!wallError || !!resignError || !!rematchError}
                        autoHideDuration={6000}
                        onClose={handleCloseError}
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    >
                        <Alert
                            severity="error"
                            onClose={handleCloseError}
                            sx={{ width: '100%' }}
                        >
                            {moveError || wallError || resignError || rematchError}
                        </Alert>
                    </Snackbar>

                    <GameStatus gameState={gameState} />
                    <Box display="flex" justifyContent="center" mb={3}>
                        <Box position="relative" display="inline-flex" gap={4}>
                            <PlayerInfo
                                player={gameState.player1}
                                position={gameState.board.player1Position}
                                wallsRemaining={gameState.player1WallsRemaining}
                                isActive={gameState.currentPlayer === 1}
                            />

                            <PlayerInfo
                                player={gameState.player2}
                                position={gameState.board.player2Position}
                                wallsRemaining={gameState.player2WallsRemaining}
                                isActive={gameState.currentPlayer === 2}
                            />
                            <Box
                                position="absolute"
                                sx={{
                                    left: '100%',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    ml: 2
                                }}
                            >
                                <Tooltip sx={{ scale: 2 }} title="Resign?" arrow>
                                    <FlagIcon
                                        color="error"
                                        cursor="pointer"
                                        onClick={() => setConfirmResignOpen(true)}
                                    />
                                </Tooltip>
                            </Box>
                        </Box>
                    </Box>

                    <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center">
                        {aiMovePending && (
                            <Box mb={2}>
                                <CircularProgress size={24} />
                                <Box component="span" ml={2}>AI is thinking...</Box>
                            </Box>
                        )}
                        <GameBoard
                            gameState={gameState}
                            onCellClick={handleCellClick}
                            onWallClick={handleWallClick}
                        />
                    </Box>

                    <ResignDialog
                        open={confirmResignOpen}
                        onCancel={() => setConfirmResignOpen(false)}
                        onConfirm={() => {
                            setConfirmResignOpen(false)
                            handleResignClick()
                        }}
                    />
                </Box>
            </Container>
        </ThemeProvider>
    )
}