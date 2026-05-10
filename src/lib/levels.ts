import { PuzzleType } from '../types'
import type { LevelDef, PuzzleConfig } from '../types'
import { generatePrimeFactors, checkBalanced, isPalindrome, generateSortedArray, generateMaze } from './puzzleEngine'

const ZONES = [
  { name: 'Sorting Core', challenge: 'Sorting Algorithms', types: [PuzzleType.SORT] as PuzzleType[] },
  { name: 'Search Domain', challenge: 'Searching Algorithms', types: [PuzzleType.TWO_SUM, PuzzleType.SORT] as PuzzleType[] },
  { name: 'Sequence Stream', challenge: 'Sequence Analysis', types: [PuzzleType.SEQUENCE, PuzzleType.PATTERN] as PuzzleType[] },
  { name: 'Graph Grid', challenge: 'Graph Theory', types: [PuzzleType.GRAPH, PuzzleType.MAZE] as PuzzleType[] },
  { name: 'Logic Core', challenge: 'Logical Deduction', types: [PuzzleType.BALANCE, PuzzleType.PALINDROME] as PuzzleType[] },
  { name: 'Combinatorial Vault', challenge: 'Combinatorics', types: [PuzzleType.FACTOR, PuzzleType.TWO_SUM] as PuzzleType[] },
  { name: 'Numerical Forge', challenge: 'Number Theory', types: [PuzzleType.BINARY, PuzzleType.FACTOR] as PuzzleType[] },
  { name: 'Cipher Wing', challenge: 'String Algorithms', types: [PuzzleType.PALINDROME, PuzzleType.BALANCE] as PuzzleType[] },
  { name: 'Data Buffer', challenge: 'Data Structures', types: [PuzzleType.SORT, PuzzleType.GRAPH] as PuzzleType[] },
  { name: 'The Overclock', challenge: 'Mixed Algorithms', types: [PuzzleType.SEQUENCE, PuzzleType.MAZE, PuzzleType.BINARY, PuzzleType.PATTERN] as PuzzleType[] },
]

const ADJS = [
  'Abyssal', 'Binary', 'Corrupted', 'Dynamic', 'Encrypted', 'Fractal', 'Gaussian', 'Heuristic',
  'Inverted', 'Jumbled', 'Kinetic', 'Latent', 'Mutable', 'Nested', 'Oscillating', 'Parity',
  'Quantum', 'Recursive', 'Stochastic', 'Ternary', 'Unstable', 'Vector', 'Warped', 'Xenomorphic',
  'Yieldless', 'Zero-Sum', 'Adaptive', 'Broken', 'Cyclic', 'Degraded', 'Elastic', 'Flooded',
  'Granular', 'Hybrid', 'Inductive', 'Jagged', 'Knotted', 'Linearized', 'Morphic', 'Nonlinear',
]

const NOUNS = [
  'Array', 'Buffer', 'Cache', 'Depths', 'Edge', 'Fragment', 'Gate', 'Heap', 'Index', 'Junction',
  'Kernel', 'Link', 'Matrix', 'Node', 'Overflow', 'Page', 'Queue', 'Register', 'Stack', 'Thread',
  'Unit', 'Vector', 'Word', 'XOR', 'Yield', 'Zero', 'Access', 'Block', 'Cell', 'Domain',
  'Element', 'Field', 'Grid', 'Hash', 'Interval', 'Layer', 'Module', 'Network', 'Port', 'Row',
  'Sector', 'Tile', 'Vertex', 'Wave', 'Axis', 'Branch', 'Core', 'Drive', 'Frame', 'Loop',
]

const NAV = ['elevator', 'building', 'system', 'mainframe', 'node', 'network', 'server', 'matrix']
const VERBS = ['resolve', 'debug', 'restore', 'repair', 'recompile', 'recalibrate', 'purge', 'align']
const GOALS = ['restore stability', 'fix the corruption', 're-establish connection', 'balance the system', 'clear the error']

function seeded(id: number): number {
  return ((Math.sin(id * 9301.141 + 49297.535) * 49297) % 1 + 1) % 1
}

function pick<T>(arr: T[], id: number, offset = 0): T {
  return arr[Math.floor(((seeded(id + 1) * 100 + offset) % 1) * arr.length)]
}

function randInt(id: number, min: number, max: number, offset = 0): number {
  return min + Math.floor(((seeded(id * 3 + 7 + offset) * 100 + offset) % 1) * (max - min + 1))
}

function genName(id: number): string {
  const adj = pick(ADJS, id, 0)
  const noun = pick(NOUNS, id, 7)
  const tpl = Math.floor(seeded(id * 5 + 3) * 4)
  if (tpl === 0) return `${adj} ${noun}`
  if (tpl === 1) return `The ${adj} ${noun}`
  if (tpl === 2) return `${noun} of ${adj}s`
  return `Corrupted ${noun}`
}

function genDesc(id: number, zone: string, challenge: string, type: string): string {
  const n = pick(NAV, id, 0)
  const v = pick(VERBS, id, 3)
  const g = pick(GOALS, id, 7)
  const subsys = pick(['processing core', 'memory bank', 'data bus', 'power grid', 'logic unit', 'network hub', 'crypto module', 'cache layer', 'routing table', 'pipeline'], id, 11)
  const problem = pick(['segmentation fault', 'deadlock', 'race condition', 'buffer overflow', 'infinite loop', 'null pointer', 'stack underflow', 'type mismatch', 'checksum error', 'corrupt header', 'parity error', 'alignment fault'], id, 13)
  const hex = (id * 73 + 41).toString(16).toUpperCase().padStart(4, '0')
  const ts = Math.floor(seeded(id * 11) * 5)
  if (ts === 0) return `Floor ${id}: ${subsys.toUpperCase()} corrupted by ${problem}. Use ${challenge.toLowerCase()} to ${v} the ${n}.`
  if (ts === 1) return `ERROR 0x${hex} — ${problem.toUpperCase()} at node #${id}. The ${n}'s ${subsys} needs ${challenge.toLowerCase()} to ${g}.`
  if (ts === 2) return `The ${n}'s ${subsys} is glitching (${problem}). Only a ${type.replace('_', ' ')} puzzle stands between you and ${g}.`
  return `CRITICAL: ${problem. charAt(0). toUpperCase() + problem.slice(1)} in ${subsys}. Solve the ${challenge.toLowerCase()} challenge to ${v} floor ${id}.`
}

function genSortConfig(id: number): PuzzleConfig {
  const n = Math.min(4 + Math.floor(((seeded(id * 7 + 1) * 100) % 1) * 5), 10)
  const arr = generateSortedArray(n)
  const shuffleCount = Math.min(3 + randInt(id, 1, 5, 3), n * 2)
  for (let i = 0; i < shuffleCount; i++) {
    const a = Math.floor(Math.random() * n)
    const b = Math.floor(Math.random() * n)
    if (a !== b) { const t = arr[a]; arr[a] = arr[b]; arr[b] = t }
  }
  return { kind: PuzzleType.SORT, values: arr, swaps: shuffleCount }
}

function genTwoSumConfig(id: number): PuzzleConfig {
  const n = 5 + randInt(id, 1, 6, 0)
  const nums: number[] = []
  for (let i = 0; i < n; i++) nums.push(randInt(id, 2, 20, i))
  const ai = randInt(id, 0, n - 1, 0)
  let bi = randInt(id, 0, n - 1, 7)
  while (bi === ai) bi = (bi + 1) % n
  const target = nums[ai] + nums[bi]
  return { kind: PuzzleType.TWO_SUM, numbers: nums, target }
}

function genSequenceConfig(id: number): PuzzleConfig {
  const t = randInt(id, 0, 3, 0)
  const n = 5
  const terms: number[] = []
  let answer = 0
  let missingIndex = 2
  for (let i = 0; i < n; i++) {
    if (t === 0) terms.push(3 + i * randInt(id, 2, 5, i))
    else if (t === 1) terms.push(Math.max(1, Math.floor(2 * Math.pow(1.5 + seeded(id * 3 + i) * 0.5, i))))
    else if (t === 2) { const f = [1, 1]; for (let j = 2; j < n; j++) f.push(f[j - 1] + f[j - 2]); if (i < f.length) terms.push(f[i]); else terms.push(1) }
    else terms.push(i * i + 1)
  }
  missingIndex = randInt(id, 1, n - 2, 0)
  answer = terms[missingIndex]
  terms[missingIndex] = -1
  return { kind: PuzzleType.SEQUENCE, terms, missingIndex, answer }
}

function genMazeConfig(id: number): PuzzleConfig {
  const s = 3 + randInt(id, 0, 4, 0)
  const { grid, start, end } = generateMaze(s, s)
  return { kind: PuzzleType.MAZE, grid, start, end, width: s, height: s }
}

function genFactorConfig(id: number): PuzzleConfig {
  const bases = [2, 3, 5, 7, 11, 13]
  const count = 1 + randInt(id, 0, 2, 0)
  const factors: number[] = []
  for (let i = 0; i < count; i++) factors.push(pick(bases, id + i * 7, i * 3))
  const n = factors.reduce((a, b) => a * b, 1)
  return { kind: PuzzleType.FACTOR, number: n, factors: generatePrimeFactors(n) }
}

function genBalanceConfig(id: number): PuzzleConfig {
  const depth = 1 + randInt(id, 0, 3, 0)
  const pairs: { open: string; close: string }[] = [{ open: '(', close: ')' }, { open: '[', close: ']' }, { open: '{', close: '}' }]
  let expr = ''
  for (let i = 0; i < depth + 1; i++) {
    const p = pick(pairs, id + i * 3, i * 5)
    if (seeded(id * 7 + i * 13) > 0.5) { expr += p.open; if (Math.random() > 0.3) expr += p.close; else 0 }
    else expr += p.open + p.close
  }
  if (seeded(id * 17) > 0.7 && expr.length > 2) {
    const pos = randInt(id, 1, expr.length - 1, 0)
    expr = expr.slice(0, pos) + (expr[pos] === ')' || expr[pos] === ']' || expr[pos] === '}' ? expr[pos] : ')') + expr.slice(pos + 1)
  }
  const balanced = checkBalanced(expr)
  return { kind: PuzzleType.BALANCE, expr, balanced }
}

function genPalindromeConfig(id: number): PuzzleConfig {
  const words = ['racecar', 'level', 'radar', 'civic', 'kayak', 'madam', 'refer', 'tenet', 'noon', 'stats', 'hello', 'world', 'puzzle', 'escape', 'elevator', 'broken', 'matrix', 'python', 'coding', 'sorted']
  const word = pick(words, id, 0)
  const isPal = isPalindrome(word)
  if (seeded(id * 23) > 0.7) {
    const newWord = word.split('').reverse().join('')
    const rIdx = randInt(id, 0, newWord.length - 1, 0)
    const rep = String.fromCharCode(97 + randInt(id, 0, 25, 7))
    const modified = newWord.slice(0, rIdx) + rep + newWord.slice(rIdx + 1)
    return { kind: PuzzleType.PALINDROME, text: modified, isPalindrome: isPalindrome(modified) }
  }
  return { kind: PuzzleType.PALINDROME, text: word, isPalindrome: isPal }
}

function genBinaryConfig(id: number): PuzzleConfig {
  const d = randInt(id, 4, 255, 0)
  const bin = d.toString(2)
  return { kind: PuzzleType.BINARY, decimal: d, binary: bin }
}

function genPatternConfig(id: number): PuzzleConfig {
  const n = 3 + randInt(id, 0, 3, 0)
  const start = randInt(id, 1, 10, 0)
  const step = 1 + randInt(id, 1, 5, 7)
  const items: string[] = []
  for (let i = 0; i < n; i++) items.push(String(start + i * step))
  const answer = start + n * step
  const options = [String(answer), String(answer + 1), String(answer - 1), String(answer + step), String(answer - step), String(answer * 2)]
  const shuffled = [...options].sort(() => Math.random() - 0.5)
  const answerIndex = shuffled.indexOf(String(answer))
  return { kind: PuzzleType.PATTERN, items, options: shuffled, answerIndex }
}

function genGraphConfig(id: number): PuzzleConfig {
  const n = 3 + randInt(id, 0, 4, 0)
  const edges: [number, number][] = []
  for (let i = 1; i < n; i++) edges.push([i - 1, i])
  const extra = randInt(id, 0, Math.min(3, n * (n - 1) / 2 - n + 1), 0)
  for (let i = 0; i < extra; i++) {
    const a = randInt(id, 0, n - 1, i * 3)
    let b = randInt(id, 0, n - 1, i * 3 + 7)
    while (b === a) b = (b + 1) % n
    if (!edges.some(e => (e[0] === a && e[1] === b) || (e[0] === b && e[1] === a))) edges.push([a, b])
  }
  return { kind: PuzzleType.GRAPH, nodes: n, edges, start: 0, end: n - 1 }
}

function generateLevel(id: number): LevelDef {
  const zoneIdx = Math.min(Math.floor(((id - 21) / 38.2)), ZONES.length - 1)
  const zone = ZONES[zoneIdx]
  const localIdx = id - 21 - zoneIdx * 38
  const type = zone.types[localIdx % zone.types.length]
  const diff = Math.min(1 + Math.floor(((seeded(id * 13 + 5) * 100) % 1) * 10), 10)

  let config: PuzzleConfig
  switch (type) {
    case PuzzleType.SORT: config = genSortConfig(id); break
    case PuzzleType.TWO_SUM: config = genTwoSumConfig(id); break
    case PuzzleType.SEQUENCE: config = genSequenceConfig(id); break
    case PuzzleType.MAZE: config = genMazeConfig(id); break
    case PuzzleType.FACTOR: config = genFactorConfig(id); break
    case PuzzleType.BALANCE: config = genBalanceConfig(id); break
    case PuzzleType.PALINDROME: config = genPalindromeConfig(id); break
    case PuzzleType.BINARY: config = genBinaryConfig(id); break
    case PuzzleType.PATTERN: config = genPatternConfig(id); break
    case PuzzleType.GRAPH: config = genGraphConfig(id); break
  }

  return {
    id,
    name: genName(id),
    desc: genDesc(id, zone.name, zone.challenge, type),
    zone: zone.name,
    challenge: zone.challenge,
    type,
    diff,
    config,
  }
}

export const LEVELS: LevelDef[] = Array.from({ length: 384 }, (_, i) => i + 21).map(generateLevel)

export function getLevel(id: number): LevelDef | undefined {
  if (id >= 1 && id <= 20) return undefined
  return LEVELS.find(l => l.id === id)
}

export function isGeneratedLevel(id: number): boolean {
  return id >= 21 && id <= 404
}
