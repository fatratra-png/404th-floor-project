import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getState, isCompleted, isFloorUnlocked, resetProgress, getCompletedCount } from '../lib/gameLogic'
import { LEVELS } from '../lib/levels'

const FLOORS_1_20 = [
  { num: 1, name: 'Lobby', desc: 'Fuse Panel' },
  { num: 2, name: 'Access Terminal', desc: 'Keypad' },
  { num: 3, name: 'Server Room', desc: 'Emergency Brake' },
  { num: 4, name: 'Executive Suite', desc: 'Debug Terminal' },
  { num: 5, name: 'Memory Core', desc: 'Sequence Lock' },
  { num: 6, name: 'Power Plant', desc: 'Circuit Balance' },
  { num: 7, name: 'Comms Hub', desc: 'Wire Cipher' },
  { num: 8, name: 'Mainframe', desc: 'Core Reboot' },
  { num: 9, name: 'Signal Lab', desc: 'Frequency Match' },
  { num: 10, name: 'Plumbing Core', desc: 'Pipe Network' },
  { num: 11, name: 'Logic Bay', desc: 'Boolean Gates' },
  { num: 12, name: 'Decode Chamber', desc: 'Binary Decoder' },
  { num: 13, name: 'Reactor Core', desc: 'Pattern Matrix' },
  { num: 14, name: 'Thermal Unit', desc: 'Temperature Control' },
  { num: 15, name: 'Vault Room', desc: 'Cipher Lock' },
  { num: 16, name: 'Pulse Lab', desc: 'EM Sequencing' },
  { num: 17, name: 'Life Support', desc: 'Oxygen Balance' },
  { num: 18, name: 'Zero Point', desc: 'Final Ascent' },
  { num: 19, name: 'The Crucible', desc: 'Ultimate Trial' },
  { num: 20, name: 'The Overlord', desc: 'Final Boss' },
]

const floors = [
  ...FLOORS_1_20,
  ...LEVELS.map(l => ({ num: l.id, name: l.name, desc: l.challenge })),
]

export default function ElevatorHub() {
  const navigate = useNavigate()
  const [glitching, setGlitching] = useState(false)
  const state = getState()
  const hasStarted = Object.keys(state).some(k => k.startsWith('floor'))
  const done = getCompletedCount()

  const handleFloorClick = (num: number) => {
    if (isFloorUnlocked(num)) navigate(`/floor/${num}`)
  }

  const handleStart = () => {
    setGlitching(true)
    setTimeout(() => {
      setGlitching(false)
      navigate('/floor/1')
    }, 1200)
  }

  return (
    <div className={`min-h-screen bg-background-dark text-slate-100 font-display overflow-hidden relative ${glitching ? 'glitch-active' : ''}`}>
      {glitching && <GlitchOverlay />}
          
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1a2233_0%,_#0a0e17_70%)]" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-red-500/10 blur-3xl" />
      </div>

      {/* Glass header */}
      <header className="relative z-50 bg-white/[0.04] backdrop-blur-xl border-b border-white/[0.06] px-4 md:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl">elevator</span>
          <div>
            <h1 className="text-white text-base font-bold tracking-tight">ELEVATOR HUB</h1>
            <p className="text-[10px] text-primary/60 font-mono tracking-wider">SYS.VER.4.0.4</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[10px] font-mono text-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            CONNECTION UNSTABLE
          </span>
          <button
            onClick={() => { resetProgress(); window.location.reload() }}
            className="bg-white/[0.06] hover:bg-white/[0.12] transition-colors p-1.5 rounded-lg text-white/60"
            title="Reset Progress"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="relative h-[calc(100vh-3.5rem)] flex flex-col md:flex-row">
        {/* Left - Viewport */}
        <section className="relative flex-1 flex flex-col items-center justify-center p-4 md:p-8">
          {/* Glass terminal badge */}
          <div className="absolute top-6 left-6 w-56 bg-white/[0.03] backdrop-blur-lg rounded-xl border border-white/[0.06] overflow-hidden hidden md:block">
            <div className="bg-white/[0.03] px-2.5 py-1 flex items-center justify-between border-b border-white/[0.06]">
              <span className="text-[9px] text-white/40 font-mono">TERM_01</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
              </div>
            </div>
            <div className="p-3 h-24 bg-black/40 font-mono text-[10px]">
              <div className="text-red-500">&gt; SYSTEM_ERROR</div>
              <div className="text-primary">&gt; DOM_INTERRUPTION</div>
              <div className="text-white/40">&gt; Rerouting power...</div>
              <div className="text-white/40 animate-pulse">&gt; Awaiting manual override_</div>
            </div>
          </div>

          {/* 404 Display */}
          <div className="relative flex flex-col items-center gap-6">
            <div className="text-primary/40 text-xs font-mono tracking-[0.4em] uppercase">Current Floor</div>
            <h1
              className="text-[100px] md:text-[180px] leading-none font-black text-primary/80 glitch-text tracking-tighter drop-shadow-[0_0_15px_rgba(19,91,236,0.3)]"
              data-text="404"
            >
              404
            </h1>

            {!hasStarted ? (
              <button
                onClick={handleStart}
                disabled={glitching}
                className="group relative px-10 py-3 bg-primary/20 backdrop-blur-lg hover:bg-primary/30 border border-primary/30 rounded-xl font-bold text-white text-lg tracking-widest transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(19,91,236,0.2)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl">play_arrow</span>
                  START
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-1.5 bg-red-500/10 backdrop-blur-lg border border-red-500/20 rounded-xl text-red-400 font-mono text-xs">
                <span className="material-symbols-outlined text-sm animate-pulse">warning</span>
                ELEVATOR STUCK BETWEEN NODES
              </div>
            )}
          </div>

          {/* Intercom */}
          <div className="absolute bottom-6 left-6 flex flex-col gap-1.5">
            <span className="text-[9px] uppercase text-white/30 font-bold tracking-widest">Intercom</span>
            <div className="w-12 h-12 rounded-full bg-white/[0.04] backdrop-blur-lg border border-white/[0.06] flex items-center justify-center">
              <span className="material-symbols-outlined text-white/40 text-lg">mic_off</span>
            </div>
          </div>
        </section>

        {/* Right - Glass Floor Panel */}
        <aside className="w-full md:w-72 h-auto md:h-full bg-white/[0.02] backdrop-blur-xl border-l border-white/[0.06] flex flex-col">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <h2 className="text-white text-sm font-bold tracking-tight">FLOORS</h2>
              <span className="text-[10px] font-mono text-primary/50">{done}/{floors.length}</span>
            </div>
            <div className="mt-2 h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full bg-primary/60 rounded-full transition-all" style={{ width: `${(done / floors.length) * 100}%` }} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
            {floors.map(f => {
              const completed = isCompleted(f.num)
              const unlocked = isFloorUnlocked(f.num)
              const active = !hasStarted && f.num === 1
              return (
                <button
                  key={f.num}
                  onClick={() => handleFloorClick(f.num)}
                  disabled={!unlocked}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                    completed ? 'bg-green-500/10 text-green-400' :
                    unlocked ? 'bg-white/[0.04] hover:bg-white/[0.08] text-primary cursor-pointer' :
                    'text-white/20 cursor-not-allowed'
                  } ${active ? 'ring-1 ring-primary/30 animate-pulse' : ''}`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                    completed ? 'bg-green-500/20 text-green-400' :
                    unlocked ? 'bg-primary/20 text-primary' :
                    'bg-white/[0.04] text-white/20'
                  }`}>
                    {completed ? '✓' : f.num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-bold truncate ${
                      completed ? 'text-green-400' : unlocked ? 'text-white/80' : 'text-white/20'
                    }`}>
                      {f.name}
                    </div>
                    <div className={`text-[10px] font-mono truncate ${
                      completed ? 'text-green-400/50' : unlocked ? 'text-white/40' : 'text-white/15'
                    }`}>
                      {completed ? 'COMPLETED' : unlocked ? f.desc : 'LOCKED'}
                    </div>
                  </div>
                  <span className={`material-symbols-outlined text-sm ${
                    completed ? 'text-green-400' : unlocked ? 'text-primary/30' : 'text-white/10'
                  }`}>
                    {completed ? 'check_circle' : unlocked ? 'lock_open' : 'lock'}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="px-5 py-3 border-t border-white/[0.06]">
            <button
              onClick={() => navigate('/')}
              className="w-full py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white/40 hover:text-white/70 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Return to Hub
            </button>
          </div>
        </aside>
      </main>

      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.85)] z-40" />
    </div>
  )
}

function GlitchOverlay() {
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div className="absolute inset-0 bg-white/10 animate-[glitchFlash_0.1s_ease-in-out_3]" />
      <div className="absolute inset-0 bg-primary/20 mix-blend-overlay animate-[glitchShift_0.05s_ease-in-out_8]" />
      <div className="absolute inset-0 bg-[#ff0055]/10 mix-blend-screen animate-[glitchShift_0.04s_ease-in-out_6]" style={{ clipPath: 'inset(20% 0 60% 0)' }} />
      <div className="absolute inset-0 bg-[#00ffcc]/10 mix-blend-screen animate-[glitchShift_0.06s_ease-in-out_5] delay-75" style={{ clipPath: 'inset(60% 0 15% 0)' }} />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.3)_2px,rgba(0,0,0,0.3)_4px)]" />
      <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22%3E%3C/rect%3E%3C/svg%3E")', backgroundSize: '150px 150px' }} />
      <style>{`
        @keyframes glitchFlash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        @keyframes glitchShift {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px) skewX(2deg); }
          75% { transform: translateX(3px) skewX(-1deg); }
        }
        .glitch-active { animation: glitchShake 0.1s ease-in-out 8; }
        @keyframes glitchShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px) rotate(-0.5deg); }
          75% { transform: translateX(2px) rotate(0.5deg); }
        }
      `}</style>
    </div>
  )
}
