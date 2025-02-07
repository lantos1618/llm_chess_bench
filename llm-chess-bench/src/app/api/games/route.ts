import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ELO calculation constants
const K_FACTOR = 32
const EXPECTED_SCORE = (ratingA: number, ratingB: number) => {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400))
}

// Calculate new ELO ratings
const calculateEloChange = (
  whiteElo: number,
  blackElo: number,
  result: string
) => {
  let whiteScore: number
  switch (result) {
    case '1-0':
      whiteScore = 1
      break
    case '0-1':
      whiteScore = 0
      break
    case '1/2-1/2':
      whiteScore = 0.5
      break
    default:
      throw new Error('Invalid game result')
  }

  const expectedWhiteScore = EXPECTED_SCORE(whiteElo, blackElo)
  const whiteEloChange = Math.round(K_FACTOR * (whiteScore - expectedWhiteScore))
  const blackEloChange = -whiteEloChange

  return { whiteEloChange, blackEloChange }
}

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        whitePlayer: true,
        blackPlayer: true
      }
    })
    return NextResponse.json(games)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { whitePlayerId, blackPlayerId, pgn, result, moves } = body

    if (!whitePlayerId || !blackPlayerId || !pgn || !result || !moves) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get current ELO ratings
    const [whitePlayer, blackPlayer] = await Promise.all([
      prisma.personality.findUnique({ where: { id: whitePlayerId } }),
      prisma.personality.findUnique({ where: { id: blackPlayerId } })
    ])

    if (!whitePlayer || !blackPlayer) {
      return NextResponse.json(
        { error: 'Players not found' },
        { status: 404 }
      )
    }

    // Calculate ELO changes
    const { whiteEloChange, blackEloChange } = calculateEloChange(
      whitePlayer.elo,
      blackPlayer.elo,
      result
    )

    // Create game and update ELO ratings in a transaction
    const game = await prisma.$transaction(async (tx) => {
      // Create game record
      const game = await tx.game.create({
        data: {
          whitePlayerId,
          blackPlayerId,
          pgn,
          result,
          moves,
          whiteEloChange,
          blackEloChange
        },
        include: {
          whitePlayer: true,
          blackPlayer: true
        }
      })

      // Update player ELO ratings
      await tx.personality.update({
        where: { id: whitePlayerId },
        data: { elo: whitePlayer.elo + whiteEloChange }
      })

      await tx.personality.update({
        where: { id: blackPlayerId },
        data: { elo: blackPlayer.elo + blackEloChange }
      })

      // Record ELO history
      await tx.eloHistory.createMany({
        data: [
          {
            personalityId: whitePlayerId,
            elo: whitePlayer.elo + whiteEloChange
          },
          {
            personalityId: blackPlayerId,
            elo: blackPlayer.elo + blackEloChange
          }
        ]
      })

      return game
    })

    return NextResponse.json(game)
  } catch (error) {
    console.error('Error creating game:', error)
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    )
  }
}
