import { describe, it, before, after, beforeEach } from 'mocha'
import { expect } from 'chai'

// Mock localStorage for Node
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
  isFloorUnlocked,
  markComplete,
  getState,
  resetProgress,
  generateSequence,
  generateCipher,
  BUG_TYPES,
} from '../src/lib/gameLogic.js'

describe('Game Logic', () => {
  beforeEach(() => {
    Object.keys(store).forEach(k => delete store[k])
  })

  describe('getState()', () => {
    it('should return empty object when no progress saved', () => {
      const state = getState()
      expect(state).to.be.an('object')
    })
  })

  describe('markComplete() / isFloorUnlocked()', () => {
    it('floor 1 should always be unlocked', () => {
      expect(isFloorUnlocked(1)).to.equal(true)
    })

    it('floor 2 should be locked initially', () => {
      expect(isFloorUnlocked(2)).to.equal(false)
    })

    it('should unlock floor 2 after completing floor 1', () => {
      markComplete(1)
      expect(isFloorUnlocked(2)).to.equal(true)
    })

    it('floor 3 should remain locked without completing floor 2', () => {
      expect(isFloorUnlocked(3)).to.equal(false)
    })

    it('should unlock floors sequentially', () => {
      markComplete(1)
      markComplete(2)
      markComplete(3)
      expect(isFloorUnlocked(4)).to.equal(true)
      expect(isFloorUnlocked(5)).to.equal(false)
    })

    it('should persist completion state', () => {
      markComplete(1)
      const state = getState()
      expect(state.floor1).to.equal('completed')
    })
  })

  describe('resetProgress()', () => {
    it('should clear all progress', () => {
      markComplete(1)
      resetProgress()
      const state = getState()
      expect(state).to.not.have.property('floor1')
      expect(isFloorUnlocked(2)).to.equal(false)
    })
  })

  describe('generateSequence()', () => {
    it('should generate array of specified length', () => {
      const seq = generateSequence(5)
      expect(seq).to.have.lengthOf(5)
    })

    it('should only contain numbers 0-3', () => {
      const seq = generateSequence(20)
      seq.forEach(n => {
        expect(n).to.be.at.least(0)
        expect(n).to.be.at.most(3)
      })
    })

    it('should generate different sequences on successive calls', () => {
      const seq1 = generateSequence(10)
      const seq2 = generateSequence(10)
      expect(JSON.stringify(seq1)).to.not.equal(JSON.stringify(seq2))
    })
  })

  describe('generateCipher()', () => {
    it('should return arrays of specified length', () => {
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

    it('colors and solution should have same content', () => {
      const result = generateCipher(5)
      expect(result.colors.sort()).to.deep.equal(result.solution.sort())
    })
  })
})

describe('Floor 4 Bug Types', () => {
  it('should have at least 5 bug types', () => {
    expect(BUG_TYPES.length).to.be.at.least(5)
  })

  it('each bug type should have label, icon, and msg', () => {
    BUG_TYPES.forEach(bug => {
      expect(bug).to.have.property('label')
      expect(bug).to.have.property('icon')
      expect(bug).to.have.property('msg')
    })
  })
})
