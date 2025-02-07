import { NextRequest, NextResponse } from 'next/server'
import { validateMove } from '@/utils/server/stockfish'

export async function POST(request: NextRequest) {
  try {
    const { move, fen } = await request.json()
    
    if (!move || !fen) {
      return NextResponse.json(
        { error: 'Move and FEN are required' },
        { status: 400 }
      )
    }

    const result = await validateMove(move, fen)
    
    if (!result.isValid) {
      return NextResponse.json(
        { error: 'Invalid move' },
        { status: 400 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error validating move:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
