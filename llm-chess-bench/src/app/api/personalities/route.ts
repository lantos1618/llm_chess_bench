import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const personalities = await prisma.personality.findMany({
      orderBy: {
        elo: 'desc'
      }
    })
    return NextResponse.json(personalities)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch personalities' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      )
    }

    const personality = await prisma.personality.create({
      data: {
        name,
        description,
        elo: 1500 // Starting ELO rating
      }
    })

    return NextResponse.json(personality)
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'A personality with this name already exists' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create personality' },
      { status: 500 }
    )
  }
}
