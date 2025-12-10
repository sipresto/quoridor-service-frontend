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
    const WALL_COLOR = "#475569" // Slate-600

    // Offset to center the hitbox interaction between cells (prevents overlap jumping)
    // Hitbox covers from Middle of Cell X to Middle of Cell X+1
    const HITBOX_OFFSET = CELL_SIZE / 2
    const HITBOX_LENGTH = CELL_SIZE + GAP

    // Full Visual Dimensions of a wall
    const WALL_LENGTH = CELL_SIZE * 2 + GAP
    const WALL_THICKNESS = GAP

    // 1. RENDER PLACED WALLS (Solid, Static)
    // --------------------------------------
    if (occupiedOrientation === "HORIZONTAL") {
        return (
            <Tooltip title={`Wall: (${position.x}, ${position.y}) HORIZONTAL`}>
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
            </Tooltip>
        )
    }

    if (occupiedOrientation === "VERTICAL") {
        return (
            <Tooltip title={`Wall: (${position.x}, ${position.y}) VERTICAL`}>
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
            </Tooltip>
        )
    }

    // 2. RENDER INTERACTIVE HITBOXES (Transparent, Stable)
    // ----------------------------------------------------

    const ghostStyle = {
        position: "absolute",
        bgcolor: WALL_COLOR,
        opacity: 0, // Hidden by default
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
        // When hovering the HITBOX, show the GHOST child
        "&:hover .ghost-wall": {
            opacity: 0.5,
        }
    } as const

    return (
        <>
            {/* Horizontal Hitbox Zone */}
            <Tooltip title={`Place Horizontal`}>
                <Box
                    onClick={() => onWallClick(position, "HORIZONTAL")}
                    sx={{
                        ...hitBoxCommonStyle,
                        // Hitbox starts at Center of Cell X, goes to Center of Cell X+1
                        left: position.x * (CELL_SIZE + GAP) + HITBOX_OFFSET,
                        top: position.y * (CELL_SIZE + GAP) + CELL_SIZE,
                        width: HITBOX_LENGTH,
                        height: GAP, // Keep height tight to the gap to avoid vertical overlap
                    }}
                >
                    {/* Horizontal Ghost Wall (Visual Preview) */}
                    <Box
                        className="ghost-wall"
                        sx={{
                            ...ghostStyle,
                            // Position relative to the offset hitbox to center the visual wall
                            left: -HITBOX_OFFSET,
                            top: 0,
                            width: WALL_LENGTH,
                            height: WALL_THICKNESS
                        }}
                    />
                </Box>
            </Tooltip>

            {/* Vertical Hitbox Zone */}
            <Tooltip title={`Place Vertical`}>
                <Box
                    onClick={() => onWallClick(position, "VERTICAL")}
                    sx={{
                        ...hitBoxCommonStyle,
                        // Hitbox starts at Center of Row Y, goes to Center of Row Y+1
                        left: position.x * (CELL_SIZE + GAP) + CELL_SIZE,
                        top: position.y * (CELL_SIZE + GAP) + HITBOX_OFFSET,
                        width: GAP,
                        height: HITBOX_LENGTH,
                    }}
                >
                    {/* Vertical Ghost Wall (Visual Preview) */}
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
            </Tooltip>
        </>
    )
}