import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from './Layout'
import { Sounds } from '../audio/sounds'
import { markComplete } from '../lib/gameLogic'
import { checkSolution } from '../lib/puzzleEngine'
import { getLevel } from '../lib/levels'
import { PuzzleType } from '../types'
import type { PuzzleConfig, LevelDef } from '../types'

export default function PuzzleLevel({ floorNumber }: { floorNumber: number }) {
  const navigate = useNavigate()
  const level = getLevel(floorNumber) as LevelDef
  const [status, setStatus] = useState<'playing' | 'solved'>('playing')
  const [failShake, setFailShake] = useState(false)

  const handleSolve = useCallback(() => {
    setStatus('solved')
    markComplete(floorNumber)
    Sounds.play('victory')
    setTimeout(() => {
      if (floorNumber >= 404) navigate('/victory')
      else navigate(`/floor/${floorNumber + 1}`)
    }, 2500)
  }, [floorNumber, navigate])

  const handleFail = useCallback(() => {
    setFailShake(true)
    Sounds.play('mem_fail')
    setTimeout(() => setFailShake(false), 400)
  }, [])

  if (!level) {
    return (
      <Layout floorNumber={floorNumber} title="Unknown Sector" subtitle="Corrupted Signal">
        <div className="flex-1 flex items-center justify-center"><p className="text-red-400 font-mono">LEVEL DATA CORRUPTED</p></div>
      </Layout>
    )
  }

  return (
    <Layout floorNumber={floorNumber} title={level.name} subtitle={level.challenge}>
      <div className={`flex-1 flex flex-col items-center justify-center p-4 md:p-8 gap-4 ${failShake ? 'animate-[shake_0.2s_ease-in-out_2]' : ''}`}>
        <div className="w-full max-w-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 md:p-8 shadow-lg flex flex-col items-center gap-5">
          <div className="text-center">
            <div className="text-[10px] font-mono text-primary/50 tracking-wider">{level.zone}</div>
            <h1 className="text-xl font-bold text-white mt-1">{level.name}</h1>
            <p className="text-slate-500 text-xs font-mono mt-1 max-w-md">{level.desc}</p>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="text-[10px] font-mono text-slate-600">DIFFICULTY</span>
              {Array.from({ length: 10 }, (_, i) => (
                <span key={i} className={`text-xs ${i < level.diff ? 'text-primary' : 'text-slate-800'}`}>◆</span>
              ))}
            </div>
          </div>

          <PuzzleArea level={level} onSolve={handleSolve} onFail={handleFail} status={status} />

          {status === 'solved' && (
            <div className="text-green-400 text-lg font-mono animate-pulse">✓ SYSTEM RESTORED — ADVANCING...</div>
          )}
        </div>
      </div>
    </Layout>
  )
}

function PuzzleArea({ level, onSolve, onFail, status }: { level: LevelDef; onSolve: () => void; onFail: () => void; status: string }) {
  switch (level.type) {
    case PuzzleType.SORT: return <SortPuzzle config={level.config as any} onSolve={onSolve} onFail={onFail} status={status} />
    case PuzzleType.TWO_SUM: return <TwoSumPuzzle config={level.config as any} onSolve={onSolve} onFail={onFail} status={status} />
    case PuzzleType.SEQUENCE: return <SequencePuzzle config={level.config as any} onSolve={onSolve} onFail={onFail} status={status} />
    case PuzzleType.MAZE: return <MazePuzzle config={level.config as any} onSolve={onSolve} onFail={onFail} status={status} />
    case PuzzleType.FACTOR: return <FactorPuzzle config={level.config as any} onSolve={onSolve} onFail={onFail} status={status} />
    case PuzzleType.BALANCE: return <BalancePuzzle config={level.config as any} onSolve={onSolve} onFail={onFail} status={status} />
    case PuzzleType.PALINDROME: return <PalindromePuzzle config={level.config as any} onSolve={onSolve} onFail={onFail} status={status} />
    case PuzzleType.BINARY: return <BinaryPuzzle config={level.config as any} onSolve={onSolve} onFail={onFail} status={status} />
    case PuzzleType.PATTERN: return <PatternPuzzle config={level.config as any} onSolve={onSolve} onFail={onFail} status={status} />
    case PuzzleType.GRAPH: return <GraphPuzzle config={level.config as any} onSolve={onSolve} onFail={onFail} status={status} />
    default: return <p className="text-red-400 font-mono">UNKNOWN PUZZLE TYPE</p>
  }
}

function SortPuzzle({ config, onSolve, onFail, status }: { config: import('../types').SortConfig; onSolve: () => void; onFail: () => void; status: string }) {
  const [arr, setArr] = useState(() => [...config.values])
  const isSorted = (a: number[]) => a.every((v, i) => i === 0 || a[i - 1] <= v)
  const swap = (i: number) => {
    if (status !== 'playing') return
    const next = [...arr]; [next[i], next[i + 1]] = [next[i + 1], next[i]]
    setArr(next)
    Sounds.play('keyclick')
    if (isSorted(next)) onSolve()
  }
  const max = Math.max(...arr, 1)
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-slate-400 text-xs font-mono">Click adjacent elements to swap — sort ascending</p>
      <div className="flex items-end gap-1.5 h-36">
        {arr.map((v, i) => (
          <button key={i} onClick={() => swap(i)} disabled={i === arr.length - 1 || status !== 'playing'}
            className="flex flex-col items-center gap-1 group">
            <span className="text-[10px] font-mono text-slate-500">{v}</span>
            <div className={`w-9 rounded-t transition-all duration-150 ${status === 'solved' ? 'bg-green-500' : 'bg-primary/60 group-hover:bg-primary/80'} ${i < arr.length - 1 ? 'cursor-pointer' : 'cursor-default'}`}
              style={{ height: `${(v / max) * 100}%` }} />
          </button>
        ))}
      </div>
      {isSorted(arr) && status === 'playing' && <button onClick={onSolve} className="px-6 py-2 bg-green-600 rounded-lg text-white font-bold text-sm">CONFIRM SORTED</button>}
    </div>
  )
}

function TwoSumPuzzle({ config, onSolve, onFail, status }: { config: import('../types').TwoSumConfig; onSolve: () => void; onFail: () => void; status: string }) {
  const [selected, setSelected] = useState<number[]>([])
  const toggle = (i: number) => {
    if (status !== 'playing') return
    setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : prev.length < 2 ? [...prev, i] : [i])
  }
  const [checked, setChecked] = useState(false)
  const handleCheck = () => {
    if (selected.length !== 2) return
    setChecked(true)
    if (config.numbers[selected[0]] + config.numbers[selected[1]] === config.target) onSolve()
    else onFail()
  }
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-slate-400 text-xs font-mono">Find two numbers that sum to <span className="text-yellow-400 font-bold">{config.target}</span></p>
      <div className="flex flex-wrap gap-2 justify-center">
        {config.numbers.map((v, i) => (
          <button key={i} onClick={() => toggle(i)}
            className={`w-12 h-12 rounded-lg font-mono font-bold text-sm border-2 transition-all ${
              selected.includes(i) ? 'border-primary bg-primary/20 text-primary' : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-primary/50'
            } ${status !== 'playing' ? 'opacity-60' : ''}`}>
            {v}
          </button>
        ))}
      </div>
      <p className="text-[10px] font-mono text-slate-600">Selected: {selected.map(i => config.numbers[i]).join(' + ')} {selected.length === 2 ? `= ${config.numbers[selected[0]] + config.numbers[selected[1]]}` : ''}</p>
      {selected.length === 2 && status === 'playing' && (
        <button onClick={handleCheck} className="px-6 py-2 bg-primary rounded-lg text-white font-bold text-sm">VERIFY PAIR</button>
      )}
      {checked && status !== 'solved' && <p className="text-red-400 text-xs font-mono">WRONG PAIR — TRY AGAIN</p>}
    </div>
  )
}

function SequencePuzzle({ config, onSolve, onFail, status }: { config: import('../types').SequenceConfig; onSolve: () => void; onFail: () => void; status: string }) {
  const [answer, setAnswer] = useState('')
  const handleSubmit = () => {
    if (parseInt(answer, 10) === config.answer) onSolve()
    else onFail()
  }
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-slate-400 text-xs font-mono">Find the missing term in the sequence</p>
      <div className="flex gap-2 items-center">
        {config.terms.map((v, i) => (
          <div key={i} className={`w-12 h-12 flex items-center justify-center rounded-lg font-mono font-bold text-lg ${
            v === -1 ? 'bg-slate-900 border-2 border-dashed border-yellow-500/50 text-yellow-500' : 'bg-slate-800 text-slate-300'
          }`}>
            {v === -1 ? '?' : v}
          </div>
        ))}
      </div>
      {status === 'playing' && (
        <div className="flex gap-2 items-center">
          <input type="text" value={answer} onChange={e => setAnswer(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-24 bg-black/60 border border-slate-700 rounded-lg py-2 px-3 text-center font-mono text-lg text-primary focus:border-primary outline-none" placeholder="?" />
          <button onClick={handleSubmit} disabled={!answer} className="px-4 py-2 bg-primary rounded-lg text-white font-bold text-sm disabled:opacity-30">SUBMIT</button>
        </div>
      )}
    </div>
  )
}

function MazePuzzle({ config, onSolve, onFail, status }: { config: import('../types').MazeConfig; onSolve: () => void; onFail: () => void; status: string }) {
  const [pos, setPos] = useState<[number, number]>(config.start)
  const [visited, setVisited] = useState<Set<string>>(() => new Set([`${config.start[0]},${config.start[1]}`]))
  const move = (r: number, c: number) => {
    if (status !== 'playing') return
    if (r < 0 || r >= config.height || c < 0 || c >= config.width) return
    if (config.grid[r][c] === 1) return
    const dr = Math.abs(r - pos[0]); const dc = Math.abs(c - pos[1])
    if (dr + dc !== 1) return
    setPos([r, c])
    setVisited(prev => { const n = new Set(prev); n.add(`${r},${c}`); return n })
    Sounds.play('keyclick')
    if (r === config.end[0] && c === config.end[1]) onSolve()
  }
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <p className="text-slate-400 text-xs font-mono">Navigate from <span className="text-green-400">S</span> to <span className="text-red-400">E</span> (click adjacent cells)</p>
      <div className="inline-block bg-slate-900 rounded-lg p-2 border border-slate-700" style={{ display: 'grid', gridTemplateColumns: `repeat(${config.width}, minmax(0, 1fr))`, gap: 2 }}>
        {Array.from({ length: config.height }, (_, r) => Array.from({ length: config.width }, (_, c) => {
          const isWall = config.grid[r][c] === 1
          const isPlayer = r === pos[0] && c === pos[1]
          const isStart = r === config.start[0] && c === config.start[1]
          const isEnd = r === config.end[0] && c === config.end[1]
          const isVisited = visited.has(`${r},${c}`)
          const dr = Math.abs(r - pos[0]); const dc = Math.abs(c - pos[1])
          const isAdj = dr + dc === 1 && !isWall
          return (
            <button key={`${r}-${c}`} onClick={() => move(r, c)}
              className={`w-8 h-8 rounded text-xs font-mono transition-all ${
                isWall ? 'bg-slate-950 cursor-default' :
                isPlayer ? 'bg-green-500 text-black font-bold' :
                isEnd ? 'bg-red-500/30 text-red-400 border border-red-500/50' :
                isStart ? 'bg-green-500/30 text-green-400 border border-green-500/50' :
                isVisited ? 'bg-primary/20 text-primary/50' :
                isAdj ? 'bg-slate-800 hover:bg-slate-700 text-slate-500 cursor-pointer' :
                'bg-slate-900 text-slate-800 cursor-default'
              }`}>
              {isPlayer ? '●' : isStart ? 'S' : isEnd ? 'E' : ''}
            </button>
          )
        }))}
      </div>
    </div>
  )
}

function FactorPuzzle({ config, onSolve, onFail, status }: { config: import('../types').FactorConfig; onSolve: () => void; onFail: () => void; status: string }) {
  const [inputs, setInputs] = useState<string[]>(['', '', '', ''])
  const [error, setError] = useState(false)
  const handleSubmit = () => {
    const nums = inputs.map(s => parseInt(s, 10)).filter(n => !isNaN(n) && n > 0)
    if (nums.length === 0) return
    const product = nums.reduce((a, b) => a * b, 1)
    if (product === config.number && nums.every(n => config.number % n === 0)) onSolve()
    else { setError(true); onFail(); setTimeout(() => setError(false), 1000) }
  }
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-slate-400 text-xs font-mono">Enter the <span className="text-yellow-400">prime factors</span> of <span className="text-xl font-bold text-white">{config.number}</span></p>
      <div className="flex gap-2">
        {inputs.map((v, i) => (
          <input key={i} type="text" value={v} onChange={e => {
            const n = [...inputs]; n[i] = e.target.value.replace(/\D/g, '').slice(0, 4); setInputs(n)
          }} disabled={status !== 'playing'}
            className={`w-16 bg-black/60 border rounded-lg py-2 px-2 text-center font-mono text-lg text-primary focus:outline-none ${error ? 'border-red-500' : 'border-slate-700 focus:border-primary'}`} />
        ))}
      </div>
      <p className="text-[10px] font-mono text-slate-600">Enter factors separated by input boxes</p>
      {status === 'playing' && <button onClick={handleSubmit} className="px-6 py-2 bg-primary rounded-lg text-white font-bold text-sm">VERIFY FACTORS</button>}
    </div>
  )
}

function BalancePuzzle({ config, onSolve, onFail, status }: { config: import('../types').BalanceConfig; onSolve: () => void; onFail: () => void; status: string }) {
  const handleChoice = (b: boolean) => {
    if (b === config.balanced) onSolve()
    else onFail()
  }
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-slate-400 text-xs font-mono">Is this expression <span className="text-yellow-400">balanced</span>? (parentheses/brackets/braces)</p>
      <div className="bg-slate-900 border border-slate-700 rounded-xl px-6 py-4">
        <span className="text-2xl font-mono font-bold text-primary tracking-widest">{config.expr}</span>
      </div>
      {status === 'playing' && (
        <div className="flex gap-4">
          <button onClick={() => handleChoice(true)} className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold">BALANCED</button>
          <button onClick={() => handleChoice(false)} className="px-8 py-3 bg-red-600 hover:bg-red-500 rounded-lg text-white font-bold">UNBALANCED</button>
        </div>
      )}
    </div>
  )
}

function PalindromePuzzle({ config, onSolve, onFail, status }: { config: import('../types').PalindromeConfig; onSolve: () => void; onFail: () => void; status: string }) {
  const handleChoice = (b: boolean) => {
    if (b === config.isPalindrome) onSolve()
    else onFail()
  }
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-slate-400 text-xs font-mono">Is this a <span className="text-yellow-400">palindrome</span>? (same forwards & backwards)</p>
      <div className="bg-slate-900 border border-slate-700 rounded-xl px-6 py-4">
        <span className="text-2xl font-mono font-bold text-primary tracking-wider">{config.text}</span>
      </div>
      {status === 'playing' && (
        <div className="flex gap-4">
          <button onClick={() => handleChoice(true)} className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold">YES</button>
          <button onClick={() => handleChoice(false)} className="px-8 py-3 bg-red-600 hover:bg-red-500 rounded-lg text-white font-bold">NO</button>
        </div>
      )}
    </div>
  )
}

function BinaryPuzzle({ config, onSolve, onFail, status }: { config: import('../types').BinaryConfig; onSolve: () => void; onFail: () => void; status: string }) {
  const [answer, setAnswer] = useState('')
  const handleSubmit = () => {
    if (answer === config.binary) onSolve()
    else onFail()
  }
  const bits = config.binary.length
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-slate-400 text-xs font-mono">Convert <span className="text-xl font-bold text-white">{config.decimal}</span> to <span className="text-yellow-400">binary</span></p>
      <div className="flex gap-1">
        {Array.from({ length: bits }, (_, i) => (
          <div key={i} className={`w-8 h-10 rounded flex items-center justify-center text-xs font-mono ${
            answer.length > i ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-slate-900 border border-slate-700 text-slate-600'
          }`}>
            {answer[i] || '_'}
          </div>
        ))}
      </div>
      {status === 'playing' && (
        <div className="flex gap-2">
          <input type="text" value={answer} onChange={e => setAnswer(e.target.value.replace(/[^01]/g, '').slice(0, bits))}
            className="w-32 bg-black/60 border border-slate-700 rounded-lg py-2 px-3 text-center font-mono text-lg text-primary focus:border-primary outline-none" placeholder="binary..." />
          <button onClick={handleSubmit} disabled={answer.length !== bits} className="px-4 py-2 bg-primary rounded-lg text-white font-bold text-sm disabled:opacity-30">CONVERT</button>
        </div>
      )}
    </div>
  )
}

function PatternPuzzle({ config, onSolve, onFail, status }: { config: import('../types').PatternConfig; onSolve: () => void; onFail: () => void; status: string }) {
  const [selected, setSelected] = useState<number | null>(null)
  const handleSubmit = () => {
    if (selected === config.answerIndex) onSolve()
    else onFail()
  }
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-slate-400 text-xs font-mono">What comes next in the pattern?</p>
      <div className="flex gap-2 items-center">
        {config.items.map((v, i) => (
          <div key={i} className="w-11 h-11 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-mono font-bold text-lg">{v}</div>
        ))}
        <div className="text-slate-600 text-xl mx-1">→</div>
        <div className="w-11 h-11 flex items-center justify-center rounded-lg border-2 border-dashed border-yellow-500/50 text-yellow-500 font-mono font-bold text-lg">?</div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center max-w-xs">
        {config.options.map((v, i) => (
          <button key={i} onClick={() => status === 'playing' && setSelected(i)}
            className={`w-11 h-11 rounded-lg font-mono font-bold text-lg border-2 transition-all ${
              selected === i ? 'border-primary bg-primary/20 text-primary' : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-primary/50'
            }`}>{v}</button>
        ))}
      </div>
      {selected !== null && status === 'playing' && (
        <button onClick={handleSubmit} className="px-6 py-2 bg-primary rounded-lg text-white font-bold text-sm">CONFIRM</button>
      )}
    </div>
  )
}

function GraphPuzzle({ config, onSolve, onFail, status }: { config: import('../types').GraphConfig; onSolve: () => void; onFail: () => void; status: string }) {
  const [path, setPath] = useState<number[]>([config.start])
  const [hovered, setHovered] = useState<number | null>(null)
  const edgeSet = new Set(config.edges.map(e => `${e[0]},${e[1]}`))
  const isConnected = (a: number, b: number) => edgeSet.has(`${a},${b}`) || edgeSet.has(`${b},${a}`)
  const clickNode = (n: number) => {
    if (status !== 'playing') return
    if (n === path[path.length - 1]) return
    const last = path[path.length - 1]
    if (!isConnected(n, last)) return onFail()
    if (path.includes(n)) {
      setPath(prev => [...prev.slice(0, prev.indexOf(n) + 1)])
      return
    }
    const next = [...path, n]
    setPath(next)
    Sounds.play('keyclick')
    if (n === config.end) onSolve()
  }
  const positions = Array.from({ length: config.nodes }, (_, i) => {
    const angle = (i / config.nodes) * Math.PI * 2 - Math.PI / 2
    return { x: 50 + 35 * Math.cos(angle), y: 50 + 35 * Math.sin(angle) }
  })
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <p className="text-slate-400 text-xs font-mono">Traverse from node <span className="text-green-400">{config.start}</span> to <span className="text-red-400">{config.end}</span></p>
      <svg viewBox="0 0 100 100" className="w-56 h-56">
        {config.edges.map(([a, b], i) => (
          <line key={i} x1={positions[a].x} y1={positions[a].y} x2={positions[b].x} y2={positions[b].y}
            stroke={path.includes(a) && path.includes(b) && Math.abs(path.indexOf(a) - path.indexOf(b)) === 1 ? '#22c55e' : '#334155'}
            strokeWidth={path.includes(a) && path.includes(b) && Math.abs(path.indexOf(a) - path.indexOf(b)) === 1 ? 2.5 : 1.5} />
        ))}
        {positions.map((pos, i) => (
          <g key={i} onClick={() => clickNode(i)} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} className="cursor-pointer">
            <circle cx={pos.x} cy={pos.y} r={6}
              fill={path.includes(i) ? '#135bec' : path.length > 0 && isConnected(i, path[path.length - 1]) ? '#1e293b' : '#0f172a'}
              stroke={i === config.end ? '#ef4444' : i === config.start ? '#22c55e' : path.includes(i) ? '#135bec' : hovered === i && isConnected(i, path[path.length - 1]) ? '#135bec' : '#334155'}
              strokeWidth={2} />
            <text x={pos.x} y={pos.y + 0.4} textAnchor="middle" fontSize="4.5" fill={path.includes(i) ? '#fff' : '#94a3b8'} className="pointer-events-none">{i}</text>
          </g>
        ))}
      </svg>
      <p className="text-[10px] font-mono text-slate-600">Path: {path.join(' → ')}</p>
    </div>
  )
}
