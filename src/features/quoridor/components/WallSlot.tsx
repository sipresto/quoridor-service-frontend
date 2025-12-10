import { Box } from "@mui/material"
import type { Position } from "../model/game"

interface WallSlotProps {
    position: Position
    occupiedOrientation: "HORIZONTAL" | "VERTICAL" | null
    onWallClick: (position: Position, orientation: "HORIZONTAL" | "VERTICAL") => void
}

export function WallSlot({ position, occupiedOrientation, onWallClick }: WallSlotProps) {
    const CELL_SIZE = 50
    const GAP = 8
    const WALL_COLOR = "#475569"


    const horizontalStyle = {
        left: position.x * (CELL_SIZE + GAP),
        top: position.y * (CELL_SIZE + GAP) + CELL_SIZE,
        width: CELL_SIZE * 2 + GAP,
        height: GAP,
    }

    const verticalStyle = {
        left: position.x * (CELL_SIZE + GAP) + CELL_SIZE,
        top: position.y * (CELL_SIZE + GAP),
        width: GAP,
        height: CELL_SIZE * 2 + GAP,
    }

    if (occupiedOrientation === "HORIZONTAL") {
        return (
            <Box
                sx={{
                    position: "absolute",
                    bgcolor: WALL_COLOR,
                    borderRadius: 1,
                    boxShadow: 2,
                    zIndex: 10,
                    ...horizontalStyle
                }}
            />
        )
    }

    if (occupiedOrientation === "VERTICAL") {
        return (
            <Box
                sx={{
                    position: "absolute",
                    bgcolor: WALL_COLOR,
                    borderRadius: 1,
                    boxShadow: 2,
                    zIndex: 10,
                    ...verticalStyle
                }}
            />
        )
    }

    const hitBoxStyle = {
        position: "absolute",
        bgcolor: "transparent",
        cursor: "pointer",
        transition: "background-color 0.2s",
        zIndex: 5,
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
                    ...horizontalStyle
                }}
            />

            <Box
                onClick={() => onWallClick(position, "VERTICAL")}
                sx={{
                    ...hitBoxStyle,
                    ...verticalStyle
                }}
            />
        </>
    )
}