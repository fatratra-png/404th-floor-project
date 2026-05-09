import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Sounds } from '../audio/sounds'
import { markComplete } from '../lib/gameLogic'

const TOTAL_PHASES = 3

export default function Floor18() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState(0)
  const [completed, setCompleted] = useState(false)

  // Phase 1: Memory
  const [memPattern, setMemPattern] = useState<number[]>([])
  const [memInput, setMemInput] = useState<number[]>([])
  const [memActive, setMemActive] = useState<number | null>(null)
  const [memShow, setMemShow] = useState(true)

  // Phase 2: Precision
  const [target, setTarget] = useState(50)
  const [needle, setNeedle] = useState(0)
  const [locked, setLocked] = useState<number | null>(null)
  const [sweeping, setSweeping] = useState(false)
  const directionRef = useRef(1)
  const animRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(null)

  // Phase 3: Rapid click
  const [clicks, setClicks] = useState(0)
  const [clickPhase, setClickPhase] = useState<'ready' | 'go'>('ready')

  const startMemory = useCallback(() => {
    const seq = Array.from({ length: 6 }, () => Math.floor(Math.random() * 9))
    setMemPattern(seq)
    setMemInput([])
    setMemShow(true)

    seq.forEach((cell, i) => {
      setTimeout(() => {
        setMemActive(cell)
        setTimeout(() => setMemActive(null), 300)
      }, (i + 1) * 500)
    })

    setTimeout(() => {
      setMemShow(false)
    }, (seq.length + 1) * 500)
  }, [])

  useEffect(() => {
    startMemory()
  }, [])

  const handleMemClick = useCallback((idx: number) => {
    if (memShow) return
    const next = [...memInput, idx]
    setMemInput(next)
    setMemActive(idx)
    setTimeout(() => setMemActive(null), 150)

    if (idx !== memPattern[memInput.length]) {
      Sounds.play('mem_fail')
      setMemInput([])
      return
    }
    Sounds.play('keyclick')

    if (next.length === memPattern.length) {
      Sounds.play('mem_success')
      setTimeout(() => {
        setPhase(1)
        setTarget(30 + Math.random() * 40)
        setSweeping(true)
      }, 1000)
    }
  }, [memShow, memInput, memPattern])

  useEffect(() => {
    if (!sweeping) return
    const animate = () => {
      setNeedle(prev => {
        const next = prev + 1.2 * directionRef.current
        if (next >= 100) { directionRef.current = -1; return 100 }
        if (next <= 0) { directionRef.current = 1; return 0 }
        return next
      })
      animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [sweeping])

  const handleLock = useCallback(() => {
    if (!sweeping) return
    setSweeping(false)
    if (animRef.current) cancelAnimationFrame(animRef.current)
    setLocked(needle)
    const diff = Math.abs(needle - target)
    if (diff <= 4) {
      Sounds.play('mem_success')
      setTimeout(() => {
        setPhase(2)
        setClickPhase('ready')
        setTimeout(() => setClickPhase('go'), 1000 + Math.random() * 2000)
      }, 1000)
    } else {
      Sounds.play('mem_fail')
      setTimeout(() => {
        setLocked(null)
        setSweeping(true)
      }, 1000)
    }
  }, [sweeping, needle, target])

  useEffect(() => {
    if (clickPhase !== 'go') return
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        setClicks(prev => prev + 1)
        Sounds.play('keyclick')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [clickPhase])

  useEffect(() => {
    if (clicks >= 25) {
      setCompleted(true)
      markComplete(18)
      Sounds.play('victory')
      setTimeout(() => navigate('/victory'), 3000)
    }
  }, [clicks, navigate])

  return (
    <Layout floorNumber={18} title="Zero Point" subtitle="The Final Ascent" showPanel={false}>
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#080b0f] gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white glitch-text" data-text="ZERO POINT">ZERO POINT</h1>
          <p className="text-slate-500 font-mono text-sm">
            Complete all {TOTAL_PHASES} phases to restore the elevator
          </p>
        </div>

        {/* Phase indicators */}
        <div className="flex gap-3">
          {['MEMORY', 'PRECISION', 'POWER'].map((name, i) => (
            <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              i < phase ? 'border-green-500 bg-green-500/10 text-green-400' :
              i === phase ? 'border-primary bg-primary/10 text-primary animate-pulse' :
              'border-slate-700 bg-slate-800/50 text-slate-500'
            }`}>
              <span>{i < phase ? '✓' : i === phase ? '►' : `${i + 1}`}</span>
              <span>{name}</span>
            </div>
          ))}
        </div>

        {/* Phase 0: Memory */}
        {phase === 0 && (
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-bold text-white">Phase 1: Memory Recall</h3>
            <p className="text-slate-400 text-sm font-mono">
              {memShow ? 'Watch the pattern...' : 'Repeat the pattern'}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleMemClick(idx)}
                  className={`w-14 h-14 rounded-lg border-2 transition-all ${
                    memActive === idx
                      ? 'border-primary bg-primary/30 scale-110'
                      : memInput.includes(idx)
                        ? 'border-green-500 bg-green-500/10'
                        : memShow
                          ? 'border-slate-700 bg-slate-900/30'
                          : 'border-slate-600 bg-slate-900 hover:border-primary cursor-pointer'
                  }`}
                >
                  <span className="text-lg">{['★','▲','♦','●','■','♣','◆','▼','♥'][idx]}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {memPattern.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i < memInput.length ? 'bg-primary' : 'bg-slate-700'}`} />
              ))}
            </div>
          </div>
        )}

        {/* Phase 1: Precision */}
        {phase === 1 && (
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-bold text-white">Phase 2: Precision Lock</h3>
            <p className="text-slate-400 text-sm font-mono">Lock the needle on target</p>
            <div className="relative w-56 h-56">
              <div className="absolute inset-0 rounded-full border-4 border-slate-700 bg-slate-900/50">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-mono">
                  <span className={locked !== null ? 'text-primary' : 'text-slate-500'}>
                    {locked !== null ? `${Math.round(locked)}%` : '--'}
                  </span>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 w-0.5 h-[100px] origin-bottom transition-all duration-75"
                style={{
                  transform: `translateX(-50%) rotate(${needle * 3.6 - 90}deg)`,
                  backgroundColor: locked !== null ? (Math.abs(needle - target) <= 4 ? '#22c55e' : '#ef4444') : '#135bec',
                }}
              />
              <div className="absolute w-3 h-3 rounded-full border-2 border-yellow-400 animate-pulse"
                style={{
                  top: '50%', left: '50%',
                  transform: `translateX(-50%) translateY(-50%) rotate(${target * 3.6}deg) translateY(-80px)`,
                }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-700 border-2 border-slate-500" />
            </div>
            <div className="text-sm font-mono text-slate-500">
              TARGET: <span className="text-yellow-400">{Math.round(target)}%</span>
            </div>
            <button
              onClick={handleLock}
              disabled={!sweeping || locked !== null}
              className="px-6 py-2 bg-primary hover:bg-blue-600 rounded-lg text-white font-bold transition-all disabled:opacity-30"
            >
              LOCK
            </button>
          </div>
        )}

        {/* Phase 2: Power */}
        {phase === 2 && (
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-bold text-white">Phase 3: Power Surge</h3>
            <p className="text-slate-400 text-sm font-mono">
              {clickPhase === 'ready' ? 'Get ready...' : 'MASH SPACE to charge!'}
            </p>
            <div className="relative w-48 h-48 rounded-full border-4 border-slate-700 bg-slate-900/50 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-mono font-bold text-primary">{clicks}</div>
                <div className="text-xs text-slate-500 font-mono">/ 25</div>
              </div>
            </div>
            <div className="w-full max-w-xs h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-primary transition-all duration-100"
                style={{ width: `${(clicks / 25) * 100}%` }}
              />
            </div>
            {clickPhase === 'go' && (
              <div className="text-primary text-lg font-mono animate-pulse">⚡ SPACE SPACE SPACE ⚡</div>
            )}
          </div>
        )}

        {completed && (
          <div className="text-green-400 text-xl font-mono animate-pulse">✓ ELEVATOR FULLY RESTORED</div>
        )}
      </div>
    </Layout>
  )
}
