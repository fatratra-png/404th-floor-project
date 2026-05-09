import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Sounds } from '../audio/sounds'
import { markComplete } from '../lib/gameLogic'

const CIRCUIT_COUNT = 5
const MAX_POWER = 100
const TARGET_MIN = 45
const TARGET_MAX = 55
const SUSTAIN_TIME = 3000

interface Circuit {
  id: number
  power: number
}

export default function Floor6() {
  const navigate = useNavigate()
  const [circuits, setCircuits] = useState<Circuit[]>(
    Array.from({ length: CIRCUIT_COUNT }, (_, i) => ({ id: i, power: 20 + Math.random() * 60 }))
  )
  const [sustainTimer, setSustainTimer] = useState(0)
  const [completed, setCompleted] = useState(false)
  const activeRef = useRef(true)

  useEffect(() => {
    const drift = setInterval(() => {
      if (!activeRef.current) return
      setCircuits(prev => prev.map(c => ({
        ...c,
        power: Math.max(0, Math.min(MAX_POWER, c.power + (Math.random() - 0.5) * 6))
      })))
    }, 300)

    const sustainCheck = setInterval(() => {
      if (!activeRef.current) return
      setCircuits(current => {
        const allBalanced = current.every(c => c.power >= TARGET_MIN && c.power <= TARGET_MAX)
        if (allBalanced) {
          setSustainTimer(prev => {
            const next = prev + 100
            if (next >= SUSTAIN_TIME) {
              activeRef.current = false
              setCompleted(true)
              markComplete(6)
              Sounds.play('victory')
              setTimeout(() => navigate('/floor/7'), 2500)
              return SUSTAIN_TIME
            }
            return next
          })
        } else {
          setSustainTimer(0)
        }
        return current
      })
    }, 100)

    return () => {
      clearInterval(drift)
      clearInterval(sustainCheck)
    }
  }, [navigate])

  const transferPower = useCallback((from: number, to: number) => {
    if (!activeRef.current) return
    setCircuits(prev => {
      const next = [...prev]
      const amount = 8
      if (next[from].power >= amount && next[to].power + amount <= MAX_POWER) {
        next[from] = { ...next[from], power: next[from].power - amount }
        next[to] = { ...next[to], power: next[to].power + amount }
        Sounds.play('wire_cut')
      }
      return next
    })
  }, [])

  const sustainPct = Math.min(100, (sustainTimer / SUSTAIN_TIME) * 100)
  const allBalanced = circuits.every(c => c.power >= TARGET_MIN && c.power <= TARGET_MAX)

  return (
    <Layout floorNumber={6} title="Power Plant" subtitle="Circuit Balance">
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-[#080b0f] gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">CIRCUIT OVERLOAD</h1>
          <p className="text-slate-500 font-mono text-sm">
            Balance all circuits between {TARGET_MIN}-{TARGET_MAX}%
          </p>
        </div>

        {/* Sustain bar */}
        <div className="w-full max-w-lg">
          <div className="flex justify-between text-[10px] text-slate-600 font-mono mb-1">
            <span>BALANCE SUSTAIN</span>
            <span>{Math.round(sustainPct)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div className={`h-full transition-all duration-100 ${allBalanced ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${sustainPct}%` }}
            />
          </div>
        </div>

        {/* Circuits */}
        <div className="flex gap-4 items-end">
          {circuits.map((circuit, idx) => {
            const balanced = circuit.power >= TARGET_MIN && circuit.power <= TARGET_MAX
            return (
                <div key={circuit.id} className="flex flex-col items-center gap-2">
                  <div className="text-[10px] font-mono text-slate-500">C{idx + 1}</div>
                  <div className="relative w-12 md:w-16 h-36 md:h-48 bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                  <div
                    className={`absolute bottom-0 left-0 right-0 transition-all duration-200 ${
                      balanced ? 'bg-green-500' : circuit.power > TARGET_MAX ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ height: `${circuit.power}%` }}
                  />
                  {/* Target zone */}
                  <div
                    className="absolute bottom-[45%] left-0 right-0 h-[10%] border-l-2 border-r-2 border-primary/30 bg-primary/5"
                  />
                </div>
                <div className={`text-xs font-mono font-bold ${balanced ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.round(circuit.power)}%
                </div>
                <div className="flex gap-1">
                  {idx > 0 && (
                    <button
                      onClick={() => transferPower(idx, idx - 1)}
                      disabled={!activeRef.current || completed}
                      className="text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-slate-400 disabled:opacity-30"
                    >
                      ◄
                    </button>
                  )}
                  {idx < CIRCUIT_COUNT - 1 && (
                    <button
                      onClick={() => transferPower(idx, idx + 1)}
                      disabled={!activeRef.current || completed}
                      className="text-[10px] px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 text-slate-400 disabled:opacity-30"
                    >
                      ►
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-6 text-sm font-mono">
          <div className={`px-3 py-1 rounded ${allBalanced ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {allBalanced ? 'BALANCED' : 'UNBALANCED'}
          </div>
          <div className="text-slate-500">
            TARGET: <span className="text-primary">{TARGET_MIN}% - {TARGET_MAX}%</span>
          </div>
        </div>

        {completed && (
          <div className="text-green-400 text-lg font-mono animate-pulse">
            ✓ ALL CIRCUITS BALANCED - POWER RESTORED
          </div>
        )}
      </div>
    </Layout>
  )
}
