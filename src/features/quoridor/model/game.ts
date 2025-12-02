export interface Position {
    row: number
    col: number
}

export interface Player {
    id: number
    position: Position
    wallsRemaining: number
    color: string
}

export interface Wall {
    position: Position
    orientation: "horizontal" | "vertical"
}

export interface GameState {
    board: number[][]
    players: Player[]
    walls: Wall[]
    currentPlayer: number
    gameStatus: "playing" | "finished"
    winner: number | null
}

export interface MoveAction {
    type: "move"
    playerId: number
    position: Position
}

export interface WallAction {
    type: "wall"
    playerId: number
    position: Position
    orientation: "horizontal" | "vertical"
}

export type GameAction = MoveAction | WallAction
