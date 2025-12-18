import {useCallback, useState} from "react";
import * as gameService from "../services/gameService.ts";
import {GameError} from "../services/errorHandling.ts";

export function useRematch(gameId: string) {
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const rematch = useCallback(async () => {
        setIsPending(true)
        setError(null)
        try {
            return await gameService.createRematch(gameId)
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

    return {rematch, isPending, error, setError}
}
