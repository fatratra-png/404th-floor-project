import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Sounds } from '../audio/sounds'
import { markComplete } from '../lib/gameLogic'

interface Phase {
  id: number
  name: string
  desc: string
  complete: boolean
}

const ALL_PHASES: Phase[] = [
  { id: 1, name: 'DRAIN RESIDUAL POWER', desc: 'Click rapidly to drain remaining voltage', complete: false },
  { id: 2, name: 'ALIGN CORE MODULES', desc: 'Rotate modules to correct orientation', complete: false },
  { id: 3, name: 'OVERRIDE SAFETY LOCKS', desc: 'Enter the override code: 5801', complete: false },
  { id: 4, name: 'INITIALIZE REBOOT', desc: 'Toggle all switches to ON position', complete: false },
]

export default function Floor8() {
  const navigate = useNavigate()
  const [phases, setPhases] = useState<Phase[]>(ALL_PHASES.map(p => ({ ...p })))
  const [currentPhase, setCurrentPhase] = useState(0)
  const [completed, setCompleted] = useState(false)

  // Phase 1: drain power
  const [drainCount, setDrainCount] = useState(0)

  // Phase 2: align modules
  const [modules, setModules] = useState([0, 0, 0, 0])
  const moduleTargets = [2, 0, 1, 3]

  // Phase 3: code
  const [code, setCode] = useState('')
  const CODE = '5801'

  // Phase 4: switches
  const [switches, setSwitches] = useState([false, false, false, false, false])

  const advancePhase = useCallback(() => {
    setPhases(prev => prev.map((p, i) => i === currentPhase ? { ...p, complete: true } : p))
    Sounds.play('core_phase')
    if (currentPhase >= ALL_PHASES.length - 1) {
      setCompleted(true)
      markComplete(8)
      Sounds.play('victory')
      setTimeout(() => navigate('/victory'), 3000)
    } else {
      setCurrentPhase(prev => prev + 1)
    }
  }, [currentPhase, navigate])

  const canProceed = () => {
    switch (currentPhase) {
      case 0: return drainCount >= 20
      case 1: return modules.every((m, i) => m === moduleTargets[i])
      case 2: return code === CODE
      case 3: return switches.every(s => s)
      default: return false
    }
  }

  // Phase 1 auto-drain
  useEffect(() => {
    if (currentPhase === 0 && drainCount < 20) {
      const handler = (e: KeyboardEvent) => {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault()
          setDrainCount(prev => Math.min(20, prev + 1))
          Sounds.play('keyclick')
        }
      }
      window.addEventListener('keydown', handler)
      return () => window.removeEventListener('keydown', handler)
    }
  }, [currentPhase, drainCount])

  return (
    <Layout floorNumber={8} title="Mainframe" subtitle="Core Reboot">
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-[#080b0f] gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">CORE REBOOT SEQUENCE</h1>
          <p className="text-slate-500 font-mono text-sm">
            Complete all {ALL_PHASES.length} phases to restore the elevator
          </p>
        </div>

        {/* Phase indicators */}
        <div className="flex gap-3">
          {phases.map((p, i) => (
            <div key={p.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              p.complete
                ? 'border-green-500 bg-green-500/10 text-green-400'
                : i === currentPhase
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-slate-700 bg-slate-800/50 text-slate-500'
            }`}>
              <span>{p.complete ? '✓' : i === currentPhase ? '►' : `${p.id}`}</span>
              <span className="hidden md:inline">{p.name}</span>
            </div>
          ))}
        </div>

        {/* Active phase content */}
        <div className="w-full max-w-xs md:max-w-lg bg-[#0c1018] border border-[#1a2030] rounded-xl p-4 md:p-6">
          {currentPhase === 0 && (
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-lg font-bold text-white">Phase 1: Drain Residual Power</h3>
              <p className="text-slate-400 text-sm font-mono">Mash SPACE/ENTER to drain {drainCount}/20</p>
              <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div className="h-full bg-yellow-500 transition-all duration-100" style={{ width: `${(drainCount / 20) * 100}%` }} />
              </div>
              <div className="text-3xl font-mono font-bold text-yellow-400">{drainCount}/20</div>
            </div>
          )}

          {currentPhase === 1 && (
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-lg font-bold text-white">Phase 2: Align Core Modules</h3>
              <p className="text-slate-400 text-sm font-mono">Click modules to rotate them to correct position</p>
              <div className="flex gap-4">
                {modules.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setModules(prev => {
                        const next = [...prev]
                        next[i] = (next[i] + 1) % 4
                        return next
                      })
                      Sounds.play('keyclick')
                    }}
                    className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-all ${
                      m === moduleTargets[i]
                        ? 'border-green-500 bg-green-500/10 text-green-400'
                        : 'border-slate-600 bg-slate-800 text-slate-400 hover:border-primary'
                    }`}
                  >
                    {['▲', '▶', '▼', '◄'][m]}
                  </button>
                ))}
              </div>
              <div className="text-xs font-mono text-slate-600">Target: {moduleTargets.map(t => ['▲', '▶', '▼', '◄'][t]).join(' ')}</div>
            </div>
          )}

          {currentPhase === 2 && (
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-lg font-bold text-white">Phase 3: Override Safety Locks</h3>
              <p className="text-slate-400 text-sm font-mono">Enter override code</p>
              <input
                type="text"
                value={code}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                  setCode(val)
                  Sounds.play('keyclick')
                }}
                className="w-40 bg-black/60 border border-slate-700 rounded-lg py-3 px-4 text-center font-mono text-2xl tracking-[0.3em] text-primary placeholder-slate-700 focus:border-primary focus:outline-none"
                placeholder="_ _ _ _"
                maxLength={4}
              />
              <div className="text-[10px] text-slate-600 font-mono">Hint: Check previous floor logs for the code</div>
            </div>
          )}

          {currentPhase === 3 && (
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-lg font-bold text-white">Phase 4: Initialize Reboot</h3>
              <p className="text-slate-400 text-sm font-mono">Toggle ALL switches to ON</p>
              <div className="flex gap-4">
                {switches.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSwitches(prev => {
                        const next = [...prev]
                        next[i] = !next[i]
                        return next
                      })
                      Sounds.play('keyclick')
                    }}
                    className={`w-12 h-20 rounded-lg border-2 transition-all flex items-center justify-center text-lg ${
                      s
                        ? 'border-green-500 bg-green-500/20 text-green-400'
                        : 'border-slate-600 bg-slate-800 text-slate-500 hover:border-primary'
                    }`}
                  >
                    {s ? 'ON' : 'OFF'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Proceed button */}
        <button
          onClick={advancePhase}
          disabled={!canProceed()}
          className="px-8 py-3 bg-primary hover:bg-blue-600 rounded-lg text-white font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {currentPhase < ALL_PHASES.length - 1
            ? `COMPLETE PHASE ${currentPhase + 1}`
            : completed ? '✓ REBOOT COMPLETE' : 'FINALIZE REBOOT'}
        </button>

        {completed && (
          <div className="text-green-400 text-lg font-mono animate-pulse">
            ✓ CORE REBOOT INITIALIZED - ELEVATOR RESTORED
          </div>
        )}
      </div>
    </Layout>
  )
}
