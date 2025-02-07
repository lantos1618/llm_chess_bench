'use client'

import { useState, useEffect } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'

interface ChessGameProps {
  fen: string
  pgn: string
  isGameOver: boolean
  onPositionChange?: (fen: string) => void
}

interface MoveHistory {
  moveNumber: number
  white: string
  black: string | null
  reasoning?: {
    white?: string
    black?: string
  }
}

export default function ChessGame({ fen, pgn, isGameOver, onPositionChange }: ChessGameProps) {
  const [game] = useState(new Chess())
  const [moveHistory, setMoveHistory] = useState<MoveHistory[]>([])

  useEffect(() => {
    if (pgn) {
      game.loadPgn(pgn)
      updateMoveHistory()
    }
  }, [pgn])

  useEffect(() => {
    if (fen) {
      game.load(fen)
      if (onPositionChange) {
        onPositionChange(game.fen())
      }
    }
  }, [fen])

  const updateMoveHistory = () => {
    const history = game.history({ verbose: true })
    const moves: MoveHistory[] = []
    
    for (let i = 0; i < history.length; i += 2) {
      const moveNumber = Math.floor(i / 2) + 1
      const whiteMove = history[i]
      const blackMove = history[i + 1]
      
      moves.push({
        moveNumber,
        white: whiteMove.san,
        black: blackMove ? blackMove.san : null
      })
    }
    
    setMoveHistory(moves)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-2/3">
        <Chessboard 
          position={fen}
          boardWidth={560}
          areArrowsAllowed={true}
          showBoardNotation={true}
          customDarkSquareStyle={{ backgroundColor: '#2D4B1A' }} // Darker green for better contrast
          customLightSquareStyle={{ backgroundColor: '#E8ECD3' }} // Slightly warmer light square
          customBoardStyle={{
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          }}
        />
      </div>
      
      <div className="w-full md:w-1/3 bg-surface p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-text mb-4">Move History</h3>
        <div className="overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-secondary scrollbar-track-secondary/20">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-secondary">#</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-secondary">White</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-secondary">Black</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/20">
              {moveHistory.map((move) => (
                <tr key={move.moveNumber} className="hover:bg-secondary/5 transition-colors">
                  <td className="px-4 py-2 text-sm text-secondary">{move.moveNumber}</td>
                  <td className="px-4 py-2 text-sm text-text">
                    {move.white}
                    {move.reasoning?.white && (
                      <p className="text-xs text-secondary mt-1">{move.reasoning.white}</p>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm text-text">
                    {move.black}
                    {move.reasoning?.black && (
                      <p className="text-xs text-secondary mt-1">{move.reasoning.black}</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
