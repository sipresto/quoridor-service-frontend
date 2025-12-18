import axios from "axios"
import type { GameState, Position } from "../model/game"
import { getAuthHeaders } from "./authToken"
import { handleAxiosError } from "./errorHandling";

const API_BASE_PATH = "/api/games/quoridor"

interface GameCreatedResponse {
    gameUrl: string;
}

export async function createGame(difficulty: string, players: { id: string; name: string }[]): Promise<GameCreatedResponse> {
    try {
        const { data } = await axios.post<GameCreatedResponse>(
            API_BASE_PATH,
            { difficulty, players },
            {
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                }
            }
        );
        return data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function getGameState(gameId: string): Promise<GameState> {
    try {
        const { data } = await axios.get<GameState>(
            `${API_BASE_PATH}/${gameId}`,
            {
                headers: {
                    ...getAuthHeaders(),
                    'Accept': 'application/json'
                }
            }
        );
        return data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function movePlayer(gameId: string, position: Position): Promise<GameState> {
    try {
        const { data } = await axios.post<GameState>(
            `${API_BASE_PATH}/${gameId}/move`,
            {
                to: { x: position.x, y: position.y }
            },
            { headers: getAuthHeaders() }
        );
        return data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function placeWall(
    gameId: string,
    position: Position,
    orientation: "HORIZONTAL" | "VERTICAL"
): Promise<GameState> {
    try {
        const { data } = await axios.post<GameState>(
            `${API_BASE_PATH}/${gameId}/wall`,
            {
                wall: {
                    position: { x: position.x, y: position.y },
                    orientation
                }
            },
            { headers: getAuthHeaders() }
        );
        return data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function createRematch(gameId: string): Promise<GameState> {
    try {
        const { data } = await axios.post<GameState>(
            `${API_BASE_PATH}/${gameId}/rematch`,
            {},
            { headers: getAuthHeaders() }
        );
        return data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function resignGame(gameId: string): Promise<GameState> {
    try {
        const { data } = await axios.post<GameState>(
            `${API_BASE_PATH}/${gameId}/resign`,
            { headers: getAuthHeaders() }
        );
        return data;
    } catch (error) {
        handleAxiosError(error);
    }
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
            const data = await getGameState(gameId);
            consecutiveErrors = 0;
            onUpdate(data);
        } catch (error: unknown) {
            consecutiveErrors++;
            onError(error);

            if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
                console.error(`Stopping poll after ${MAX_CONSECUTIVE_ERRORS} consecutive errors`)
                clearInterval(intervalId)
            }
        }
    };

    void fetchData()

    const intervalId = setInterval(fetchData, intervalMs)

    return () => clearInterval(intervalId)
}