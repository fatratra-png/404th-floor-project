import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Sounds } from '../audio/sounds'
import { markComplete } from '../lib/gameLogic'

const TARGET = 90
const GAIN = 8
const DECAY = 0.8
const DECAY_RATE = 80
const SUSTAIN_NEEDED = 3000

export default function Floor3() {
  const navigate = useNavigate()
  const [pressure, setPressure] = useState(0)
  const [sustainTimer, setSustainTimer] = useState(0)
  const [active, setActive] = useState(true)
  const [completed, setCompleted] = useState(false)

  const pressureRef = useRef(pressure)
  const sustainRef = useRef(sustainTimer)
  const activeRef = useRef(active)

  pressureRef.current = pressure
  sustainRef.current = sustainTimer
  activeRef.current = active

  useEffect(() => {
    Sounds.play('alarm')
  }, [])

  useEffect(() => {
    if (!activeRef.current) return
    const decay = setInterval(() => {
      if (!activeRef.current) return
      setPressure(prev => Math.max(0, prev - DECAY))
    }, DECAY_RATE)

    const sustain = setInterval(() => {
      if (!activeRef.current) return
      if (pressureRef.current >= TARGET) {
        setSustainTimer(prev => {
          const next = prev + 100
          if (next >= SUSTAIN_NEEDED) {
            setActive(false)
            setCompleted(true)
            markComplete(3)
            Sounds.play('floor_complete')
            setTimeout(() => navigate('/floor/4'), 2000)
            return SUSTAIN_NEEDED
          }
          return next
        })
      } else {
        setSustainTimer(0)
      }
    }, 100)

    return () => {
      clearInterval(decay)
      clearInterval(sustain)
    }
  }, [navigate])

  useEffect(() => {
    if (!activeRef.current) return
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        applyPressure()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const applyPressure = useCallback(() => {
    if (!activeRef.current) return
    setPressure(prev => Math.min(100, prev + GAIN))
    Sounds.play('brake_press')
  }, [])

  const pct = pressure
  const sustainPct = Math.min(100, (sustainTimer / SUSTAIN_NEEDED) * 100)

  return (
    <Layout floorNumber={3} title="Emergency Brake" subtitle="Mash SPACE">
      <div className="flex-1 flex flex-col bg-[#0a0f16]">
        <div className={`bg-red-900/30 border-b border-red-500/30 py-2 px-4 text-center transition-all ${pressure < 20 ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-red-400 font-mono text-sm font-bold">⚠ CRITICAL FREEFALL DETECTED ⚠</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
          {/* Brake button */}
          <div className="flex flex-col items-center gap-4">
            <button
              onPointerDown={applyPressure}
              className={`w-36 h-36 rounded-full font-bold text-xl uppercase tracking-widest transition-all select-none ${
                completed
                  ? 'bg-green-600 shadow-[0_0_40px_rgba(34,197,94,0.5)] text-white'
                  : 'bg-red-700 hover:bg-red-600 shadow-[0_0_30px_rgba(239,68,68,0.3)] active:scale-95 text-white border-4 border-red-500'
              }`}
            >
              {completed ? '✓' : 'BRAKE'}
            </button>

            <div className="text-center">
              <div className={`text-5xl font-bold font-mono tracking-wider ${
                completed ? 'text-green-400' : pct >= TARGET ? 'text-green-400' : pct > 50 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {Math.round(pct)}%
              </div>
              <div className="text-slate-500 text-xs font-mono mt-1">Hydraulic Pressure</div>
            </div>

            {!completed && (
              <div className="text-slate-400 text-sm font-mono animate-pulse">
                {pct >= TARGET ? 'HOLDING...' : 'MASH SPACE TO BUILD PRESSURE'}
              </div>
            )}
          </div>

          {/* Gauge and sustain */}
          <div className="flex items-center gap-6">
            {/* Gauge bar */}
            <div className="relative w-8 h-40 bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
              <div
                className={`absolute bottom-0 left-0 right-0 transition-all duration-100 ${
                  pct < 30 ? 'bg-red-600' : pct < TARGET ? 'bg-yellow-400' : 'bg-green-500'
                }`}
                style={{ height: `${pct}%` }}
              />
              <div className="absolute bottom-[88%] left-0 right-0 h-0.5 bg-primary/50" />
            </div>

            {/* Sustain bar */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-slate-500">SUSTAIN</span>
              <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div className="h-full bg-green-500 transition-all duration-100" style={{ width: `${sustainPct}%` }} />
              </div>
              <span className="text-[10px] font-mono text-slate-600">{Math.round(sustainPct)}%</span>
            </div>
          </div>

          {completed && (
            <div className="text-green-400 text-xl font-bold font-mono animate-pulse">
              ✓ BRAKES ENGAGED - PROCEEDING...
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
