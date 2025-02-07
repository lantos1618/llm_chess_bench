'use client'

import { useEffect } from 'react'
import useStore, { fetchGames } from '@/store/useStore'
import Link from 'next/link'

export default function GamesPage() {
  const { games, loading } = useStore()

  useEffect(() => {
    fetchGames()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Chess Games</h1>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          New Game
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {games.map((game) => (
            <li key={game.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-900">
                      {game.whitePlayer.name} (White) vs {game.blackPlayer.name} (Black)
                    </p>
                    <p className="text-sm text-gray-500">
                      Result: {game.result} • Moves: {game.moves}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-sm text-gray-500">
                      ELO Change: {game.whiteEloChange > 0 ? '+' : ''}{game.whiteEloChange} / {game.blackEloChange > 0 ? '+' : ''}{game.blackEloChange}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(game.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-gray-700 font-mono bg-gray-50 p-2 rounded overflow-x-auto">
                    {game.pgn}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {games.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500">No games played yet</p>
        </div>
      )}
    </div>
  )
}
