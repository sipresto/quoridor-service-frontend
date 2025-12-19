export interface Position {
    x: number
    y: number
}

export interface Player {
    id: string | null
    name: string
    isHuman: boolean
}

export interface Wall {
    position: Position
    orientation: "HORIZONTAL" | "VERTICAL"
}

export interface Board {
    player1Position: Position
    player2Position: Position
    walls: Wall[]
}

export interface ValidActions {
    validMoves: Position[]
    validWallPlacements: Wall[]
}

export interface GameState {
    id: string
    player1: Player
    player2: Player
    currentPlayer: number
    board: Board
    player1WallsRemaining: number
    player2WallsRemaining: number
    status: "IN_PROGRESS" | "FINISHED"
    winner: number | null
    validMoves: ValidActions
}
