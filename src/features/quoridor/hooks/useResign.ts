import {useCallback, useState} from "react";
import * as gameService from "../services/gameService.ts";
import {GameError} from "../services/errorHandling.ts";

export function useResign(gameId: string) {
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const resignGame = useCallback(async () => {
        setIsPending(true)
        setError(null)
        try {
            return await gameService.resignGame(gameId)
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

    return {resignGame, isPending, error, setError}
}
