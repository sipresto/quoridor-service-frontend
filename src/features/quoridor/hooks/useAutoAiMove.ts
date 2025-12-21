import type { GameState } from "../model/game.ts";
import { useEffect } from "react";
import { useMakeAiMove } from "./useMakeAiMove.ts";

export function useAutoAiMove({
                                  gameState,
                                  delay = 500,
                              }: {
    gameState: GameState | null
    delay?: number
}) {
    const { triggerAiMove, isPending: aiMovePending } = useMakeAiMove(gameState?.id || "");

    useEffect(() => {
        if (!gameState || gameState.status !== "IN_PROGRESS" || aiMovePending) {
            return
        }

        const currentPlayer =
            gameState.currentPlayer === 1
                ? gameState.player1
                : gameState.player2

        if (!currentPlayer.isHuman) {
            const timer = setTimeout(triggerAiMove, delay)
            return () => clearTimeout(timer)
        }
    }, [gameState, aiMovePending, triggerAiMove, delay])

    return aiMovePending
}