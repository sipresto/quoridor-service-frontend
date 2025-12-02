import { Box } from "@mui/material"
import type { Position } from "../model/game"

interface WallSlotProps {
    position: Position
}

export function WallSlot({ position }: WallSlotProps) {
    const CELL_SIZE = 50
    const GAP = 8

    return (
        <>
            <Box
                sx={{
                    position: "absolute",
                    left: position.col * (CELL_SIZE + GAP),
                    top: position.row * (CELL_SIZE + GAP) + CELL_SIZE,
                    width: CELL_SIZE * 2 + GAP,
                    height: GAP,
                    bgcolor: "transparent",
                    pointerEvents: "none",
                }}
            />

            <Box
                sx={{
                    position: "absolute",
                    left: position.col * (CELL_SIZE + GAP) + CELL_SIZE,
                    top: position.row * (CELL_SIZE + GAP),
                    width: GAP,
                    height: CELL_SIZE * 2 + GAP,
                    bgcolor: "transparent",
                    pointerEvents: "none",
                }}
            />
        </>
    )
}

