'use client'

import { useState } from 'react'
import useStore from '@/store/useStore'

export default function NewGame() {
  const { personalities } = useStore()
  const [whiteId, setWhiteId] = useState<string>('')
  const [blackId, setBlackId] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!whiteId || !blackId) return

    const store = useStore.getState()
    store.initializeGame(parseInt(whiteId), parseInt(blackId))
  }

  return (
    <div className="bg-surface p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold text-text mb-4">Start New Game</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="whitePlayer" className="block text-sm font-medium text-text mb-1">
              White Player
            </label>
            <select
              id="whitePlayer"
              value={whiteId}
              onChange={(e) => setWhiteId(e.target.value)}
              className="mt-1 block w-full rounded-md border-2 border-secondary bg-bg text-text
                       focus:border-primary focus:ring-2 focus:ring-accent
                       transition-all px-3 py-2"
            >
              <option value="">Select player...</option>
              {personalities.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (ELO: {p.elo})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="blackPlayer" className="block text-sm font-medium text-text mb-1">
              Black Player
            </label>
            <select
              id="blackPlayer"
              value={blackId}
              onChange={(e) => setBlackId(e.target.value)}
              className="mt-1 block w-full rounded-md border-2 border-secondary bg-bg text-text
                       focus:border-primary focus:ring-2 focus:ring-accent
                       transition-all px-3 py-2"
            >
              <option value="">Select player...</option>
              {personalities.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (ELO: {p.elo})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={!whiteId || !blackId}
          className="w-full inline-flex justify-center rounded-md border-2 border-transparent px-4 py-2
                   bg-primary text-white font-medium hover:bg-accent focus:outline-none focus:ring-2
                   focus:ring-offset-2 focus:ring-accent transition-all disabled:opacity-50"
        >
          Start Game
        </button>
      </form>
    </div>
  )
}
