import { useCallback, useState } from "react"
import type { Position } from "../model/game"
import * as gameService from "../services/gameService"
import { GameError } from "../services/errorHandling"

export function usePlaceWall(gameId: string) {
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const placeWall = useCallback(async (
        position: Position,
        orientation: "HORIZONTAL" | "VERTICAL"
    ) => {
        setIsPending(true)
        setError(null)
        try {
            return await gameService.placeWall(gameId, position, orientation)
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

    return { placeWall, isPending, error, setError }
}