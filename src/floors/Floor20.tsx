import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Sounds } from '../audio/sounds'
import { markComplete } from '../lib/gameLogic'
import TechChallenge from '../components/TechChallenge'

const BOSS_MAX_HP = 100
const ERRORS = [
  { code: 'ERR_NULL', fix: 'init' },
  { code: 'ERR_TYPE', fix: 'cast' },
  { code: 'ERR_REF', fix: 'check' },
  { code: 'ERR_SYN', fix: 'parse' },
  { code: 'ERR_MEM', fix: 'alloc' },
]

const FIREWALL_SYMBOLS = ['⬡', '⬢', '⬠', '◆', '◇']

export default function Floor20() {
  const navigate = useNavigate()
  const [showChallenge, setShowChallenge] = useState(false)
  const [bossHp, setBossHp] = useState(BOSS_MAX_HP)
  const [phase, setPhase] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [bossAttacking, setBossAttacking] = useState(false)
  const [flash, setFlash] = useState<'hit' | 'miss' | null>(null)
  const [bossAnim, setBossAnim] = useState('idle')

  // Phase 1 - Debug attacks
  const [currentError, setCurrentError] = useState<{ code: string; fix: string } | null>(null)
  const [debugInput, setDebugInput] = useState('')
  const [debugStreak, setDebugStreak] = useState(0)

  // Phase 2 - Firewall
  const [fwPattern, setFwPattern] = useState<string[]>([])
  const [fwInput, setFwInput] = useState<string[]>([])
  const [fwRound, setFwRound] = useState(0)
  const [fwShow, setFwShow] = useState(false)

  // Phase 3 - Final barrage
  const [barrageType, setBarrageType] = useState<'debug' | 'mash' | 'react'>('debug')
  const [mashCount, setMashCount] = useState(0)
  const [mashTarget, setMashTarget] = useState(0)
  const [reactDir, setReactDir] = useState<'left' | 'right' | null>(null)
  const [barrageRound, setBarrageRound] = useState(0)

  const spawnError = useCallback(() => {
    const err = ERRORS[Math.floor(Math.random() * ERRORS.length)]
    setCurrentError(err)
    setDebugInput('')
    setBossAttacking(true)
  }, [])

  const handleDebugSubmit = useCallback(() => {
    if (!currentError) return
    if (debugInput.trim().toLowerCase() === currentError.fix) {
      Sounds.play('keyclick')
      setBossHp(prev => Math.max(0, prev - 8))
      setFlash('hit')
      setDebugStreak(prev => prev + 1)
      setCurrentError(null)
      setBossAttacking(false)
      setBossAnim('hit')
      setTimeout(() => setBossAnim('idle'), 400)
      setTimeout(() => setFlash(null), 300)
    } else {
      Sounds.play('mem_fail')
      setFlash('miss')
      setDebugStreak(0)
      setDebugInput('')
      setTimeout(() => setFlash(null), 300)
    }
  }, [currentError, debugInput])

  useEffect(() => {
    if (phase !== 0) return
    spawnError()
    const interval = setInterval(() => {
      if (!currentError && bossHp > 40) spawnError()
    }, 3000)
    return () => clearInterval(interval)
  }, [phase, spawnError, currentError, bossHp])

  useEffect(() => {
    if (bossHp <= 60 && bossHp > 30 && phase === 0) {
      setPhase(1)
      setDebugStreak(0)
    }
  }, [bossHp, phase])

  // Phase 2 - Firewall
  const generateFirewall = useCallback(() => {
    const len = 4 + fwRound
    const pattern = Array.from({ length: len }, () =>
      FIREWALL_SYMBOLS[Math.floor(Math.random() * FIREWALL_SYMBOLS.length)]
    )
    setFwPattern(pattern)
    setFwInput([])
    setFwShow(true)
    setBossAttacking(true)
    setBossAnim('attack')
    pattern.forEach((sym, i) => {
      setTimeout(() => {
        setFwActive(i)
        setTimeout(() => setFwActive(null), 250)
      }, (i + 1) * 400)
    })
    setTimeout(() => {
      setFwShow(false)
    }, (pattern.length + 1) * 400 + 200)
  }, [fwRound])

  const [fwActive, setFwActive] = useState<number | null>(null)

  useEffect(() => {
    if (phase !== 1) return
    generateFirewall()
  }, [phase, generateFirewall])

  const handleFirewallClick = useCallback((sym: string) => {
    if (fwShow) return
    const next = [...fwInput, sym]
    setFwInput(next)
    if (sym !== fwPattern[fwInput.length]) {
      Sounds.play('mem_fail')
      setFwInput([])
      return
    }
    Sounds.play('keyclick')
    if (next.length === fwPattern.length) {
      Sounds.play('mem_success')
      setBossHp(prev => Math.max(0, prev - 6))
      setFlash('hit')
      setBossAnim('hit')
      setTimeout(() => setBossAnim('idle'), 400)
      setTimeout(() => setFlash(null), 300)
      setFwRound(prev => prev + 1)
      setTimeout(generateFirewall, 1200)
    }
  }, [fwShow, fwInput, fwPattern, generateFirewall])

  useEffect(() => {
    if (bossHp <= 30 && phase === 1) {
      setPhase(2)
      setBarrageRound(0)
    }
  }, [bossHp, phase])

  // Phase 3 - Barrage
  const startBarrage = useCallback(() => {
    const types: ('debug' | 'mash' | 'react')[] = ['debug', 'mash', 'react']
    setBarrageType(types[barrageRound % 3])
    setBarrageRound(prev => prev + 1)
    setBossAttacking(true)
    setBossAnim('attack')

    if (types[barrageRound % 3] === 'debug') {
      spawnError()
    } else if (types[barrageRound % 3] === 'mash') {
      setMashCount(0)
      setMashTarget(5 + Math.floor(Math.random() * 5))
    } else if (types[barrageRound % 3] === 'react') {
      setReactDir(Math.random() > 0.5 ? 'left' : 'right')
    }
  }, [barrageRound, spawnError])

  useEffect(() => {
    if (phase !== 2) return
    startBarrage()
  }, [phase, startBarrage])

  useEffect(() => {
    if (phase !== 2 || barrageType !== 'mash') return
    if (mashCount >= mashTarget) {
      Sounds.play('mem_success')
      setBossHp(prev => Math.max(0, prev - 8))
      setFlash('hit')
      setBossAnim('hit')
      setTimeout(() => setBossAnim('idle'), 400)
      setTimeout(() => setFlash(null), 300)
      setTimeout(startBarrage, 1000)
    }
  }, [mashCount, mashTarget, phase, barrageType, startBarrage])

  useEffect(() => {
    if (phase !== 2 || barrageType !== 'mash') return
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        setMashCount(prev => prev + 1)
        Sounds.play('keyclick')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase, barrageType])

  useEffect(() => {
    if (phase !== 2 || barrageType !== 'react') return
    if (!reactDir) return
    const handler = (e: KeyboardEvent) => {
      const dir = reactDir
      setReactDir(null)
      setBossAttacking(false)
      if (
        (dir === 'left' && e.code === 'ArrowLeft') ||
        (dir === 'right' && e.code === 'ArrowRight')
      ) {
        Sounds.play('keyclick')
        setBossHp(prev => Math.max(0, prev - 6))
        setFlash('hit')
        setBossAnim('hit')
        setTimeout(() => setBossAnim('idle'), 400)
        setTimeout(() => setFlash(null), 300)
        setTimeout(startBarrage, 1000)
      } else {
        Sounds.play('mem_fail')
        setFlash('miss')
        setTimeout(() => setFlash(null), 300)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase, barrageType, reactDir, startBarrage])

  useEffect(() => {
    if (bossHp <= 0) {
      setCompleted(true)
      Sounds.play('victory')
      setShowChallenge(true)
    }
  }, [bossHp, navigate])

  const hpPercent = Math.max(0, bossHp / BOSS_MAX_HP * 100)

  return (
    <Layout floorNumber={20} title="BOSS: THE OVERLORD" subtitle="Final Confrontation">
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 gap-6 relative overflow-hidden">
        {/* Atmosphere */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-red-500/5 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        </div>

        {/* Flash overlay */}
        {flash && (
          <div className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-150 ${
            flash === 'hit' ? 'bg-red-500/20' : 'bg-yellow-500/10'
          }`} />
        )}

        <div className="w-full max-w-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 md:p-8 shadow-lg flex flex-col items-center gap-6">
        {!completed ? (
          <>
            {/* Boss HP */}
            <div className="relative z-10 w-full max-w-lg">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-red-400 text-lg font-bold glitch-text" data-text="THE OVERLORD">
                    THE OVERLORD
                  </span>
                  <div className="flex gap-0.5">
                    {[0, 1, 2].map(i => (
                      <div key={i} className={`w-2 h-2 rounded-full ${
                        phase >= i ? 'bg-red-500' : 'bg-slate-700'
                      }`} />
                    ))}
                  </div>
                </div>
                <span className="text-red-400 font-mono text-sm font-bold">{Math.ceil(bossHp)} HP</span>
              </div>
              <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-red-900/50">
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400 transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-600 mt-1">
                <span>INTEGRITY</span>
                <span>CORRUPTION: {Math.floor((1 - hpPercent / 100) * 100)}%</span>
              </div>
            </div>

            {/* Boss Visual */}
            <div className={`relative z-10 flex flex-col items-center gap-2 transition-all duration-200 ${
              bossAnim === 'hit' ? 'scale-95 opacity-80' : ''
            }`}>
              <div className={`text-8xl transition-all duration-300 ${
                bossAnim === 'attack' ? 'animate-ping' : 'animate-pulse'
              }`}>
                {phase === 2 ? '💀' : '👹'}
              </div>
              <div className="text-xs font-mono text-red-500/50">
                {phase === 0 ? 'CORRUPTED SYSTEM' : phase === 1 ? 'FIREWALL ACTIVE' : 'DESPERATION MODE'}
              </div>
            </div>

            {/* Phase 1: Debug */}
            {phase === 0 && (
              <div className="relative z-10 flex flex-col items-center gap-3">
                <p className="text-slate-400 text-sm font-mono">Type the fix command to patch errors</p>
                {currentError && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center">
                    <div className="text-red-400 font-mono text-lg font-bold mb-2">{currentError.code}</div>
                    <div className="text-slate-500 text-xs font-mono mb-3">Fix this error:</div>
                    <div className="flex gap-2">
                      <span className="text-slate-600 font-mono text-sm">&gt;</span>
                      <input
                        type="text"
                        value={debugInput}
                        onChange={e => setDebugInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleDebugSubmit() }}
                        className="w-28 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center font-mono text-sm text-green-400 focus:border-primary outline-none"
                        placeholder="fix..."
                        autoFocus
                      />
                    </div>
                  </div>
                )}
                <div className="text-xs font-mono text-slate-500">
                  STREAK: <span className="text-green-400">{debugStreak}</span>
                </div>
              </div>
            )}

            {/* Phase 2: Firewall */}
            {phase === 1 && (
              <div className="relative z-10 flex flex-col items-center gap-3">
                <p className="text-slate-400 text-sm font-mono">
                  {fwShow ? 'Watch the firewall sequence...' : 'Repeat the firewall pattern'}
                </p>
                <div className="flex gap-2">
                  {fwPattern.map((sym, i) => (
                    <div key={i} className={`w-10 h-10 flex items-center justify-center rounded-lg border text-lg transition-all ${
                      fwActive === i
                        ? 'border-red-500 bg-red-500/20 scale-110'
                        : i < fwInput.length
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-slate-700 bg-slate-900/50'
                    }`}>
                      {sym}
                    </div>
                  ))}
                </div>
                {!fwShow && (
                  <div className="flex gap-2">
                    {FIREWALL_SYMBOLS.map(sym => (
                      <button
                        key={sym}
                        onClick={() => handleFirewallClick(sym)}
                        className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900 hover:border-primary text-lg cursor-pointer transition-all"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                )}
                <div className="text-xs font-mono text-slate-500">ROUND {fwRound + 1}</div>
              </div>
            )}

            {/* Phase 3: Barrage */}
            {phase === 2 && (
              <div className="relative z-10 flex flex-col items-center gap-3">
                <p className="text-red-400 text-sm font-mono animate-pulse">DESPERATION MODE ENGAGED</p>
                {barrageType === 'debug' && currentError && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center">
                    <div className="text-red-400 font-mono text-lg font-bold mb-2">{currentError.code}</div>
                    <div className="flex gap-2">
                      <span className="text-slate-600 font-mono text-sm">&gt;</span>
                      <input
                        type="text"
                        value={debugInput}
                        onChange={e => setDebugInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleDebugSubmit() }}
                        className="w-28 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center font-mono text-sm text-green-400 focus:border-primary outline-none"
                        placeholder="fix..."
                        autoFocus
                      />
                    </div>
                  </div>
                )}
                {barrageType === 'mash' && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-slate-400 text-sm font-mono">MASH SPACE!</div>
                    <div className="text-4xl font-mono font-bold text-primary">{mashCount}</div>
                    <div className="text-xs font-mono text-slate-500">/ {mashTarget}</div>
                  </div>
                )}
                {barrageType === 'react' && reactDir && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-slate-400 text-sm font-mono">DODGE!</div>
                    <div className={`text-3xl font-bold animate-pulse ${
                      reactDir === 'left' ? 'text-blue-400' : 'text-orange-400'
                    }`}>
                      {reactDir === 'left' ? '←' : '→'}
                    </div>
                    <div className="text-xs font-mono text-slate-500">
                      Press <span className="text-primary">Arrow{reactDir === 'left' ? 'Left' : 'Right'}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : !showChallenge ? (
          <div className="relative z-10 flex flex-col items-center gap-4 animate-pulse">
            <div className="text-6xl">🏆</div>
            <div className="text-green-400 text-2xl font-mono font-bold">THE OVERLORD DEFEATED</div>
            <div className="text-slate-500 text-sm font-mono">SYSTEM RESTORED - ACCESSING ROOF...</div>
          </div>
        ) : null}
        </div>
      </div>
      {showChallenge && <TechChallenge floor={20} onComplete={() => { markComplete(20); navigate('/victory') }} />}
    </Layout>
  )
}
