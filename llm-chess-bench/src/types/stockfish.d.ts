declare module 'stockfish.js' {
  export interface EngineMessage {
    bestMove?: string
    type?: string
    value?: string
    pv?: string
    [key: string]: any
  }

  export class Engine {
    constructor(path: string)
    position(position: string, moves?: string[]): void
    goDepth(depth: number): void
    isGameOver(): void
    fen(): string
    quit(): void
    onMessage(callback: (message: EngineMessage) => void): void
    getLegalMoves(callback: (moves: string[]) => void): void
  }
}
