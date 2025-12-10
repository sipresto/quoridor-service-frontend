import { useEffect, useState } from "react"
import axios from "axios"
import type { GameState } from "../model/game"
import { getGameState, pollGameState } from "../services/gameService"

export function useGameState(gameId: string) {
    const [gameState, setGameState] = useState<GameState | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        let isMounted = true

        getGameState(gameId)
            .then((state) => {
                if (isMounted) {
                    // Validate that we got a proper game state object
                    if (!state || typeof state !== 'object' || !state.board) {
                        throw new Error("Invalid game state received from server")
                    }
                    setGameState(state)
                    setIsLoading(false)
                    setError(null)
                }
            })
            .catch((err) => {
                if (isMounted) {
                    const errorMessage = err instanceof Error 
                        ? err.message 
                        : axios.isAxiosError(err) && err.response?.data
                            ? `Server error: ${typeof err.response.data === 'string' && err.response.data.includes('<!doctype') 
                                ? 'Received HTML instead of JSON. Check API endpoint configuration.' 
                                : JSON.stringify(err.response.data)}`
                            : String(err)
                    setError(new Error(errorMessage))
                    setIsLoading(false)
                }
            })

        const stopPolling = pollGameState(
            gameId,
            (state) => {
                if (isMounted) {
                    setGameState(state)
                    setError(null)
                }
            },
            (err) => {
                if (isMounted) {
                    setError(err instanceof Error ? err : new Error(String(err)))
                }
            },
            1000
        )

        return () => {
            isMounted = false
            stopPolling()
        }
    }, [gameId])

    return { gameState, isLoading, error }
}