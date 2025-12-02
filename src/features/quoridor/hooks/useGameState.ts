import { useEffect, useState } from "react"
import type { GameAction, GameState } from "../model/game"
import { gameService } from "../services/gameService"

export function useGameState(gameId: string) {
    const [gameState, setGameState] = useState<GameState | null>(null)
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        let isMounted = true

        gameService.connect()

        const unsubscribe = gameService.onMessage((state) => {
            if (!isMounted) {
                return
            }

            setGameState(state)
            setConnected(true)
        })

        return () => {
            isMounted = false
            unsubscribe()
            gameService.disconnect()
            setConnected(false)
        }
    }, [gameId])

    const sendAction = (action: GameAction) => {
        void gameService.sendAction(action)
    }

    return { gameState, connected, sendAction }
}
