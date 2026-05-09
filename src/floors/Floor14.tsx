import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Sounds } from '../audio/sounds'
import { markComplete } from '../lib/gameLogic'

const TARGET_MIN = 38
const TARGET_MAX = 62
const SUSTAIN_TIME = 5000

export default function Floor14() {
  const navigate = useNavigate()
  const [temp, setTemp] = useState(50)
  const [sustainTimer, setSustainTimer] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [active, setActive] = useState(true)
  const [difficulty, setDifficulty] = useState(1)
  const tempRef = useRef(temp)
  const activeRef = useRef(true)

  tempRef.current = temp
  activeRef.current = active

  useEffect(() => {
    const drift = setInterval(() => {
      if (!activeRef.current) return
      setTemp(prev => {
        const driftAmt = (Math.random() - 0.5) * 5 * difficulty
        return Math.max(0, Math.min(100, prev + driftAmt))
      })
    }, 200)

    const sustain = setInterval(() => {
      if (!activeRef.current) return
      setTemp(current => {
        if (current >= TARGET_MIN && current <= TARGET_MAX) {
          setSustainTimer(prev => {
            const next = prev + 100
            if (next >= SUSTAIN_TIME) {
              setActive(false)
              setCompleted(true)
              markComplete(14)
              Sounds.play('victory')
              setTimeout(() => navigate('/floor/15'), 2500)
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

    // Increase difficulty over time
    const diffInterval = setInterval(() => {
      setDifficulty(prev => Math.min(5, prev + 0.5))
    }, 5000)

    return () => {
      clearInterval(drift)
      clearInterval(sustain)
      clearInterval(diffInterval)
    }
  }, [navigate])

  const adjustTemp = (dir: 'up' | 'down') => {
    if (!activeRef.current || completed) return
    setTemp(prev => Math.max(0, Math.min(100, prev + (dir === 'up' ? 4 : -4))))
    Sounds.play('keyclick')
  }

  const inZone = temp >= TARGET_MIN && temp <= TARGET_MAX
  const sustainPct = Math.min(100, (sustainTimer / SUSTAIN_TIME) * 100)

  return (
    <Layout floorNumber={14} title="Thermal Control" subtitle="Temperature Regulation">
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#080b0f] gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">THERMAL CONTROL</h1>
          <p className="text-slate-500 font-mono text-sm">
            Keep temperature in the green zone
          </p>
        </div>

        <div className="flex gap-6 text-sm font-mono">
          <div className="text-slate-500">DANGER <span className="text-red-400">{difficulty.toFixed(1)}x</span></div>
          <div className={inZone ? 'text-green-400' : 'text-red-400'}>{inZone ? 'STABLE' : 'CRITICAL'}</div>
        </div>

        {/* Thermometer */}
        <div className="relative w-24 h-72 bg-slate-900 rounded-xl border-2 border-slate-700 overflow-hidden">
          {/* Green zone */}
          <div
            className="absolute left-0 right-0 bg-green-500/20 border-y border-green-500/30"
            style={{ bottom: `${TARGET_MIN}%`, height: `${TARGET_MAX - TARGET_MIN}%` }}
          />
          {/* Mercury */}
          <div
            className="absolute bottom-0 left-0 right-0 transition-all duration-150"
            style={{
              height: `${temp}%`,
              background: `linear-gradient(to top, ${inZone ? '#22c55e' : temp > TARGET_MAX ? '#eab308' : '#ef4444'}, ${inZone ? '#16a34a' : temp > TARGET_MAX ? '#ca8a04' : '#dc2626'})`,
              boxShadow: `0 0 20px ${inZone ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
            }}
          />
          {/* Labels */}
          <div className="absolute top-1 right-1 text-[8px] font-mono text-slate-600">100</div>
          <div className="absolute bottom-1 right-1 text-[8px] font-mono text-slate-600">0</div>
        </div>

        <div className="text-4xl font-mono font-bold">
          <span className={inZone ? 'text-green-400' : temp > TARGET_MAX ? 'text-yellow-400' : 'text-red-400'}>
            {Math.round(temp)}°C
          </span>
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          <button
            onClick={() => adjustTemp('down')}
            disabled={!active || completed}
            className="w-20 h-20 rounded-full bg-primary hover:bg-blue-600 disabled:opacity-30 transition-all flex items-center justify-center text-3xl font-bold active:scale-95"
          >
            −
          </button>
          <button
            onClick={() => adjustTemp('up')}
            disabled={!active || completed}
            className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 disabled:opacity-30 transition-all flex items-center justify-center text-3xl font-bold active:scale-95"
          >
            +
          </button>
        </div>

        {/* Sustain */}
        <div className="w-full max-w-sm">
          <div className="flex justify-between text-[10px] font-mono text-slate-600 mb-1">
            <span>STABILITY</span>
            <span>{Math.round(sustainPct)}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all duration-100 ${inZone ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${sustainPct}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="text-[10px] font-mono text-slate-600">ZONE: {TARGET_MIN}°C - {TARGET_MAX}°C</div>
        </div>

        {completed && (
          <div className="text-green-400 text-lg font-mono animate-pulse">✓ THERMAL STABILITY ACHIEVED</div>
        )}
      </div>
    </Layout>
  )
}
