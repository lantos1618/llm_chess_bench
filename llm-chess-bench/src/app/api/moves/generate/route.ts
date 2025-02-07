import { NextRequest, NextResponse } from 'next/server'
import { generateMove } from '@/services/llm'

export async function POST(request: NextRequest) {
  try {
    const { personality, fen, pgn, isWhite } = await request.json()
    
    if (!personality || !fen || typeof isWhite !== 'boolean') {
      return NextResponse.json(
        { error: 'Personality, FEN, and isWhite are required' },
        { status: 400 }
      )
    }

    const result = await generateMove(personality, fen, pgn || '', isWhite)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error generating move:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
