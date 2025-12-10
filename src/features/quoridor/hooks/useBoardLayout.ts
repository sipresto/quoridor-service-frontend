import { useMemo } from "react"
import type { GameState, Position } from "../model/game"

export const BOARD_SIZE = 9

export interface CellView {
    key: string
    position: Position
    playerNumber: number | null
    isValidMove: boolean
}

export interface WallSlotView {
    key: string
    position: Position
    occupiedOrientation: "HORIZONTAL" | "VERTICAL" | null
}

const positionKey = (x: number, y: number) => `${x}-${y}`

export function useBoardLayout(gameState: GameState, validMoves: Position[] = []) {
    const playerLookup = useMemo(() => {
        const map = new Map<string, number>()

        const p1Pos = gameState.board.player1Position
        map.set(positionKey(p1Pos.x, p1Pos.y), 1)

        const p2Pos = gameState.board.player2Position
        map.set(positionKey(p2Pos.x, p2Pos.y), 2)

        return map
    }, [gameState.board.player1Position, gameState.board.player2Position])

    const validMoveLookup = useMemo(() => {
        const set = new Set<string>()
        validMoves.forEach(pos => set.add(positionKey(pos.x, pos.y)))
        return set
    }, [validMoves])

    // Create a lookup for existing walls
    const wallLookup = useMemo(() => {
        const map = new Map<string, "HORIZONTAL" | "VERTICAL">()

        const walls = gameState.board.walls || []

        walls.forEach((wall) => {
            // ASYMMETRIC COORDINATE FIX:
            // Based on visual debugging:
            // 1. Horizontal walls (y-axis is the 'line'): Appear 1 unit too low. Needs y-1. X appears correct.
            // 2. Vertical walls (x-axis is the 'line'): Appear 1 unit too right and 1 unit too low. Needs x-1, y-1.

            let x = wall.position.x
            let y = wall.position.y

            if (wall.orientation === "HORIZONTAL") {
                y = y - 1
            } else if (wall.orientation === "VERTICAL") {
                x = x - 1
                y = y - 1
            }

            map.set(positionKey(x, y), wall.orientation)
        })
        return map
    }, [gameState.board.walls])

    const cells: CellView[] = useMemo(() => {
        return Array.from({ length: BOARD_SIZE }).flatMap((_, y) =>
            Array.from({ length: BOARD_SIZE }).map((_, x) => {
                const key = positionKey(x, y)
                return {
                    key,
                    position: { x, y },
                    playerNumber: playerLookup.get(key) || null,
                    isValidMove: validMoveLookup.has(key)
                }
            }),
        )
    }, [playerLookup, validMoveLookup])

    const wallSlots: WallSlotView[] = useMemo(() => {
        return Array.from({ length: BOARD_SIZE - 1 }).flatMap((_, y) =>
            Array.from({ length: BOARD_SIZE - 1 }).map((_, x) => ({
                key: `wall-container-${x}-${y}`,
                position: { x, y },
                occupiedOrientation: wallLookup.get(positionKey(x, y)) || null
            })),
        )
    }, [wallLookup])

    return { cells, wallSlots }
}