import { useCallback, useState } from "react"
import type { Position } from "../model/game"
import * as gameService from "../services/gameService"
import { GameError } from "../services/errorHandling"

export function useMovePlayer(gameId: string) {
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const move = useCallback(async (
        playerId: number,
        position: Position
    ) => {
        setIsPending(true)
        setError(null)
        try {
            return await gameService.movePlayer(gameId, playerId, position)
        } catch (err) {
            if (err instanceof GameError) {
                setError(err.message)
            } else if (err instanceof Error) {
                setError(err.message)
            } else {
                setError("An unexpected error occurred")
            }
        } finally {
            setIsPending(false)
        }
    }, [gameId])

    return { move, isPending, error, setError }
}