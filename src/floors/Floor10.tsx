import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Sounds } from '../audio/sounds'
import { markComplete } from '../lib/gameLogic'

const GRID = 5
const PIPE_TYPES = ['─', '│', '┌', '┐', '└', '┘', '┴', '┬', '├', '┤', '┼']

function generateGrid() {
  const grid: string[][] = []
  for (let r = 0; r < GRID; r++) {
    const row: string[] = []
    for (let c = 0; c < GRID; c++) {
      row.push(PIPE_TYPES[Math.floor(Math.random() * PIPE_TYPES.length)])
    }
    grid.push(row)
  }
  return grid
}

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

export default function Floor10() {
  const navigate = useNavigate()
  const [grid, setGrid] = useState(() => generateGrid())
  const [clicks, setClicks] = useState(0)
  const [completed, setCompleted] = useState(false)

  const rotate = useCallback((r: number, c: number) => {
    if (completed) return
    setGrid(prev => {
      const next = prev.map(row => [...row])
      next[r][c] = ROTATE_MAP[next[r][c]] || next[r][c]
      return next
    })
    setClicks(prev => prev + 1)
    Sounds.play('keyclick')
  }, [completed])

  const checkSolution = useCallback(() => {
    if (completed) return
    const flow = checkFlow(grid)
    if (flow) {
      setCompleted(true)
      markComplete(10)
      Sounds.play('victory')
      setTimeout(() => navigate('/floor/11'), 2500)
    } else {
      Sounds.play('mem_fail')
    }
  }, [grid, completed, navigate])

  const connected = checkFlow(grid)

  return (
    <Layout floorNumber={10} title="Pipe Network" subtitle="Connect the Flow">
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#080b0f] gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">PIPE NETWORK</h1>
          <p className="text-slate-500 font-mono text-sm">
            Rotate pipes to connect flow from left to right
          </p>
        </div>

        <div className="flex gap-6 text-sm font-mono">
          <div className="text-slate-500">CLICKS <span className="text-yellow-400">{clicks}</span></div>
          <div className={connected ? 'text-green-400' : 'text-red-400'}>{connected ? 'FLOWING' : 'BLOCKED'}</div>
        </div>

        {/* In/Out markers */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-primary">IN ▶</span>
          <div className="grid grid-cols-5 gap-1.5" style={{ direction: 'ltr' }}>
            {grid.map((row, r) => (
              row.map((cell, c) => (
                <button
                  key={`${r}-${c}`}
                  onClick={() => rotate(r, c)}
                  className="w-14 h-14 rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all font-mono hover:border-primary bg-slate-900/50"
                  style={{
                    borderColor: c === 0 ? '#135bec' : c === GRID - 1 ? '#22c55e' : '#334155',
                    color: connected && (c === 0 || c === GRID - 1) ? '#22c55e' : '#94a3b8',
                  }}
                >
                  {cell}
                </button>
              ))
            ))}
          </div>
          <span className="text-xs font-mono text-green-400">◀ OUT</span>
        </div>

        <button
          onClick={checkSolution}
          disabled={completed}
          className="px-8 py-3 bg-primary hover:bg-blue-600 rounded-lg text-white font-bold transition-all disabled:opacity-30"
        >
          {completed ? '✓ FLOW ESTABLISHED' : 'TEST FLOW'}
        </button>

        {completed && (
          <div className="text-green-400 text-lg font-mono animate-pulse">✓ PIPE NETWORK CONNECTED</div>
        )}
      </div>
    </Layout>
  )
}
