import { Box, Paper } from "@mui/material"
import { useState, useEffect } from "react"
import type { GameState, Position } from "../model/game"
import { GameCell } from "./GameCell"
import { WallSlot } from "./WallSlot"
import { useBoardLayout } from "../hooks/useBoardLayout"

interface GameBoardProps {
    gameState: GameState
    onCellClick: (position: Position) => void
    onWallClick: (position: Position, orientation: "HORIZONTAL" | "VERTICAL") => void
}

export function GameBoard({ gameState, onCellClick, onWallClick }: GameBoardProps) {
    const [showMoves, setShowMoves] = useState(false)

    useEffect(() => {
        setShowMoves(false)
    }, [gameState.currentPlayer, gameState.status])

    const validMovesToDisplay = showMoves ? gameState.validMoves.validMoves : []

    const { cells, wallSlots } = useBoardLayout(gameState, validMovesToDisplay)

    const handleInternalCellClick = (position: Position) => {
        if (gameState.status !== "IN_PROGRESS") return

        const currentPlayer = gameState.currentPlayer
        const playerPos = currentPlayer === 1 ? gameState.board.player1Position : gameState.board.player2Position

        const isCurrentPlayer = position.x === playerPos.x && position.y === playerPos.y

        if (isCurrentPlayer) {
            setShowMoves(!showMoves)
            return
        }

        const isValidMove = gameState.validMoves.validMoves.some(
            (move) => move.x === position.x && move.y === position.y
        )

        if (showMoves && isValidMove) {
            onCellClick(position)
            setShowMoves(false)
        } else {
            setShowMoves(false)
        }
    }

    return (
        <Paper
            elevation={4}
            sx={{
                p: 3,
                display: "inline-block",
                bgcolor: "background.paper",
                position: "relative"
            }}
        >
            <BoardGrid cells={cells} onCellClick={handleInternalCellClick} />
            <WallOverlay wallSlots={wallSlots} onWallClick={onWallClick} />
        </Paper>
    )
}

function BoardGrid({ cells, onCellClick }: { cells: ReturnType<typeof useBoardLayout>["cells"]; onCellClick: (position: Position) => void }) {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: `repeat(9, 50px)`,
                gridTemplateRows: `repeat(9, 50px)`,
                gap: "8px",
            }}
        >
            {cells.map((cell) => (
                <GameCell
                    key={cell.key}
                    position={cell.position}
                    playerNumber={cell.playerNumber}
                    isValidMove={cell.isValidMove}
                    onClick={onCellClick}
                />
            ))}
        </Box>
    )
}

function WallOverlay({
                         wallSlots,
                         onWallClick,
                     }: {
    wallSlots: ReturnType<typeof useBoardLayout>["wallSlots"]
    onWallClick: (position: Position, orientation: "HORIZONTAL" | "VERTICAL") => void
}) {
    return (
        <Box
            sx={{
                position: "absolute",
                top: 24,
                left: 24,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
            }}
        >
            {wallSlots.map((slot) => (
                <Box key={slot.key} sx={{ pointerEvents: "auto" }}>
                    <WallSlot
                        position={slot.position}
                        occupiedOrientation={slot.occupiedOrientation}
                        onWallClick={onWallClick}
                    />
                </Box>
            ))}
        </Box>
    )
}