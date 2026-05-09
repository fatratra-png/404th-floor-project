import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Sounds } from '../audio/sounds'
import { markComplete } from '../lib/gameLogic'

const GAUGE_COUNT = 4
const TARGET_MIN = 30
const TARGET_MAX = 70
const SUSTAIN_TIME = 4000

interface Gauge {
  value: number
  drift: number
}

export default function Floor17() {
  const navigate = useNavigate()
  const [gauges, setGauges] = useState<Gauge[]>(() =>
    Array.from({ length: GAUGE_COUNT }, () => ({ value: 50, drift: (Math.random() - 0.5) * 0.5 }))
  )
  const [sustainTimer, setSustainTimer] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [active, setActive] = useState(true)
  const [failedGauge, setFailedGauge] = useState<number | null>(null)
  const activeRef = useRef(true)

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    const drift = setInterval(() => {
      if (!activeRef.current) return
      setGauges(prev => prev.map(g => ({
        ...g,
        value: Math.max(0, Math.min(100, g.value + g.drift + (Math.random() - 0.5) * 3)),
        drift: g.drift + (Math.random() - 0.5) * 0.05,
      })))
    }, 150)

    const sustainCheck = setInterval(() => {
      if (!activeRef.current) return
      setGauges(current => {
        const allStable = current.every(g => g.value >= TARGET_MIN && g.value <= TARGET_MAX)
        if (allStable) {
          setSustainTimer(prev => {
            const next = prev + 100
            if (next >= SUSTAIN_TIME) {
              setActive(false)
              setCompleted(true)
              markComplete(17)
              Sounds.play('victory')
              setTimeout(() => navigate('/floor/18'), 2500)
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

  const adjustGauge = (idx: number, dir: number) => {
    if (!active || completed) return
    setFailedGauge(null)
    setGauges(prev => {
      const next = [...prev]
      next[idx] = { ...next[idx], value: Math.max(0, Math.min(100, next[idx].value + dir * 8)) }
      return next
    })
    Sounds.play('keyclick')
  }

  const allStable = gauges.every(g => g.value >= TARGET_MIN && g.value <= TARGET_MAX)
  const sustainPct = Math.min(100, (sustainTimer / SUSTAIN_TIME) * 100)

  return (
    <Layout floorNumber={17} title="Oxygen Scrubber" subtitle="Multi-Gauge Balance">
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#080b0f] gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">OXYGEN SCRUBBER</h1>
          <p className="text-slate-500 font-mono text-sm">
            Keep all gauges in the green zone simultaneously
          </p>
        </div>

        <div className="flex gap-6 text-sm font-mono">
          <div className={allStable ? 'text-green-400' : 'text-red-400'}>
            {allStable ? 'ALL STABLE' : 'UNSTABLE'}
          </div>
        </div>

        {/* Gauges */}
        <div className="flex gap-4 items-end">
          {gauges.map((g, i) => {
            const stable = g.value >= TARGET_MIN && g.value <= TARGET_MAX
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="text-[10px] font-mono text-slate-500">SCRUBBER {i + 1}</div>
                <div className="relative w-16 h-48 bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                  <div
                    className="absolute left-0 right-0 bg-green-500/20 border-y border-green-500/30"
                    style={{ bottom: `${TARGET_MIN}%`, height: `${TARGET_MAX - TARGET_MIN}%` }}
                  />
                  <div
                    className={`absolute bottom-0 left-0 right-0 transition-all duration-150 ${
                      stable ? 'bg-green-500' : g.value > TARGET_MAX ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{
                      height: `${g.value}%`,
                      boxShadow: stable ? '0 0 10px rgba(34,197,94,0.3)' : '0 0 10px rgba(239,68,68,0.3)',
                    }}
                  />
                </div>
                <div className={`text-xs font-mono font-bold ${stable ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.round(g.value)}%
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => adjustGauge(i, -1)}
                    disabled={!active || completed}
                    className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 disabled:opacity-30 flex items-center justify-center text-xs"
                  >
                    −
                  </button>
                  <button
                    onClick={() => adjustGauge(i, 1)}
                    disabled={!active || completed}
                    className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 disabled:opacity-30 flex items-center justify-center text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Sustain bar */}
        <div className="w-full max-w-sm">
          <div className="flex justify-between text-[10px] font-mono text-slate-600 mb-1">
            <span>STABILITY SUSTAIN</span>
            <span>{Math.round(sustainPct)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all duration-100 ${allStable ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${sustainPct}%` }}
            />
          </div>
        </div>

        {completed && (
          <div className="text-green-400 text-lg font-mono animate-pulse">✓ OXYGEN LEVELS STABILIZED</div>
        )}
      </div>
    </Layout>
  )
}
