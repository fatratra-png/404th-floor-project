import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Sounds } from '../audio/sounds'
import { markComplete } from '../lib/gameLogic'

const COLOR_POOL = [
  { name: 'red', hex: '#ef4444', label: 'RED' },
  { name: 'blue', hex: '#3b82f6', label: 'BLUE' },
  { name: 'green', hex: '#22c55e', label: 'GREEN' },
  { name: 'yellow', hex: '#eab308', label: 'YELLOW' },
  { name: 'purple', hex: '#a855f7', label: 'PURPLE' },
]

function generateRound(round: number) {
  const count = Math.min(3 + round, 8)
  const targets = Array.from({ length: count }, () =>
    COLOR_POOL[Math.floor(Math.random() * COLOR_POOL.length)]
  )
  // Shuffle for the available wires
  const wires = [...targets].sort(() => Math.random() - 0.5)
  return { targets, wires, count }
}

const ROUNDS_TO_WIN = 5

export default function Floor7() {
  const navigate = useNavigate()
  const [round, setRound] = useState(1)
  const [roundData, setRoundData] = useState(() => generateRound(1))
  const [selected, setSelected] = useState<(typeof COLOR_POOL[number] | null)[]>([])
  const [phase, setPhase] = useState<'play' | 'success' | 'fail' | 'complete'>('play')
  const [completed, setCompleted] = useState(false)

  const resetRound = useCallback((r: number) => {
    const data = generateRound(r)
    setRoundData(data)
    setSelected(Array(data.count).fill(null))
    setPhase('play')
  }, [])

  const selectWire = useCallback((wireIdx: number, color: typeof COLOR_POOL[number]) => {
    if (phase !== 'play') return
    setSelected(prev => {
      const next = [...prev]
      if (next[wireIdx]?.name === color.name) {
        next[wireIdx] = null
      } else {
        next[wireIdx] = color
      }
      return next
    })
  }, [phase])

  const submitWiring = useCallback(() => {
    if (phase !== 'play') return
    const correct = roundData.targets.every((t, i) => selected[i]?.name === t.name)
    if (correct) {
      setPhase('success')
      Sounds.play('floor_complete')
      if (round >= ROUNDS_TO_WIN) {
        setPhase('complete')
        setCompleted(true)
        markComplete(7)
        Sounds.play('victory')
        setTimeout(() => navigate('/floor/8'), 2500)
      } else {
        setTimeout(() => {
          const nextRound = round + 1
          setRound(nextRound)
          resetRound(nextRound)
        }, 1500)
      }
    } else {
      setPhase('fail')
      Sounds.play('mem_fail')
      setTimeout(() => {
        resetRound(round)
      }, 1500)
    }
  }, [phase, roundData, selected, round, resetRound, navigate])

  return (
    <Layout floorNumber={7} title="Comms Hub" subtitle="Wire Cipher">
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 gap-6">
        <div className="w-full max-w-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 md:p-8 shadow-lg flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">WIRE CIPHER</h1>
          <p className="text-slate-500 font-mono text-sm">
            Connect each wire to the correct terminal
          </p>
        </div>

        <div className="text-sm font-mono text-slate-500">
          ROUND <span className="text-primary">{round}</span>/{ROUNDS_TO_WIN}
          <span className="mx-3 text-slate-700">|</span>
          WIRES <span className="text-yellow-400">{roundData.count}</span>
        </div>

        {/* Target colors */}
        <div className="flex gap-4">
          {roundData.targets.map((t, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-8 md:w-10 h-8 md:h-10 rounded-lg border-2 border-slate-600 flex items-center justify-center"
                style={{ backgroundColor: t.hex }}>
              </div>
              <span className="text-[9px] font-mono text-slate-500">{t.label}</span>
              {selected[i] && (
                <span className="text-[9px] font-mono text-green-400">✓</span>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full max-w-md h-px bg-slate-700/50" />

        {/* Wire slots */}
        <div className="flex gap-4">
          {Array.from({ length: roundData.count }).map((_, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div
                className={`w-10 md:w-14 h-10 md:h-14 rounded-lg border-2 flex items-center justify-center transition-all ${
                  selected[idx]
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-dashed border-slate-600 bg-slate-900/50'
                }`}
              >
                {selected[idx] && (
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: selected[idx].hex }} />
                )}
              </div>
              <span className="text-[8px] font-mono text-slate-600">SLOT {idx + 1}</span>
            </div>
          ))}
        </div>

        {/* Color picker */}
        <div className="flex gap-3">
          {COLOR_POOL.map((color) => (
            <button
              key={color.name}
              onClick={() => {
                // Find first empty slot and fill it
                const emptyIdx = selected.findIndex(s => s === null)
                if (emptyIdx !== -1) {
                  selectWire(emptyIdx, color)
                }
              }}
              disabled={phase !== 'play' || selected.every(s => s !== null)}
              className="w-10 md:w-12 h-10 md:h-12 rounded-xl transition-all hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-30 disabled:hover:scale-100 border-2 border-transparent hover:border-white"
              style={{ backgroundColor: color.hex, borderColor: selected.some(s => s?.name === color.name) ? '#22c55e' : 'transparent' }}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={submitWiring}
            disabled={phase !== 'play' || selected.some(s => s === null)}
            className="px-6 py-2 bg-primary hover:bg-blue-600 rounded-lg text-white font-bold text-sm transition-all disabled:opacity-30"
          >
            VERIFY CONNECTION
          </button>
          <button
            onClick={() => setSelected(Array(roundData.count).fill(null))}
            disabled={phase !== 'play'}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-sm transition-all disabled:opacity-30 border border-slate-700"
          >
            CLEAR ALL
          </button>
        </div>

        {phase === 'success' && <div className="text-green-400 text-sm font-mono animate-pulse">✓ CORRECT!</div>}
        {phase === 'fail' && <div className="text-red-400 text-sm font-mono animate-pulse">✗ WRONG! RETRY...</div>}
        {phase === 'complete' && (
          <div className="text-green-400 text-lg font-mono animate-pulse">✓ COMMS HUB ONLINE - PROCEEDING...</div>
        )}
        </div>
      </div>
    </Layout>
  )
}
