import { useState, useCallback } from "react"
import type { Position } from "../model/game"
import * as gameService from "../services/gameService"

export function useMovePlayer(gameId: string) {
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<unknown | null>(null)

    const move = useCallback(async (playerId: number, position: Position) => {
        setIsPending(true)
        setError(null)
        try {
            return await gameService.movePlayer(gameId, playerId, position)
        } catch (err) {
            setError(err)
            console.error("Move error:", err)
            throw err
        } finally {
            setIsPending(false)
        }
    }, [gameId])

    return { move, isPending, error }
}