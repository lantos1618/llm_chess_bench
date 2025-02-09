import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface Persona {
  id: string
  name: string
  model: string
  elo: number
  configuration: Record<string, any>
}

interface Battle {
  id: string
  format: string
  persona1: Persona
  persona2: Persona
  status: 'pending' | 'active' | 'completed'
  winner?: string
  moves: any[]
}

interface AppState {
  selectedPersona?: Persona
  activeBattle?: Battle
  isConnected: boolean
  setSelectedPersona: (persona: Persona | undefined) => void
  setActiveBattle: (battle: Battle | undefined) => void
  setConnectionStatus: (status: boolean) => void
}

export const useStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        isConnected: false,
        setSelectedPersona: (persona) => set({ selectedPersona: persona }),
        setActiveBattle: (battle) => set({ activeBattle: battle }),
        setConnectionStatus: (status) => set({ isConnected: status }),
      }),
      {
        name: 'llm-chess-bench-storage',
      }
    )
  )
) 