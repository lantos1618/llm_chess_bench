'use client'

import { useEffect } from 'react'
import useStore, { fetchPersonalities } from '@/store/useStore'

export default function PersonalityList() {
  const { personalities, loading, error } = useStore()

  useEffect(() => {
    fetchPersonalities()
  }, [])

  if (loading) {
    return (
      <div className="bg-surface p-6 rounded-lg shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-secondary/20 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-secondary/20 rounded"></div>
            <div className="h-3 bg-secondary/20 rounded"></div>
            <div className="h-3 bg-secondary/20 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-surface p-6 rounded-lg shadow-lg">
        <div className="text-red-700 dark:text-red-200">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold text-text mb-4">AI Players</h2>
      
      {personalities.length === 0 ? (
        <p className="text-secondary">No personalities created yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-secondary/20">
            <thead>
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-text">
                  Name
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-text">
                  ELO
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-text">
                  Games
                </th>
                <th scope="col" className="px-4 py-3 text-left text-sm font-semibold text-text">
                  Style
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/20">
              {personalities.map((personality) => (
                <tr key={personality.id} className="hover:bg-secondary/5 transition-colors">
                  <td className="px-4 py-3 text-sm text-text">
                    {personality.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-text">
                    {personality.elo || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-text">
                    {((personality as any).gamesAsWhite?.length || 0) + 
                     ((personality as any).gamesAsBlack?.length || 0)}
                  </td>
                  <td className="px-4 py-3 text-sm text-text">
                    {personality.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
