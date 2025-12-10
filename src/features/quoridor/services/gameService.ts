import axios from "axios"
import type { GameState, Position } from "../model/game"
import { getAuthHeaders } from "./authToken"

const API_BASE_PATH = "/api/games/quoridor"

export async function getGameState(gameId: string): Promise<GameState> {
    const { data } = await axios.get<GameState>(
        `${API_BASE_PATH}/${gameId}`,
        { 
            headers: {
                ...getAuthHeaders(),
                'Accept': 'application/json'
            }
        }
    )
    
    if (!data || typeof data !== 'object' || !data.board) {
        throw new Error('Invalid game state structure received from server')
    }
    
    return data
}

export async function movePlayer(gameId: string, playerId: number, position: Position): Promise<GameState> {
    const { data } = await axios.post<GameState>(
        `${API_BASE_PATH}/${gameId}/move`,
        {
            player: playerId,
            to: { x: position.x, y: position.y }
        },
        { headers: getAuthHeaders() }
    )
    return data
}

export async function placeWall(
    gameId: string,
    playerId: number,
    position: Position,
    orientation: "HORIZONTAL" | "VERTICAL"
): Promise<GameState> {
    const { data } = await axios.post<GameState>(
        `${API_BASE_PATH}/${gameId}/wall`,
        {
            player: playerId,
            wall: {
                position: { x: position.x, y: position.y },
                orientation
            }
        },
        { headers: getAuthHeaders() }
    )
    return data
}

export function pollGameState(
    gameId: string,
    onUpdate: (gameState: GameState) => void,
    onError: (error: unknown) => void,
    intervalMs: number = 1000
) {
    let consecutiveErrors = 0
    const MAX_CONSECUTIVE_ERRORS = 5

    const fetchData = async () => {
        try {
            const data = await getGameState(gameId)
            consecutiveErrors = 0
            onUpdate(data)
        } catch (error: unknown) {
            consecutiveErrors++
            onError(error)

            if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
                console.error(`Stopping poll after ${MAX_CONSECUTIVE_ERRORS} consecutive errors`)
                clearInterval(intervalId)
            }
        }
    }

    void fetchData()

    const intervalId = setInterval(fetchData, intervalMs)

    return () => clearInterval(intervalId)
}