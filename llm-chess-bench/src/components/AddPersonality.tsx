'use client'

import { useState } from 'react'
import { createPersonality } from '@/store/useStore'

export default function AddPersonality() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      // Validate inputs
      if (!name.trim() || !description.trim()) {
        throw new Error('Name and description are required')
      }

      if (name.length < 3) {
        throw new Error('Name must be at least 3 characters long')
      }

      if (description.length < 10) {
        throw new Error('Description must be at least 10 characters long')
      }

      // Create personality
      await createPersonality(name.trim(), description.trim())
      
      // Reset form
      setName('')
      setDescription('')
      setSuccess(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create personality')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold text-text mb-4">Add New Personality</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-2 border-secondary bg-bg text-text
                     placeholder:text-secondary focus:border-primary focus:ring-2 focus:ring-accent
                     transition-all px-3 py-2"
            placeholder="e.g., Aggressive Player"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-text mb-1">
            Playing Style Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-2 border-secondary bg-bg text-text
                     placeholder:text-secondary focus:border-primary focus:ring-2 focus:ring-accent
                     transition-all px-3 py-2"
            placeholder="Describe the personality's playing style, tendencies, and strategic preferences..."
            disabled={loading}
          />
          <p className="mt-1 text-sm text-secondary">
            Be specific about the playing style to help the AI make appropriate moves.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
            <p className="text-sm text-green-700 dark:text-green-200">
              Personality created successfully!
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex justify-center rounded-md border-2 border-transparent px-4 py-2
                   bg-primary text-white font-medium hover:bg-accent focus:outline-none focus:ring-2
                   focus:ring-offset-2 focus:ring-accent transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </>
          ) : (
            'Create Personality'
          )}
        </button>
      </form>
    </div>
  )
}
