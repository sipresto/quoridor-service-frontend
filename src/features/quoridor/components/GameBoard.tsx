import { Box, Paper } from "@mui/material"
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
    const { cells, wallSlots } = useBoardLayout(gameState)

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
            <BoardGrid cells={cells} onCellClick={onCellClick} />
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
                    <WallSlot position={slot.position} onWallClick={onWallClick} />
                </Box>
            ))}
        </Box>
    )
}