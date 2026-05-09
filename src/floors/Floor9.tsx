import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Sounds } from '../audio/sounds'
import { markComplete } from '../lib/gameLogic'

const ROUNDS_TO_WIN = 5

export default function Floor9() {
  const navigate = useNavigate()
  const [round, setRound] = useState(1)
  const [target, setTarget] = useState(30 + Math.random() * 40)
  const [needle, setNeedle] = useState(0)
  const [sweeping, setSweeping] = useState(true)
  const [locked, setLocked] = useState<number | null>(null)
  const [results, setResults] = useState<boolean[]>([])
  const [phase, setPhase] = useState<'play' | 'success' | 'fail' | 'complete'>('play')
  const [completed, setCompleted] = useState(false)
  const animRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null)
  const directionRef = useRef(1)
  const speedRef = useRef(0.8)

  const startRound = useCallback((r: number) => {
    const t = 20 + Math.random() * 60
    setTarget(t)
    setNeedle(0)
    setLocked(null)
    setPhase('play')
    setSweeping(true)
    speedRef.current = 0.8 + r * 0.25
    directionRef.current = 1
  }, [])

  useEffect(() => {
    startRound(1)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [])

  useEffect(() => {
    if (!sweeping) return
    let pos = needle
    const animate = () => {
      pos += speedRef.current * directionRef.current
      if (pos >= 100) { pos = 100; directionRef.current = -1 }
      if (pos <= 0) { pos = 0; directionRef.current = 1 }
      setNeedle(pos)
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [sweeping, needle])

  const handleLock = useCallback(() => {
    if (phase !== 'play' || !sweeping) return
    setSweeping(false)
    if (animRef.current) cancelAnimationFrame(animRef.current)
    setLocked(needle)
    const diff = Math.abs(needle - target)
    const success = diff <= 8 - round * 0.5
    Sounds.play(success ? 'mem_success' : 'mem_fail')

    if (success) {
      setResults(prev => [...prev, true])
      if (round >= ROUNDS_TO_WIN) {
        setPhase('complete')
        setCompleted(true)
        markComplete(9)
        Sounds.play('victory')
        setTimeout(() => navigate('/floor/10'), 2500)
      } else {
        setPhase('success')
        setTimeout(() => {
          const nextRound = round + 1
          setRound(nextRound)
          startRound(nextRound)
        }, 1500)
      }
    } else {
      setPhase('fail')
      setTimeout(() => {
        setSweeping(true)
        setPhase('play')
        directionRef.current = 1
        setNeedle(0)
      }, 1200)
    }
  }, [phase, sweeping, needle, target, round, navigate])

  return (
    <Layout floorNumber={9} title="Signal Interceptor" subtitle="Frequency Match">
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-[#080b0f] gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">SIGNAL INTERCEPTOR</h1>
          <p className="text-slate-500 font-mono text-sm">
            Lock the needle on the target frequency
          </p>
        </div>

        <div className="flex gap-6 text-sm font-mono">
          <div className="text-slate-500">ROUND <span className="text-primary">{round}</span>/{ROUNDS_TO_WIN}</div>
          <div className="text-slate-500">LOCKS <span className="text-green-400">{results.filter(Boolean).length}</span></div>
        </div>

        {/* Dial */}
        <div className="relative w-56 md:w-72 h-56 md:h-72">
          {/* Dial background */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-700 bg-slate-900/50">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-mono font-bold">
              <span className={locked !== null ? 'text-primary' : 'text-slate-500'}>
                {locked !== null ? `${Math.round(locked)}%` : '--'}
              </span>
            </div>
            {/* Tick marks */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 bg-slate-600"
                style={{
                  height: i % 5 === 0 ? '12px' : '6px',
                  left: '50%',
                  top: '4px',
                  transformOrigin: 'center 50%',
                  transform: `translateX(-50%) rotate(${i * 18}deg)`,
                }}
              />
            ))}
          </div>
          {/* Needle */}
          <div
            className="absolute top-1/2 left-1/2 w-0.5 h-[130px] origin-bottom transition-all duration-75"
            style={{
              transform: `translateX(-50%) rotate(${needle * 3.6 - 90}deg)`,
              backgroundColor: locked !== null
                ? Math.abs(needle - target) <= 8 - round * 0.5 ? '#22c55e' : '#ef4444'
                : '#135bec',
              boxShadow: locked !== null
                ? Math.abs(needle - target) <= 8 - round * 0.5
                  ? '0 0 10px #22c55e'
                  : '0 0 10px #ef4444'
                : '0 0 10px rgba(19,91,236,0.5)',
            }}
          />
          {/* Target marker */}
          <div
            className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-yellow-400 animate-pulse"
            style={{
              top: '50%',
              left: '50%',
              transform: `translateX(-50%) translateY(-50%) rotate(${target * 3.6}deg) translateY(-105px)`,
            }}
          />
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-500" />
        </div>

        {/* Target readout */}
        <div className="text-sm font-mono text-slate-500">
          TARGET: <span className="text-yellow-400">{Math.round(target)}%</span>
          {locked !== null && (
            <span className="ml-4">
              LOCKED: <span className={Math.abs(needle - target) <= 8 - round * 0.5 ? 'text-green-400' : 'text-red-400'}>{Math.round(locked)}%</span>
              <span className="ml-2 text-slate-600">(Δ{Math.round(Math.abs(needle - target))})</span>
            </span>
          )}
        </div>

        {/* Lock button */}
        <button
          onClick={handleLock}
          disabled={phase !== 'play'}
          className="px-8 py-3 bg-primary hover:bg-blue-600 rounded-lg text-white font-bold transition-all disabled:opacity-30 text-lg"
        >
          {phase === 'play' ? '🔒 LOCK SIGNAL' : phase === 'success' ? '✓ LOCKED' : phase === 'fail' ? '✗ RETRY' : '✓ COMPLETE'}
        </button>

        {/* Progress dots */}
        <div className="flex gap-2">
          {Array.from({ length: ROUNDS_TO_WIN }).map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${results[i] ? 'bg-green-500' : i === results.length ? 'bg-primary animate-pulse' : 'bg-slate-700'}`} />
          ))}
        </div>

        {phase === 'complete' && (
          <div className="text-green-400 text-lg font-mono animate-pulse">✓ SIGNAL ACQUIRED</div>
        )}
      </div>
    </Layout>
  )
}
