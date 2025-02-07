import { create } from 'zustand'
import { PrismaClient } from '@prisma/client'
export interface LLMResponse {
  move: string
  reasoning?: string
}

const prisma = new PrismaClient()
type Personality = Awaited<ReturnType<typeof prisma.personality.findUnique>>
type Game = Awaited<ReturnType<typeof prisma.game.findUnique>>

interface GameState {
  whitePlayerId: number | null
  blackPlayerId: number | null
  pgn: string
  moves: number
  currentPosition: string
  isGameOver: boolean
  result: string | null
  currentReasoning: string | null
}

interface StoreState {
  // Data
  personalities: NonNullable<Personality>[]
  games: NonNullable<Game>[]
  loading: boolean
  error: string | null
  gameState: GameState
  
  // Actions
  setPersonalities: (personalities: NonNullable<Personality>[]) => void
  addPersonality: (personality: NonNullable<Personality>) => void
  setGames: (games: NonNullable<Game>[]) => void
  addGame: (game: NonNullable<Game>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Game Actions
  initializeGame: (whiteId: number, blackId: number) => void
  updateGameState: (llmResponse: LLMResponse) => Promise<void>
  playNextMove: () => Promise<void>
  forfeitGame: (result: string) => Promise<void>
}

const initialGameState: GameState = {
  whitePlayerId: null,
  blackPlayerId: null,
  pgn: '',
  moves: 0,
  currentPosition: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  isGameOver: false,
  result: null,
  currentReasoning: null
}

const useStore = create<StoreState>((set, get) => ({
  // Initial State
  personalities: [],
  games: [],
  loading: false,
  error: null,
  gameState: initialGameState,

  // Basic Actions
  setPersonalities: (personalities) => set({ personalities }),
  addPersonality: (personality) => 
    set((state) => ({ 
      personalities: [...state.personalities, personality] 
    })),
  setGames: (games) => set({ games }),
  addGame: (game) =>
    set((state) => ({
      games: [...state.games, game]
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Game Actions
  initializeGame: (whiteId, blackId) => {
    set({
      gameState: {
        ...initialGameState,
        whitePlayerId: whiteId,
        blackPlayerId: blackId
      }
    })
    get().playNextMove()
  },

  updateGameState: async (llmResponse: LLMResponse) => {
    const { gameState } = get()
    
    try {
      const response = await fetch('/api/moves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          move: llmResponse.move,
          fen: gameState.currentPosition
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to validate move')
      }

      const { newFen, isGameOver, result } = await response.json()

      // Update game state
      set({
        gameState: {
          ...gameState,
          pgn: gameState.pgn ? `${gameState.pgn} ${llmResponse.move}` : llmResponse.move,
          moves: gameState.moves + 1,
          currentPosition: newFen,
          currentReasoning: llmResponse.reasoning || null,
          isGameOver: isGameOver || false,
          result: result || null
        }
      })

      if (isGameOver && result) {
        get().forfeitGame(result)
      } else {
        get().playNextMove()
      }
    } catch (error) {
      console.error('Error updating game state:', error)
      // On error, forfeit the game
      const isWhiteToMove = gameState.moves % 2 === 0
      const result = isWhiteToMove ? '0-1' : '1-0'
      get().forfeitGame(result)
    }
  },

  playNextMove: async () => {
    const { gameState, personalities } = get()
    if (gameState.isGameOver) return

    // Get current player's personality
    const isWhiteToMove = gameState.moves % 2 === 0
    const currentPlayerId = isWhiteToMove ? gameState.whitePlayerId : gameState.blackPlayerId
    const currentPlayer = personalities.find(p => p.id === currentPlayerId)

    if (!currentPlayer) return

    try {
      // Generate move using LLM API
      const response = await fetch('/api/moves/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personality: {
            name: currentPlayer.name,
            description: currentPlayer.description
          },
          fen: gameState.currentPosition,
          pgn: gameState.pgn,
          isWhite: isWhiteToMove
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate move')
      }

      const llmResponse = await response.json()

      // Validate and update with move
      get().updateGameState(llmResponse)
    } catch (error) {
      console.error('Error generating move:', error)
      // On error, forfeit the game
      const result = isWhiteToMove ? '0-1' : '1-0'
      get().forfeitGame(result)
    }
  },

  forfeitGame: async (result: string) => {
    const { gameState } = get()
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          whitePlayerId: gameState.whitePlayerId,
          blackPlayerId: gameState.blackPlayerId,
          pgn: gameState.pgn,
          result,
          moves: gameState.moves
        }),
      })

      if (!response.ok) throw new Error('Failed to save game')
      const game = await response.json()
      
      set((state) => ({
        games: [...state.games, game],
        gameState: {
          ...state.gameState,
          isGameOver: true,
          result
        }
      }))
    } catch (error) {
      console.error('Error saving game:', error)
      set((state) => ({
        error: 'Failed to save game',
        gameState: {
          ...state.gameState,
          isGameOver: true,
          result
        }
      }))
    }
  }
}))

// API actions
export const fetchPersonalities = async () => {
  const store = useStore.getState()
  store.setLoading(true)
  store.setError(null)
  
  try {
    const response = await fetch('/api/personalities')
    if (!response.ok) throw new Error('Failed to fetch personalities')
    const data = await response.json()
    store.setPersonalities(data)
  } catch (error) {
    store.setError(error instanceof Error ? error.message : 'Failed to fetch personalities')
  } finally {
    store.setLoading(false)
  }
}

export const createPersonality = async (name: string, description: string) => {
  const store = useStore.getState()
  store.setLoading(true)
  store.setError(null)
  
  try {
    const response = await fetch('/api/personalities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    })
    
    if (!response.ok) throw new Error('Failed to create personality')
    const personality = await response.json()
    store.addPersonality(personality)
    return personality
  } catch (error) {
    store.setError(error instanceof Error ? error.message : 'Failed to create personality')
    throw error
  } finally {
    store.setLoading(false)
  }
}

export const fetchGames = async () => {
  const store = useStore.getState()
  store.setLoading(true)
  store.setError(null)
  
  try {
    const response = await fetch('/api/games')
    if (!response.ok) throw new Error('Failed to fetch games')
    const data = await response.json()
    store.setGames(data)
  } catch (error) {
    store.setError(error instanceof Error ? error.message : 'Failed to fetch games')
  } finally {
    store.setLoading(false)
  }
}

export default useStore
