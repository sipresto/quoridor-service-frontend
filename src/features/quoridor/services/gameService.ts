import type { GameAction, GameState, Player, Wall } from "../model/game"

type GameStateListener = (state: GameState) => void

class MockGameService {
    private readonly listeners = new Set<GameStateListener>()
    private currentGame: GameState | null = null
    private pollTimer: number | null = null

    connect() {
        if (!this.currentGame) {
            this.currentGame = this.createInitialGameState()
        }

        this.startPolling()
        this.broadcast()
    }

    disconnect() {
        if (this.pollTimer !== null) {
            clearInterval(this.pollTimer)
            this.pollTimer = null
        }
    }

    onMessage(listener: GameStateListener) {
        this.listeners.add(listener)

        if (this.currentGame) {
            listener(this.currentGame)
        }

        return () => {
            this.listeners.delete(listener)
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async sendAction(_action: GameAction) {
        if (this.currentGame) {
            this.broadcast()
        }
    }

    private startPolling() {
        if (this.pollTimer !== null) {
            return
        }

        this.pollTimer = window.setInterval(() => {
            if (this.currentGame) {
                this.broadcast()
            }
        }, 1000)
    }

    private broadcast() {
        if (!this.currentGame) {
            return
        }

        for (const listener of this.listeners) {
            listener(this.currentGame)
        }
    }

    private createInitialGameState(): GameState {
        const BOARD_SIZE = 9

        const board: number[][] = Array.from({ length: BOARD_SIZE }, () =>
            Array.from({ length: BOARD_SIZE }, () => 1),
        )

        const players: Player[] = [
            {
                id: 1,
                position: { row: BOARD_SIZE - 1, col: Math.floor(BOARD_SIZE / 2) },
                wallsRemaining: 10,
                color: "#1976d2",
            },
            {
                id: 2,
                position: { row: 0, col: Math.floor(BOARD_SIZE / 2) },
                wallsRemaining: 10,
                color: "#dc004e",
            },
        ]

        const walls: Wall[] = []

        return {
            board,
            players,
            walls,
            currentPlayer: 1,
            gameStatus: "playing",
            winner: null,
        }
    }

}

export const gameService = new MockGameService()

