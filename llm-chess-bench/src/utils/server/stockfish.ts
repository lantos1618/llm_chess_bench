import { Engine } from 'stockfish.js'
import path from 'path'

let stockfishInstance: Engine | null = null

export function getStockfish(): Engine {
  if (!stockfishInstance) {
    // Use absolute path to stockfish in public directory
    const stockfishPath = path.join(process.cwd(), 'public', 'stockfish.js')
    stockfishInstance = new Engine(stockfishPath)
  }
  return stockfishInstance
}

export async function getNextMove(fen: string): Promise<string> {
  const engine = getStockfish()
  
  // Set position and get best move
  engine.position(fen)
  engine.goDepth(15) // Deeper analysis for better moves
  
  const bestMove = await new Promise<string>((resolve) => {
    engine.onMessage(({ bestMove }) => {
      if (bestMove) {
        resolve(bestMove)
      }
    })
  })

  return bestMove
}

export async function validateMove(move: string, fen: string): Promise<{
  isValid: boolean
  newFen?: string
  isGameOver?: boolean
  result?: string | null
}> {
  const engine = getStockfish()
  
  // Set position and get evaluation
  engine.position(fen)
  engine.goDepth(1) // Quick analysis to get legal moves
  
  const isValid = await new Promise<boolean>((resolve) => {
    let legalMoves: string[] = []
    engine.onMessage(({ bestMove, pv }) => {
      if (bestMove) {
        // pv contains all calculated legal moves
        legalMoves = pv?.split(' ') || []
        resolve(legalMoves.includes(move))
      }
    })
  })

  if (!isValid) {
    return { isValid: false }
  }

  // Get new position after move
  engine.position('startpos', [move])
  const newFen = engine.fen()
  
  // Check if game is over
  engine.isGameOver()
  const isGameOver = await new Promise<boolean>((resolve) => {
    engine.onMessage(({ type, value }) => {
      if (type === 'gameover') {
        resolve(value === 'true')
      }
    })
  })

  let result = null
  if (isGameOver) {
    // Get engine evaluation to determine result
    engine.goDepth(15)
    result = await new Promise<string>((resolve) => {
      engine.onMessage(({ type, value }) => {
        if (type === 'score') {
          // Parse engine evaluation to determine winner
          const score = parseInt(value || '0')
          if (Math.abs(score) > 1000) {
            // Large score indicates checkmate
            resolve(score > 0 ? '1-0' : '0-1')
          } else {
            // Otherwise it's likely a draw
            resolve('1/2-1/2')
          }
        }
      })
    })
  }

  return {
    isValid: true,
    newFen,
    isGameOver,
    result
  }
}
