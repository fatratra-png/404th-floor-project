import { PuzzleType } from '../types'
import type { PuzzleConfig } from '../types'

export function checkSolution(config: PuzzleConfig, answer: unknown): boolean {
  switch (config.kind) {
    case PuzzleType.SORT: {
      const c = config as import('../types').SortConfig
      const arr = answer as number[]
      return arr.length === c.values.length && arr.every((v, i) => i === 0 || arr[i - 1] <= v)
    }
    case PuzzleType.TWO_SUM: {
      const c = config as import('../types').TwoSumConfig
      const [a, b] = answer as [number, number]
      return a !== b && c.numbers[a] + c.numbers[b] === c.target
    }
    case PuzzleType.SEQUENCE: {
      const c = config as import('../types').SequenceConfig
      const v = answer as number
      return v === c.answer
    }
    case PuzzleType.MAZE: {
      const c = config as import('../types').MazeConfig
      const path = answer as [number, number][]
      if (path.length === 0) return false
      const [er, ec] = c.end
      const [lr, lc] = path[path.length - 1]
      if (lr !== er || lc !== ec) return false
      for (let i = 1; i < path.length; i++) {
        const [pr, pc] = path[i - 1]
        const [r, c2] = path[i]
        const dr = Math.abs(r - pr)
        const dc = Math.abs(c2 - pc)
        if (dr + dc !== 1) return false
        if (c.grid[r][c2] === 1) return false
      }
      const [sr, sc] = c.start
      if (path[0][0] !== sr || path[0][1] !== sc) return false
      return true
    }
    case PuzzleType.FACTOR: {
      const c = config as import('../types').FactorConfig
      const factors = answer as number[]
      const product = factors.reduce((a, b) => a * b, 1)
      if (product !== c.number) return false
      const sorted = [...factors].sort((a, b) => a - b)
      const expected = [...c.factors].sort((a, b) => a - b)
      return sorted.length === expected.length && sorted.every((v, i) => v === expected[i])
    }
    case PuzzleType.BALANCE: {
      const c = config as import('../types').BalanceConfig
      return (answer as boolean) === c.balanced
    }
    case PuzzleType.PALINDROME: {
      const c = config as import('../types').PalindromeConfig
      return (answer as boolean) === c.isPalindrome
    }
    case PuzzleType.BINARY: {
      const c = config as import('../types').BinaryConfig
      return (answer as string) === c.binary
    }
    case PuzzleType.PATTERN: {
      const c = config as import('../types').PatternConfig
      return (answer as number) === c.answerIndex
    }
    case PuzzleType.GRAPH: {
      const c = config as import('../types').GraphConfig
      const path = answer as number[]
      if (path.length < 2) return false
      if (path[0] !== c.start || path[path.length - 1] !== c.end) return false
      const edgeSet = new Set(c.edges.map(e => `${e[0]},${e[1]}`))
      for (let i = 1; i < path.length; i++) {
        const key = `${path[i - 1]},${path[i]}`
        const rev = `${path[i]},${path[i - 1]}`
        if (!edgeSet.has(key) && !edgeSet.has(rev)) return false
      }
      return true
    }
    case PuzzleType.CODING: {
      const c = config as import('../types').CodingConfig
      return (answer as string).toLowerCase().trim() === c.answer.toLowerCase().trim()
    }
    case PuzzleType.NETWORK: {
      const c = config as import('../types').NetworkConfig
      return (answer as number) === c.answerIndex
    }
    case PuzzleType.HEX: {
      const c = config as import('../types').HexConfig
      if (c.direction === 'to_decimal') {
        return (answer as number) === c.decimal
      }
      return (answer as string).toLowerCase() === c.hex.toLowerCase()
    }
    case PuzzleType.MATH: {
      const c = config as import('../types').MathConfig
      return (answer as number) === c.answer
    }
    case PuzzleType.AI: {
      const c = config as import('../types').AIConfig
      return (answer as number) === c.answerIndex
    }
    case PuzzleType.DB: {
      const c = config as import('../types').DBConfig
      return (answer as number) === c.answerIndex
    }
  }
}

export function generateValues(length: number, max: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * max) + 1)
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function generateSortedArray(n: number): number[] {
  const arr: number[] = []
  let v = Math.floor(Math.random() * 5) + 1
  for (let i = 0; i < n; i++) {
    arr.push(v)
    v += Math.floor(Math.random() * 5) + 1
  }
  return arr
}

export function generateMaze(w: number, h: number): { grid: number[][]; start: [number, number]; end: [number, number] } {
  const grid = Array.from({ length: h }, () => Array(w).fill(0))
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (Math.random() < 0.25) grid[r][c] = 1
    }
  }
  grid[0][0] = 0
  grid[h - 1][w - 1] = 0
  return { grid, start: [0, 0], end: [h - 1, w - 1] }
}

export function generatePrimeFactors(n: number): number[] {
  const factors: number[] = []
  let d = 2
  let m = n
  while (m > 1) {
    while (m % d === 0) {
      factors.push(d)
      m /= d
    }
    d++
  }
  return factors
}

export function checkBalanced(s: string): boolean {
  const stack: string[] = []
  const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' }
  for (const ch of s) {
    if ('({['.includes(ch)) stack.push(ch)
    else if (')}]'.includes(ch)) {
      if (stack.pop() !== pairs[ch]) return false
    }
  }
  return stack.length === 0
}

export function isPalindrome(s: string): boolean {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '')
  return clean === clean.split('').reverse().join('')
}
