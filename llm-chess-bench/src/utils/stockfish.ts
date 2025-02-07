import { Engine } from 'stockfish.js'

let stockfishInstance: Engine | null = null

export function initializeStockfish(): Engine {
  if (stockfishInstance) {
    return stockfishInstance
  }

  if (typeof window !== 'undefined') {
    stockfishInstance = new Engine('/stockfish.js')
    return stockfishInstance
  }

  throw new Error('Stockfish can only be initialized in browser environment')
}

export function getStockfish(): Engine {
  if (!stockfishInstance) {
    return initializeStockfish()
  }
  return stockfishInstance
}
