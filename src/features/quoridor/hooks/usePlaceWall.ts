import {useCallback, useState} from "react"
import type {Position} from "../model/game"
import * as gameService from "../services/gameService"

export function usePlaceWall(gameId: string) {
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<unknown | null>(null)

    const placeWall = useCallback(async (
        playerId: number,
        position: Position,
        orientation: "HORIZONTAL" | "VERTICAL"
    ) => {
        setIsPending(true)
        setError(null)
        try {
            return await gameService.placeWall(gameId, playerId, position, orientation)
        } catch (err) {
            setError(err)
            console.error("Wall placement error:", err)
            throw err
        } finally {
            setIsPending(false)
        }
    }, [gameId])

    return { placeWall, isPending, error }
}