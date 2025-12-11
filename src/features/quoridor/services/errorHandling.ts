import axios from "axios";

export interface ApiErrorResponse {
    message: string;
}

export class GameError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "GameError";
    }
}

export function handleAxiosError(error: unknown): never {
    if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data as ApiErrorResponse;

        if (data && data.message) {
            throw new GameError(data.message);
        }
    }

    if (error instanceof Error) {
        throw new GameError(error.message);
    }

    throw new GameError("An unexpected error occurred");
}