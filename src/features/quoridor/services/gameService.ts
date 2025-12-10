import apiClient from './axiosInstance';
import type { GameState, Position } from "../model/game";

const API_BASE_PATH = import.meta.env.VITE_BACKEND_URL;

export async function getGameState(gameId: string): Promise<GameState> {
    const { data } = await apiClient.get<GameState>(
        `${API_BASE_PATH}/${gameId}`
    );

    if (!data || typeof data !== 'object' || !data.board) {
        throw new Error('Invalid game state structure received from server');
    }

    return data;
}

export async function movePlayer(gameId: string, playerId: number, position: Position): Promise<GameState> {
    const { data } = await apiClient.post<GameState>(
        `${API_BASE_PATH}/${gameId}/move`,
        {
            player: playerId,
            to: { x: position.x, y: position.y }
        }
    );
    return data;
}

export async function placeWall(
    gameId: string,
    playerId: number,
    position: Position,
    orientation: "HORIZONTAL" | "VERTICAL"
): Promise<GameState> {
    const { data } = await apiClient.post<GameState>(
        `${API_BASE_PATH}/${gameId}/wall`,
        {
            player: playerId,
            wall: {
                position: { x: position.x, y: position.y },
                orientation
            }
        }
    );
    return data;
}

export function pollGameState(
    gameId: string,
    onUpdate: (gameState: GameState) => void,
    onError: (error: unknown) => void,
    intervalMs: number = 1000
) {
    let consecutiveErrors = 0;
    const MAX_CONSECUTIVE_ERRORS = 5;

    const fetchData = async () => {
        try {
            const data = await getGameState(gameId);
            consecutiveErrors = 0;
            onUpdate(data);
        } catch (error: unknown) {
            consecutiveErrors++;
            onError(error);

            if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
                console.error(`Stopping poll after ${MAX_CONSECUTIVE_ERRORS} consecutive errors`);
                clearInterval(intervalId);
            }
        }
    };

    void fetchData();
    const intervalId = setInterval(fetchData, intervalMs);

    return () => clearInterval(intervalId);
}