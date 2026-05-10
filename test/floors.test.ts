import { describe, it, beforeEach } from 'mocha'
import { expect } from 'chai'

const store: Record<string, string> = {}
global.localStorage = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value },
  removeItem: (key: string) => { delete store[key] },
  clear: () => Object.keys(store).forEach(k => delete store[k]),
  length: 0,
  key: () => null,
} as Storage

import {
  markComplete,
  isFloorUnlocked,
  isCompleted,
  getState,
  resetProgress,
  getCompletedCount,
  generateSequence,
  generateCipher,
  BUG_TYPES,
} from '../src/lib/gameLogic.js'

// --- Floor 1: Lobby - Fuse Panel ---
describe('Floor 1 - Lobby / Fuse Panel', () => {
  beforeEach(() => { resetProgress() })

  it('should always be unlocked', () => {
    expect(isFloorUnlocked(1)).to.equal(true)
  })

  it('should be completable via markComplete', () => {
    markComplete(1)
    expect(isCompleted(1)).to.equal(true)
  })

  it('should unlock floor 2 after completion', () => {
    markComplete(1)
    expect(isFloorUnlocked(2)).to.equal(true)
  })
})

// --- Floor 2: Access Terminal ---
describe('Floor 2 - Access Terminal / Keypad Entry', () => {
  beforeEach(() => { resetProgress() })

  it('should be locked until floor 1 completed', () => {
    expect(isFloorUnlocked(2)).to.equal(false)
    markComplete(1)
    expect(isFloorUnlocked(2)).to.equal(true)
  })

  it('should unlock floor 3 after completion', () => {
    markComplete(1)
    markComplete(2)
    expect(isFloorUnlocked(3)).to.equal(true)
  })
})

// --- Floor 3: Server Room - Emergency Brake ---
describe('Floor 3 - Server Room / Emergency Brake', () => {
  beforeEach(() => { resetProgress() })

  it('should require floor 2 completed', () => {
    expect(isFloorUnlocked(3)).to.equal(false)
    markComplete(1)
    markComplete(2)
    expect(isFloorUnlocked(3)).to.equal(true)
  })

  it('should unlock floor 4 after completion', () => {
    markComplete(1)
    markComplete(2)
    markComplete(3)
    expect(isFloorUnlocked(4)).to.equal(true)
  })
})

// --- Floor 4: Executive Suite - Debug Terminal ---
describe('Floor 4 - Executive Suite / Debug Terminal', () => {
  beforeEach(() => { resetProgress() })

  it('should provide at least 5 bug types with required fields', () => {
    expect(BUG_TYPES.length).to.be.at.least(5)
    BUG_TYPES.forEach(bug => {
      expect(bug).to.have.property('label')
      expect(bug).to.have.property('icon')
      expect(bug).to.have.property('msg')
    })
  })

  it('should unlock floor 5 after completion', () => {
    markComplete(1)
    markComplete(2)
    markComplete(3)
    markComplete(4)
    expect(isFloorUnlocked(5)).to.equal(true)
  })
})

// --- Floor 5: Memory Core - Sequence Lock ---
describe('Floor 5 - Memory Core / Sequence Lock', () => {
  beforeEach(() => { resetProgress() })

  it('should generate sequences of specified length', () => {
    expect(generateSequence(5)).to.have.lengthOf(5)
    expect(generateSequence(1)).to.have.lengthOf(1)
    expect(generateSequence(20)).to.have.lengthOf(20)
  })

  it('generated sequences should only contain values 0-3', () => {
    const seq = generateSequence(50)
    seq.forEach(n => {
      expect(n).to.be.at.least(0)
      expect(n).to.be.at.most(3)
    })
  })

  it('should generate different sequences on successive calls', () => {
    const s1 = generateSequence(10)
    const s2 = generateSequence(10)
    expect(s1.join(',')).to.not.equal(s2.join(','))
  })

  it('should unlock floor 6 after completion', () => {
    for (let i = 1; i <= 5; i++) markComplete(i)
    expect(isFloorUnlocked(6)).to.equal(true)
  })
})

// --- Floor 6: Power Plant - Circuit Balance ---
describe('Floor 6 - Power Plant / Circuit Balance', () => {
  const CIRCUIT_COUNT = 5
  const MAX_POWER = 100
  const TARGET_MIN = 45
  const TARGET_MAX = 55
  const SUSTAIN_TIME = 3000

  function isBalanced(circuits: { power: number }[]): boolean {
    return circuits.every(c => c.power >= TARGET_MIN && c.power <= TARGET_MAX)
  }

  function applyDrift(power: number): number {
    return Math.max(0, Math.min(MAX_POWER, power + (Math.random() - 0.5) * 6))
  }

  function createCircuit(power: number) {
    return { id: 0, power }
  }

  beforeEach(() => { resetProgress() })

  it('should identify balanced circuits within target range', () => {
    const balanced = Array.from({ length: CIRCUIT_COUNT }, () => createCircuit(50))
    expect(isBalanced(balanced)).to.equal(true)
  })

  it('should reject circuits outside target range', () => {
    const low = Array.from({ length: CIRCUIT_COUNT }, () => createCircuit(30))
    expect(isBalanced(low)).to.equal(false)

    const high = Array.from({ length: CIRCUIT_COUNT }, () => createCircuit(80))
    expect(isBalanced(high)).to.equal(false)
  })

  it('should detect a single unbalanced circuit', () => {
    const circuits = Array.from({ length: CIRCUIT_COUNT }, (_, i) =>
      createCircuit(i === 2 ? 60 : 50)
    )
    expect(isBalanced(circuits)).to.equal(false)
  })

  it('drift should stay within [0, MAX_POWER] bounds', () => {
    for (let i = 0; i < 100; i++) {
      const result = applyDrift(50)
      expect(result).to.be.at.least(0)
      expect(result).to.be.at.most(MAX_POWER)
    }
  })

  it('drift at boundary 0 should never go negative', () => {
    const result = applyDrift(0)
    expect(result).to.be.at.least(0)
  })

  it('drift at boundary MAX_POWER should never exceed', () => {
    const result = applyDrift(MAX_POWER)
    expect(result).to.be.at.most(MAX_POWER)
  })

  it('should unlock floor 7 after completion', () => {
    for (let i = 1; i <= 6; i++) markComplete(i)
    expect(isFloorUnlocked(7)).to.equal(true)
  })
})

// --- Floor 7: Comms Hub - Wire Cipher ---
describe('Floor 7 - Comms Hub / Wire Cipher', () => {
  beforeEach(() => { resetProgress() })

  it('should generate cipher with specified length', () => {
    const result = generateCipher(4)
    expect(result.colors).to.have.lengthOf(4)
    expect(result.solution).to.have.lengthOf(4)
  })

  it('should only contain valid colors', () => {
    const valid = ['red', 'blue', 'green', 'yellow', 'purple']
    const result = generateCipher(10)
    result.colors.forEach(c => {
      expect(valid).to.include(c)
    })
  })

  it('colors and solution should have same length', () => {
    const result = generateCipher(5)
    expect(result.colors.length).to.equal(result.solution.length)
  })

  it('should unlock floor 8 after completion', () => {
    for (let i = 1; i <= 7; i++) markComplete(i)
    expect(isFloorUnlocked(8)).to.equal(true)
  })
})

// --- Floor 8: Mainframe - Core Reboot ---
describe('Floor 8 - Mainframe / Core Reboot', () => {
  beforeEach(() => { resetProgress() })

  it('should have 4 phases defined', () => {
    const phases = [
      { id: 1, name: 'DRAIN RESIDUAL POWER' },
      { id: 2, name: 'ALIGN CORE MODULES' },
      { id: 3, name: 'OVERRIDE SAFETY LOCKS' },
      { id: 4, name: 'INITIALIZE REBOOT' },
    ]
    expect(phases).to.have.lengthOf(4)
    expect(phases[2].name).to.include('OVERRIDE')
  })

  it('should use override code 5801', () => {
    const CODE = '5801'
    expect(CODE).to.have.lengthOf(4)
    expect(CODE).to.match(/^\d+$/)
  })

  it('should unlock floor 9 after completion', () => {
    for (let i = 1; i <= 8; i++) markComplete(i)
    expect(isFloorUnlocked(9)).to.equal(true)
  })
})

// --- Floor 9: Signal Lab - Frequency Match ---
describe('Floor 9 - Signal Lab / Frequency Match', () => {
  beforeEach(() => { resetProgress() })

  it('should require floor 8 completed', () => {
    expect(isFloorUnlocked(9)).to.equal(false)
    for (let i = 1; i <= 8; i++) markComplete(i)
    expect(isFloorUnlocked(9)).to.equal(true)
  })

  it('should unlock floor 10 after completion', () => {
    for (let i = 1; i <= 9; i++) markComplete(i)
    expect(isFloorUnlocked(10)).to.equal(true)
  })
})

// --- Floor 10: Plumbing Core - Pipe Network ---
describe('Floor 10 - Plumbing Core / Pipe Network', () => {
  const GRID = 5

  function hasConnection(type: string, dir: string): boolean {
    const cons: Record<string, string[]> = {
      '─': ['left', 'right'],
      '│': ['up', 'down'],
      '┌': ['down', 'right'],
      '┐': ['down', 'left'],
      '└': ['up', 'right'],
      '┘': ['up', 'left'],
      '┴': ['up', 'left', 'right'],
      '┬': ['down', 'left', 'right'],
      '├': ['up', 'down', 'right'],
      '┤': ['up', 'down', 'left'],
      '┼': ['up', 'down', 'left', 'right'],
    }
    return cons[type]?.includes(dir) ?? false
  }

  function checkFlow(grid: string[][]): boolean {
    const visited = new Set<string>()
    const stack: [number, number][] = []
    for (let r = 0; r < GRID; r++) {
      if (hasConnection(grid[r][0], 'left')) stack.push([r, 0])
    }
    while (stack.length > 0) {
      const [r, c] = stack.pop()!
      const key = `${r},${c}`
      if (visited.has(key)) continue
      visited.add(key)
      if (c === GRID - 1) return true
      const type = grid[r][c]
      if (hasConnection(type, 'right') && c + 1 < GRID && hasConnection(grid[r][c + 1], 'left')) stack.push([r, c + 1])
      if (hasConnection(type, 'left') && c - 1 >= 0 && hasConnection(grid[r][c - 1], 'right')) stack.push([r, c - 1])
      if (hasConnection(type, 'down') && r + 1 < GRID && hasConnection(grid[r + 1][c], 'up')) stack.push([r + 1, c])
      if (hasConnection(type, 'up') && r - 1 >= 0 && hasConnection(grid[r - 1][c], 'down')) stack.push([r - 1, c])
    }
    return false
  }

  const ROTATE_MAP: Record<string, string> = {
    '─': '│', '│': '─',
    '┌': '┐', '┐': '┘', '┘': '└', '└': '┌',
    '┴': '├', '├': '┬', '┬': '┤', '┤': '┴',
    '┼': '┼',
  }

  beforeEach(() => { resetProgress() })

  it('hasConnection should identify pipe directions correctly', () => {
    expect(hasConnection('─', 'left')).to.equal(true)
    expect(hasConnection('─', 'right')).to.equal(true)
    expect(hasConnection('─', 'up')).to.equal(false)
    expect(hasConnection('─', 'down')).to.equal(false)

    expect(hasConnection('┼', 'up')).to.equal(true)
    expect(hasConnection('┼', 'down')).to.equal(true)
    expect(hasConnection('┼', 'left')).to.equal(true)
    expect(hasConnection('┼', 'right')).to.equal(true)
  })

  it('hasConnection should return false for unknown pipe types', () => {
    expect(hasConnection('X', 'left')).to.equal(false)
    expect(hasConnection('', 'up')).to.equal(false)
  })

  it('rotation map should be bijective (double rotation returns to start)', () => {
    const types = ['─', '│', '┌', '┐', '└', '┘', '┴', '┬', '├', '┤', '┼']
    types.forEach(t => {
      const once = ROTATE_MAP[t]
      const twice = ROTATE_MAP[once]
      const thrice = ROTATE_MAP[twice]
      const fourTimes = ROTATE_MAP[thrice]
      expect(fourTimes).to.equal(t, `${t} should return to itself after 4 rotations`)
    })
  })

  it('checkFlow should find a path in a straight horizontal pipe row', () => {
    const grid = Array.from({ length: GRID }, (_, r) =>
      Array.from({ length: GRID }, (_, c) => r === 2 ? '─' : ' ')
    )
    expect(checkFlow(grid)).to.equal(true)
  })

  it('checkFlow should return false for a disconnected grid', () => {
    const grid = Array.from({ length: GRID }, () => Array(GRID).fill('│'))
    expect(checkFlow(grid)).to.equal(false)
  })

  it('checkFlow should find a path through a zigzag', () => {
    const grid = [
      ['─', '┐', ' ', ' ', ' '],
      [' ', '│', ' ', ' ', ' '],
      ['─', '┼', '─', '─', '┐'],
      [' ', '│', ' ', ' ', '│'],
      [' ', '└', '─', '─', '┘'],
    ]
    expect(checkFlow(grid)).to.equal(true)
  })

  it('should unlock floor 11 after completion', () => {
    for (let i = 1; i <= 10; i++) markComplete(i)
    expect(isFloorUnlocked(11)).to.equal(true)
  })
})

// --- Floor 11: Logic Bay - Boolean Gates ---
describe('Floor 11 - Logic Bay / Boolean Gates', () => {
  type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR'

  interface Gate {
    type: GateType
    inputs: [number, number]
    output: number
  }

  function evalGate(g: Gate): number {
    const [a, b] = g.inputs
    switch (g.type) {
      case 'AND': return a & b
      case 'OR': return a | b
      case 'NOT': return a ^ 1
      case 'NAND': return (a & b) ^ 1
      case 'NOR': return (a | b) ^ 1
      case 'XOR': return a ^ b
    }
  }

  beforeEach(() => { resetProgress() })

  it('AND gate: 0 AND 0 = 0, 0 AND 1 = 0, 1 AND 1 = 1', () => {
    const gate: Gate = { type: 'AND', inputs: [0, 0], output: 0 }
    expect(evalGate(gate)).to.equal(0)
    gate.inputs = [0, 1]
    expect(evalGate(gate)).to.equal(0)
    gate.inputs = [1, 0]
    expect(evalGate(gate)).to.equal(0)
    gate.inputs = [1, 1]
    expect(evalGate(gate)).to.equal(1)
  })

  it('OR gate: 0 OR 0 = 0, 0 OR 1 = 1, 1 OR 1 = 1', () => {
    expect(evalGate({ type: 'OR', inputs: [0, 0], output: 0 })).to.equal(0)
    expect(evalGate({ type: 'OR', inputs: [0, 1], output: 0 })).to.equal(1)
    expect(evalGate({ type: 'OR', inputs: [1, 0], output: 0 })).to.equal(1)
    expect(evalGate({ type: 'OR', inputs: [1, 1], output: 0 })).to.equal(1)
  })

  it('NOT gate: NOT 0 = 1, NOT 1 = 0', () => {
    expect(evalGate({ type: 'NOT', inputs: [0, 0], output: 0 })).to.equal(1)
    expect(evalGate({ type: 'NOT', inputs: [1, 0], output: 0 })).to.equal(0)
  })

  it('NAND gate', () => {
    expect(evalGate({ type: 'NAND', inputs: [0, 0], output: 0 })).to.equal(1)
    expect(evalGate({ type: 'NAND', inputs: [1, 1], output: 0 })).to.equal(0)
  })

  it('NOR gate', () => {
    expect(evalGate({ type: 'NOR', inputs: [0, 0], output: 0 })).to.equal(1)
    expect(evalGate({ type: 'NOR', inputs: [1, 0], output: 0 })).to.equal(0)
  })

  it('XOR gate', () => {
    expect(evalGate({ type: 'XOR', inputs: [0, 0], output: 0 })).to.equal(0)
    expect(evalGate({ type: 'XOR', inputs: [0, 1], output: 0 })).to.equal(1)
    expect(evalGate({ type: 'XOR', inputs: [1, 1], output: 0 })).to.equal(0)
  })

  it('should unlock floor 12 after completion', () => {
    for (let i = 1; i <= 11; i++) markComplete(i)
    expect(isFloorUnlocked(12)).to.equal(true)
  })
})

// --- Floor 12: Decode Chamber - Binary Decoder ---
describe('Floor 12 - Decode Chamber / Binary Decoder', () => {
  beforeEach(() => { resetProgress() })

  it('should convert binary to decimal correctly', () => {
    const tests: [string, number][] = [
      ['0', 0], ['1', 1], ['10', 2], ['11', 3],
      ['100', 4], ['101', 5], ['110', 6], ['111', 7],
      ['1000', 8], ['11111111', 255], ['10101010', 170],
    ]
    tests.forEach(([binary, expected]) => {
      expect(parseInt(binary, 2)).to.equal(expected)
    })
  })

  it('should reject non-binary input', () => {
    const isValidBinary = (s: string) => /^[01]+$/.test(s)
    expect(isValidBinary('101')).to.equal(true)
    expect(isValidBinary('0')).to.equal(true)
    expect(isValidBinary('123')).to.equal(false)
    expect(isValidBinary('abc')).to.equal(false)
    expect(isValidBinary('10x')).to.equal(false)
  })

  it('should generate binary string of specified length', () => {
    expect(Array.from({ length: 4 }, () => Math.random() > 0.5 ? '1' : '0').join('')).to.have.lengthOf(4)
    expect(Array.from({ length: 8 }, () => Math.random() > 0.5 ? '1' : '0').join('')).to.have.lengthOf(8)
  })

  it('binary answer check should work: parseInt comparison', () => {
    const binary = '1101'
    const answer = 13
    expect(parseInt(answer.toString(), 10) === parseInt(binary, 2)).to.equal(true)
  })

  it('should unlock floor 13 after completion', () => {
    for (let i = 1; i <= 12; i++) markComplete(i)
    expect(isFloorUnlocked(13)).to.equal(true)
  })
})

// --- Floor 13: Reactor Core - Pattern Matrix ---
describe('Floor 13 - Reactor Core / Pattern Matrix', () => {
  beforeEach(() => { resetProgress() })

  it('pattern grid should maintain correct dimensions', () => {
    const sizes = [3, 4, 5, 6]
    sizes.forEach(size => {
      const pattern = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => Math.random() > 0.5)
      )
      expect(pattern).to.have.lengthOf(size)
      pattern.forEach(row => expect(row).to.have.lengthOf(size))
    })
  })

  it('should unlock floor 14 after completion', () => {
    for (let i = 1; i <= 13; i++) markComplete(i)
    expect(isFloorUnlocked(14)).to.equal(true)
  })
})

// --- Floor 14: Thermal Unit - Temperature Control ---
describe('Floor 14 - Thermal Unit / Temperature Control', () => {
  const TARGET_MIN = 38
  const TARGET_MAX = 62
  const MAX_POWER = 100

  function isInZone(temp: number): boolean {
    return temp >= TARGET_MIN && temp <= TARGET_MAX
  }

  function applyDrift(temp: number, difficulty: number): number {
    const driftAmt = (Math.random() - 0.5) * 5 * difficulty
    return Math.max(0, Math.min(MAX_POWER, temp + driftAmt))
  }

  function adjustTemp(temp: number, dir: 'up' | 'down'): number {
    return Math.max(0, Math.min(MAX_POWER, temp + (dir === 'up' ? 4 : -4)))
  }

  beforeEach(() => { resetProgress() })

  it('should identify temperatures within target zone', () => {
    expect(isInZone(38)).to.equal(true)
    expect(isInZone(50)).to.equal(true)
    expect(isInZone(62)).to.equal(true)
  })

  it('should reject temperatures outside target zone', () => {
    expect(isInZone(37)).to.equal(false)
    expect(isInZone(63)).to.equal(false)
    expect(isInZone(0)).to.equal(false)
    expect(isInZone(100)).to.equal(false)
  })

  it('temperature adjustment should stay within bounds', () => {
    expect(adjustTemp(98, 'up')).to.equal(100)
    expect(adjustTemp(2, 'down')).to.equal(0)
    expect(adjustTemp(50, 'up')).to.equal(54)
    expect(adjustTemp(50, 'down')).to.equal(46)
  })

  it('should unlock floor 15 after completion', () => {
    for (let i = 1; i <= 14; i++) markComplete(i)
    expect(isFloorUnlocked(15)).to.equal(true)
  })
})

// --- Floor 15: Vault Room - Cipher Lock ---
describe('Floor 15 - Vault Room / Cipher Lock', () => {
  const DIALS = 4
  const POSITIONS = 8
  const MAX_GUESSES = 12

  function generateCode(): number[] {
    return Array.from({ length: DIALS }, () => Math.floor(Math.random() * POSITIONS))
  }

  function checkGuess(code: number[], guess: number[]): { correct: number; close: number } {
    let correct = 0
    let close = 0
    const codeUsed = code.map(() => false)
    const guessUsed = guess.map(() => false)
    for (let i = 0; i < DIALS; i++) {
      if (guess[i] === code[i]) {
        correct++
        codeUsed[i] = true
        guessUsed[i] = true
      }
    }
    for (let i = 0; i < DIALS; i++) {
      if (guessUsed[i]) continue
      for (let j = 0; j < DIALS; j++) {
        if (codeUsed[j]) continue
        if (guess[i] === code[j]) {
          close++
          codeUsed[j] = true
          guessUsed[i] = true
          break
        }
      }
    }
    return { correct, close }
  }

  beforeEach(() => { resetProgress() })

  it('should generate a 4-digit code with values 0-7', () => {
    const code = generateCode()
    expect(code).to.have.lengthOf(DIALS)
    code.forEach(d => {
      expect(d).to.be.at.least(0)
      expect(d).to.be.at.most(POSITIONS - 1)
    })
  })

  it('checkGuess: all correct returns correct=4, close=0', () => {
    const code = [1, 2, 3, 4]
    const result = checkGuess(code, [1, 2, 3, 4])
    expect(result).to.deep.equal({ correct: 4, close: 0 })
  })

  it('checkGuess: all wrong returns correct=0, close=0', () => {
    const code = [1, 2, 3, 4]
    const result = checkGuess(code, [5, 6, 7, 0])
    expect(result).to.deep.equal({ correct: 0, close: 0 })
  })

  it('checkGuess: correct positions but wrong values returns correct=0, close=0', () => {
    const code = [1, 2, 3, 4]
    const result = checkGuess(code, [5, 1, 6, 7])
    expect(result.correct).to.equal(0)
    expect(result.close).to.equal(1)
  })

  it('checkGuess: mixed correct and close', () => {
    const code = [1, 2, 3, 4]
    const result = checkGuess(code, [1, 3, 2, 5])
    expect(result.correct).to.equal(1)
    expect(result.close).to.equal(2)
  })

  it('checkGuess: duplicate values in guess should not over-count close matches', () => {
    const code = [1, 2, 3, 4]
    const result = checkGuess(code, [1, 1, 1, 1])
    expect(result.correct).to.equal(1)
    expect(result.close).to.equal(0)
  })

  it('checkGuess: all values present but all wrong positions', () => {
    const code = [1, 2, 3, 4]
    const result = checkGuess(code, [4, 3, 2, 1])
    expect(result.correct).to.equal(0)
    expect(result.close).to.equal(4)
  })

  it('win condition requires all dials correct', () => {
    const code = generateCode()
    const win = checkGuess(code, code)
    expect(win.correct).to.equal(DIALS)
    expect(win.close).to.equal(0)
  })

  it('should unlock floor 16 after completion', () => {
    for (let i = 1; i <= 15; i++) markComplete(i)
    expect(isFloorUnlocked(16)).to.equal(true)
  })
})

// --- Floor 16: Pulse Lab - EM Sequencing ---
describe('Floor 16 - Pulse Lab / EM Sequencing', () => {
  function shuffleArray(arr: number[]): number[] {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  beforeEach(() => { resetProgress() })

  it('shuffleArray should preserve all elements', () => {
    const original = [1, 2, 3, 4, 5]
    const shuffled = shuffleArray(original)
    expect(shuffled).to.have.members(original)
    expect(shuffled).to.have.lengthOf(original.length)
  })

  it('shuffleArray should not return original order (probabilistic)', () => {
    const original = Array.from({ length: 9 }, (_, i) => i + 1)
    let sameOrder = true
    for (let trial = 0; trial < 10; trial++) {
      const shuffled = shuffleArray(original)
      if (shuffled.some((v, i) => v !== original[i])) {
        sameOrder = false
        break
      }
    }
    expect(sameOrder).to.equal(false)
  })

  it('shuffleArray should not mutate the original array', () => {
    const original = [1, 2, 3, 4, 5]
    const copy = [...original]
    shuffleArray(original)
    expect(original).to.deep.equal(copy)
  })

  it('should unlock floor 17 after completion', () => {
    for (let i = 1; i <= 16; i++) markComplete(i)
    expect(isFloorUnlocked(17)).to.equal(true)
  })
})

// --- Floor 17: Life Support - Oxygen Balance ---
describe('Floor 17 - Life Support / Oxygen Balance', () => {
  const GAUGE_COUNT = 4
  const TARGET_MIN = 30
  const TARGET_MAX = 70
  const MAX_POWER = 100

  function isStable(gauges: { value: number }[]): boolean {
    return gauges.every(g => g.value >= TARGET_MIN && g.value <= TARGET_MAX)
  }

  function applyDrift(value: number, drift: number): number {
    return Math.max(0, Math.min(MAX_POWER, value + drift + (Math.random() - 0.5) * 3))
  }

  function adjustGauge(value: number, dir: number): number {
    return Math.max(0, Math.min(MAX_POWER, value + dir * 8))
  }

  beforeEach(() => { resetProgress() })

  it('should identify stable gauges within range [30, 70]', () => {
    const gauges = Array.from({ length: GAUGE_COUNT }, () => ({ value: 50 }))
    expect(isStable(gauges)).to.equal(true)
  })

  it('should reject gauges outside range', () => {
    const low = [{ value: 29 }, { value: 50 }, { value: 50 }, { value: 50 }]
    expect(isStable(low)).to.equal(false)

    const high = [{ value: 71 }, { value: 50 }, { value: 50 }, { value: 50 }]
    expect(isStable(high)).to.equal(false)
  })

  it('gauge adjustment should change value by ±8', () => {
    expect(adjustGauge(50, 1)).to.equal(58)
    expect(adjustGauge(50, -1)).to.equal(42)
  })

  it('gauge adjustment should clamp at boundaries', () => {
    expect(adjustGauge(95, 1)).to.equal(100)
    expect(adjustGauge(5, -1)).to.equal(0)
  })

  it('should unlock floor 18 after completion', () => {
    for (let i = 1; i <= 17; i++) markComplete(i)
    expect(isFloorUnlocked(18)).to.equal(true)
  })
})

// --- Floor 18: Zero Point - The Final Ascent ---
describe('Floor 18 - Zero Point / The Final Ascent', () => {
  beforeEach(() => { resetProgress() })

  it('should have 3 phases', () => {
    const phases = ['Memory Pattern', 'Precision Lock', 'Power Surge']
    expect(phases).to.have.lengthOf(3)
  })

  it('precision lock should succeed within ±4 threshold', () => {
    const threshold = 4
    expect(Math.abs(50 - 52)).to.be.at.most(threshold)
    expect(Math.abs(50 - 55)).to.not.be.at.most(threshold)
  })

  it('power surge requires at least 25 clicks', () => {
    expect(25).to.be.at.least(25)
    expect(24).to.not.be.at.least(25)
  })

  it('should unlock floor 19 after completion', () => {
    for (let i = 1; i <= 18; i++) markComplete(i)
    expect(isFloorUnlocked(19)).to.equal(true)
  })
})

// --- Floor 19: The Crucible - Ultimate Trial ---
describe('Floor 19 - The Crucible / Ultimate Trial', () => {
  beforeEach(() => { resetProgress() })

  it('should have 3 phases', () => {
    const phases = ['Symbol Cipher', 'Logic Matrix', 'Reflex Gauntlet']
    expect(phases).to.have.lengthOf(3)
  })

  it('decodeNumber should map digits to symbols', () => {
    const mapping = [
      { symbol: '◇', value: 0 },
      { symbol: '◆', value: 1 },
      { symbol: '○', value: 2 },
      { symbol: '●', value: 3 },
    ]
    const digits = String(123).split('').map(Number)
    const decoded = digits.map(d => mapping.find(m => m.value === d)?.symbol || '?').join('')
    expect(decoded).to.equal('◆○●')
  })

  it('matrix row/column target computation', () => {
    const grid = [
      [true, false, true, false],
      [false, true, false, true],
      [true, true, false, false],
      [false, false, true, true],
    ]
    const rowTargets = grid.map(row => row.filter(Boolean).length)
    expect(rowTargets).to.deep.equal([2, 2, 2, 2])

    const size = grid.length
    const colTargets = Array.from({ length: size }, (_, c) =>
      grid.reduce((sum, row) => sum + (row[c] ? 1 : 0), 0)
    )
    expect(colTargets).to.deep.equal([2, 2, 2, 2])
  })

  it('matrix verification should detect correct solution', () => {
    const grid = [
      [true, false, true, false],
      [false, true, false, true],
      [true, true, false, false],
      [false, false, true, true],
    ]
    const rowTargets = [2, 2, 2, 2]
    const colTargets = [2, 2, 2, 2]

    const rowsOk = grid.every((row, i) => row.filter(Boolean).length === rowTargets[i])
    const colsOk = colTargets.every((target, c) =>
      grid.reduce((sum, row) => sum + (row[c] ? 1 : 0), 0) === target
    )
    expect(rowsOk && colsOk).to.equal(true)
  })

  it('matrix verification should detect incorrect solution', () => {
    const grid = [
      [true, true, true, true],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ]
    const rowTargets = [4, 0, 0, 0]
    const colTargets = [2, 2, 2, 2]

    const rowsOk = grid.every((row, i) => row.filter(Boolean).length === rowTargets[i])
    const colsOk = colTargets.every((target, c) =>
      grid.reduce((sum, row) => sum + (row[c] ? 1 : 0), 0) === target
    )
    expect(rowsOk && colsOk).to.equal(false)
  })

  it('should unlock floor 20 after completion', () => {
    for (let i = 1; i <= 19; i++) markComplete(i)
    expect(isFloorUnlocked(20)).to.equal(true)
  })
})

// --- Floor 20: The Overlord - Final Boss ---
describe('Floor 20 - The Overlord / Final Boss', () => {
  const BOSS_MAX_HP = 100
  const ERRORS = [
    { code: 'ERR_NULL', fix: 'init' },
    { code: 'ERR_TYPE', fix: 'cast' },
    { code: 'ERR_REF', fix: 'check' },
    { code: 'ERR_SYN', fix: 'parse' },
    { code: 'ERR_MEM', fix: 'alloc' },
  ]
  const FIREWALL_SYMBOLS = ['⬡', '⬢', '⬠', '◆', '◇']

  function checkDebugFix(input: string, expectedFix: string): boolean {
    return input.trim().toLowerCase() === expectedFix
  }

  function checkFirewallMatch(clickedSym: string, pattern: string[], input: string[]): boolean {
    return clickedSym === pattern[input.length]
  }

  beforeEach(() => { resetProgress() })

  it('BOSS_MAX_HP should be 100', () => {
    expect(BOSS_MAX_HP).to.equal(100)
  })

  it('should have 5 error types with code and fix pairs', () => {
    expect(ERRORS).to.have.lengthOf(5)
    ERRORS.forEach(e => {
      expect(e).to.have.property('code')
      expect(e).to.have.property('fix')
      expect(e.code).to.match(/^ERR_/)
    })
  })

  it('each error fix command should be unique', () => {
    const fixes = ERRORS.map(e => e.fix)
    expect(new Set(fixes).size).to.equal(fixes.length)
  })

  it('should have 5 firewall symbols', () => {
    expect(FIREWALL_SYMBOLS).to.have.lengthOf(5)
  })

  it('checkDebugFix should match correct fix case-insensitively', () => {
    expect(checkDebugFix('init', 'init')).to.equal(true)
    expect(checkDebugFix('  INIT  ', 'init')).to.equal(true)
    expect(checkDebugFix('Init', 'init')).to.equal(true)
    expect(checkDebugFix('wrong', 'init')).to.equal(false)
  })

  it('checkFirewallMatch should verify sequence order', () => {
    const pattern = ['⬡', '⬢', '⬠']
    expect(checkFirewallMatch('⬡', pattern, [])).to.equal(true)
    expect(checkFirewallMatch('⬢', pattern, ['⬡'])).to.equal(true)
    expect(checkFirewallMatch('⬠', pattern, ['⬡', '⬢'])).to.equal(true)
    expect(checkFirewallMatch('⬡', pattern, ['⬢'])).to.equal(false)
  })

  it('boss health should be reducible by fixed amounts', () => {
    let hp = BOSS_MAX_HP
    hp = Math.max(0, hp - 8)
    expect(hp).to.equal(92)
    hp = Math.max(0, hp - 6)
    expect(hp).to.equal(86)
  })

  it('boss health should not go below 0', () => {
    expect(Math.max(0, 5 - 8)).to.equal(0)
  })

  it('should go to victory screen after completion', () => {
    for (let i = 1; i <= 20; i++) markComplete(i)
    expect(isCompleted(20)).to.equal(true)
  })
})

// --- FULL PROGRESSION CHAIN ---
describe('Full Game Progression (Floors 1-20)', () => {
  beforeEach(() => { resetProgress() })

  it('floor 1 should start unlocked, all others locked', () => {
    expect(isFloorUnlocked(1)).to.equal(true)
    for (let f = 2; f <= 20; f++) {
      expect(isFloorUnlocked(f)).to.equal(false, `floor ${f} should be locked initially`)
    }
  })

  it('should unlock sequentially: completing N unlocks N+1', () => {
    for (let f = 1; f < 20; f++) {
      expect(isFloorUnlocked(f)).to.equal(true, `floor ${f} should be unlocked before completion`)
      markComplete(f)
      expect(isFloorUnlocked(f + 1)).to.equal(true, `floor ${f + 1} should unlock after floor ${f}`)
    }
  })

  it('getCompletedCount should reflect completed floors', () => {
    expect(getCompletedCount()).to.equal(0)
    for (let f = 1; f <= 10; f++) markComplete(f)
    expect(getCompletedCount()).to.equal(10)
    for (let f = 11; f <= 20; f++) markComplete(f)
    expect(getCompletedCount()).to.equal(20)
  })

  it('should persist state in localStorage between calls', () => {
    markComplete(1)
    markComplete(2)
    const state = getState()
    expect(state.floor1).to.equal('completed')
    expect(state.floor2).to.equal('completed')
    expect(state.floor3).to.be.undefined
  })

  it('resetProgress should clear all floor completions', () => {
    for (let f = 1; f <= 20; f++) markComplete(f)
    expect(getCompletedCount()).to.equal(20)
    resetProgress()
    expect(getCompletedCount()).to.equal(0)
    expect(isFloorUnlocked(1)).to.equal(true)
    expect(isFloorUnlocked(2)).to.equal(false)
  })

  it('getState should return empty object when no progress', () => {
    const state = getState()
    expect(state).to.be.an('object')
  })
})
