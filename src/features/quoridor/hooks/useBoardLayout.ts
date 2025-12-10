import { useMemo } from "react"
import type { GameState, Position } from "../model/game"

export const BOARD_SIZE = 9

export interface CellView {
    key: string
    position: Position
    playerNumber: number | null
}

export interface WallSlotView {
    key: string
    position: Position
}

const positionKey = (x: number, y: number) => `${x}-${y}`

export function useBoardLayout(gameState: GameState) {
    const playerLookup = useMemo(() => {
        const map = new Map<string, number>()

        const p1Pos = gameState.board.player1Position
        map.set(positionKey(p1Pos.x, p1Pos.y), 1)

        const p2Pos = gameState.board.player2Position
        map.set(positionKey(p2Pos.x, p2Pos.y), 2)

        return map
    }, [gameState.board.player1Position, gameState.board.player2Position])

    const cells: CellView[] = useMemo(() => {
        return Array.from({ length: BOARD_SIZE }).flatMap((_, y) =>
            Array.from({ length: BOARD_SIZE }).map((_, x) => ({
                key: positionKey(x, y),
                position: { x, y },
                playerNumber: playerLookup.get(positionKey(x, y)) || null,
            })),
        )
    }, [playerLookup])

    const wallSlots: WallSlotView[] = useMemo(() => {
        return Array.from({ length: BOARD_SIZE - 1 }).flatMap((_, y) =>
            Array.from({ length: BOARD_SIZE - 1 }).map((_, x) => ({
                key: `wall-container-${x}-${y}`,
                position: { x, y },
            })),
        )
    }, [])

    return { cells, wallSlots }
}