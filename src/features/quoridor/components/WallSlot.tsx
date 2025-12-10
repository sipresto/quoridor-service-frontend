import { Box } from "@mui/material"
import type { Position } from "../model/game"

interface WallSlotProps {
    position: Position
    onWallClick: (position: Position, orientation: "HORIZONTAL" | "VERTICAL") => void
}

export function WallSlot({ position, onWallClick }: WallSlotProps) {
    const CELL_SIZE = 50
    const GAP = 8

    const hitBoxStyle = {
        position: "absolute",
        bgcolor: "transparent",
        cursor: "pointer",
        transition: "background-color 0.2s",
        "&:hover": {
            bgcolor: "rgba(0,0,0,0.2)",
        }
    } as const

    return (
        <>
            <Box
                onClick={() => onWallClick(position, "HORIZONTAL")}
                sx={{
                    ...hitBoxStyle,
                    left: position.x * (CELL_SIZE + GAP),
                    top: position.y * (CELL_SIZE + GAP) + CELL_SIZE,
                    width: CELL_SIZE * 2 + GAP,
                    height: GAP,
                }}
            />

            <Box
                onClick={() => onWallClick(position, "VERTICAL")}
                sx={{
                    ...hitBoxStyle,
                    left: position.x * (CELL_SIZE + GAP) + CELL_SIZE,
                    top: position.y * (CELL_SIZE + GAP),
                    width: GAP,
                    height: CELL_SIZE * 2 + GAP,
                }}
            />
        </>
    )
}