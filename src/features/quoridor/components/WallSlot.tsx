import { Box, Tooltip } from "@mui/material"
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

    // Horizontal wall: sits in the gap below the cell
    const horizontalStyle = {
        left: position.x * (CELL_SIZE + GAP),
        top: position.y * (CELL_SIZE + GAP) + CELL_SIZE,
        width: CELL_SIZE * 2 + GAP,
        height: GAP,
    }

    // Vertical wall: sits in the gap to the right of the cell
    const verticalStyle = {
        left: position.x * (CELL_SIZE + GAP) + CELL_SIZE,
        top: position.y * (CELL_SIZE + GAP),
        width: GAP,
        height: CELL_SIZE * 2 + GAP,
    }

    if (occupiedOrientation === "HORIZONTAL") {
        return (
            <Tooltip title={`Wall: (${position.x}, ${position.y}) HORIZONTAL`}>
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
            </Tooltip>
        )
    }

    if (occupiedOrientation === "VERTICAL") {
        return (
            <Tooltip title={`Wall: (${position.x}, ${position.y}) VERTICAL`}>
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
            </Tooltip>
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
            <Tooltip title={`Place Horizontal (${position.x}, ${position.y})`}>
                <Box
                    onClick={() => onWallClick(position, "HORIZONTAL")}
                    sx={{
                        ...hitBoxStyle,
                        ...horizontalStyle
                    }}
                />
            </Tooltip>

            <Tooltip title={`Place Vertical (${position.x}, ${position.y})`}>
                <Box
                    onClick={() => onWallClick(position, "VERTICAL")}
                    sx={{
                        ...hitBoxStyle,
                        ...verticalStyle
                    }}
                />
            </Tooltip>
        </>
    )
}