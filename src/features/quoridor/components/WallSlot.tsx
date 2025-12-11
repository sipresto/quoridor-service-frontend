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
    const WALL_COLOR = "#475569" // Slate-600

    const HITBOX_OFFSET = CELL_SIZE / 2
    const HITBOX_LENGTH = CELL_SIZE + GAP

    const WALL_LENGTH = CELL_SIZE * 2 + GAP
    const WALL_THICKNESS = GAP

    if (occupiedOrientation === "HORIZONTAL") {
        return (
                <Box
                    sx={{
                        position: "absolute",
                        left: position.x * (CELL_SIZE + GAP),
                        top: position.y * (CELL_SIZE + GAP) + CELL_SIZE,
                        width: WALL_LENGTH,
                        height: WALL_THICKNESS,
                        bgcolor: WALL_COLOR,
                        borderRadius: 1,
                        boxShadow: 2,
                        zIndex: 10,
                    }}
                />
        )
    }

    if (occupiedOrientation === "VERTICAL") {
        return (
                <Box
                    sx={{
                        position: "absolute",
                        left: position.x * (CELL_SIZE + GAP) + CELL_SIZE,
                        top: position.y * (CELL_SIZE + GAP),
                        width: WALL_THICKNESS,
                        height: WALL_LENGTH,
                        bgcolor: WALL_COLOR,
                        borderRadius: 1,
                        boxShadow: 2,
                        zIndex: 10,
                    }}
                />
        )
    }

    const ghostStyle = {
        position: "absolute",
        bgcolor: WALL_COLOR,
        opacity: 0,
        borderRadius: 1,
        pointerEvents: "none",
        transition: "opacity 0.1s ease-in-out",
        zIndex: 20
    }

    const hitBoxCommonStyle = {
        position: "absolute",
        bgcolor: "transparent",
        cursor: "pointer",
        zIndex: 5,
        "&:hover .ghost-wall": {
            opacity: 0.5,
        }
    } as const

    return (
        <>
                <Box
                    onClick={() => onWallClick(position, "HORIZONTAL")}
                    sx={{
                        ...hitBoxCommonStyle,
                        left: position.x * (CELL_SIZE + GAP) + HITBOX_OFFSET,
                        top: position.y * (CELL_SIZE + GAP) + CELL_SIZE,
                        width: HITBOX_LENGTH,
                        height: GAP,
                    }}
                >
                    <Box
                        className="ghost-wall"
                        sx={{
                            ...ghostStyle,
                            left: -HITBOX_OFFSET,
                            top: 0,
                            width: WALL_LENGTH,
                            height: WALL_THICKNESS
                        }}
                    />
                </Box>

                <Box
                    onClick={() => onWallClick(position, "VERTICAL")}
                    sx={{
                        ...hitBoxCommonStyle,
                        left: position.x * (CELL_SIZE + GAP) + CELL_SIZE,
                        top: position.y * (CELL_SIZE + GAP) + HITBOX_OFFSET,
                        width: GAP,
                        height: HITBOX_LENGTH,
                    }}
                >
                    <Box
                        className="ghost-wall"
                        sx={{
                            ...ghostStyle,
                            left: 0,
                            top: -HITBOX_OFFSET,
                            width: WALL_THICKNESS,
                            height: WALL_LENGTH
                        }}
                    />
                </Box>
        </>
    )
}