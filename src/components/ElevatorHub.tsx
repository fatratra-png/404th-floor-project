import { useNavigate } from 'react-router-dom'
import { isCompleted, isFloorUnlocked, resetProgress } from '../lib/gameLogic'

const floors = [
  { num: 1, name: 'Lobby', desc: 'Fuse Panel', icon: 'bolt' },
  { num: 2, name: 'Access Terminal', desc: 'Keypad', icon: 'terminal' },
  { num: 3, name: 'Server Room', desc: 'Emergency Brake', icon: 'emergency' },
  { num: 4, name: 'Executive Suite', desc: 'Debug Terminal', icon: 'bug_report' },
  { num: 5, name: 'Memory Core', desc: 'Sequence Lock', icon: 'psychology' },
  { num: 6, name: 'Power Plant', desc: 'Circuit Balance', icon: 'power' },
  { num: 7, name: 'Comms Hub', desc: 'Wire Cipher', icon: 'router' },
  { num: 8, name: 'Mainframe', desc: 'Core Reboot', icon: 'settings' },
  { num: 9, name: 'Signal Lab', desc: 'Frequency Match', icon: 'radio' },
  { num: 10, name: 'Plumbing Core', desc: 'Pipe Network', icon: 'plumbing' },
  { num: 11, name: 'Logic Bay', desc: 'Boolean Gates', icon: 'memory' },
  { num: 12, name: 'Decode Chamber', desc: 'Binary Decoder', icon: 'terminal' },
  { num: 13, name: 'Reactor Core', desc: 'Pattern Matrix', icon: 'nuclear' },
  { num: 14, name: 'Thermal Unit', desc: 'Temperature Control', icon: 'thermostat' },
  { num: 15, name: 'Vault Room', desc: 'Cipher Lock', icon: 'lock' },
  { num: 16, name: 'Pulse Lab', desc: 'EM Sequencing', icon: 'electric' },
  { num: 17, name: 'Life Support', desc: 'Oxygen Balance', icon: 'air' },
  { num: 18, name: 'Zero Point', desc: 'Final Ascent', icon: 'rocket' },
]

export default function ElevatorHub() {
  const navigate = useNavigate()

  const handleFloorClick = (num: number) => {
    if (isFloorUnlocked(num)) {
      navigate(`/floor/${num}`)
    }
  }

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-display overflow-hidden relative">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden">
        <div className="absolute top-20 left-10 text-6xl font-black text-slate-500 rotate-90 font-mono">.overflow-hidden</div>
        <div className="absolute bottom-20 right-20 text-4xl font-black text-slate-500 -rotate-12 font-mono">z-index: 9999</div>
        <div className="absolute top-1/3 left-1/4 w-full h-px bg-slate-700/30 -rotate-45" />
        <div className="absolute bottom-1/4 right-1/4 w-px h-full bg-slate-700/30 rotate-12" />
        <div className="absolute inset-0 bg-brushed-metal opacity-30 bg-[length:20px_20px]" />
      </div>

      {/* Header */}
      <header className="relative z-50 bg-[#111722]/90 backdrop-blur-md border-b border-[#232f48] px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">elevator</span>
          <div>
            <h1 className="text-white text-lg font-bold tracking-tight">ELEVATOR HUB</h1>
            <p className="text-xs text-primary font-mono tracking-wider opacity-80">SYS.VER.4.0.4</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:flex items-center gap-1 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> CONNECTION UNSTABLE
          </span>
          <button
            onClick={() => { resetProgress(); window.location.reload() }}
            className="bg-[#232f48] hover:bg-[#2c3b59] transition-colors p-2 rounded-lg text-white"
            title="Reset Progress"
          >
            <span className="material-symbols-outlined text-xl">refresh</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="relative h-screen pt-16 flex flex-col md:flex-row">
        {/* Left - Viewport */}
        <div className="relative flex-1 bg-metal-dark flex flex-col items-center justify-center p-8 border-r border-[#232f48] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
          {/* CRT Terminal */}
          <div className="absolute top-8 left-8 w-64 bg-[#0a0a0a] rounded-xl border-4 border-[#1a1f2e] shadow-lg overflow-hidden -rotate-2 hidden md:block">
            <div className="bg-[#1a1f2e] px-3 py-1 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">TERM_01</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
              </div>
            </div>
            <div className="relative p-4 h-28 bg-[#050505] font-mono text-xs shadow-crt">
              <div className="absolute inset-0 bg-scanlines opacity-20 pointer-events-none" />
              <div className="text-red-500 mb-1">&gt; SYSTEM ERROR detected</div>
              <div className="text-primary mb-1">&gt; DOM_INTERRUPTION</div>
              <div className="text-slate-400 mb-1">&gt; Rerouting power...</div>
              <div className="text-slate-400 animate-pulse">&gt; Waiting for manual override_</div>
            </div>
          </div>

          {/* Central Floor Display */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-primary/60 text-sm font-mono tracking-[0.5em] mb-4 uppercase">Current Floor</div>
            <div className="relative">
              <h1
                className="text-[120px] md:text-[200px] leading-none font-black text-primary glitch-text tracking-tighter drop-shadow-[0_0_15px_rgba(19,91,236,0.6)]"
                data-text="404"
              >
                404
              </h1>
              <div className="absolute top-0 right-10 w-2 h-2 bg-white rounded-full animate-ping opacity-75" />
            </div>
            <div className="mt-8 px-6 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 font-mono text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base animate-pulse">warning</span>
              <span>ELEVATOR STUCK BETWEEN NODES</span>
            </div>
          </div>

          {/* Intercom */}
          <div className="absolute bottom-8 left-8 flex flex-col gap-2">
            <label className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Intercom</label>
            <button className="group relative w-20 h-20 rounded-full bg-[#1a1f2e] border-2 border-[#232f48] shadow-button-normal active:shadow-button-pressed flex items-center justify-center transition-all">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_transparent_30%,_#000000_120%)] opacity-50" />
              <div className="w-12 h-12 rounded-full bg-[radial-gradient(#232f48_1.5px,transparent_1.5px)] [background-size:6px_6px] opacity-50" />
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-2xl z-10">mic_off</span>
            </button>
          </div>
        </div>

        {/* Right - Floor Selection */}
        <aside className="w-full md:w-80 h-auto md:h-full bg-panel-dark border-l border-[#232f48] shadow-2xl z-20 flex flex-col relative">
          <div className="absolute inset-0 bg-brushed-metal opacity-50 pointer-events-none" />
          <div className="p-6 border-b border-[#232f48] bg-[#151a25]/50 backdrop-blur relative">
            <h2 className="text-white text-xl font-bold tracking-tight">FLOOR SELECT</h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-1.5 flex-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[35%] animate-pulse" />
              </div>
              <span className="text-xs text-primary/70 font-mono">SYS: 35%</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 items-center justify-center relative">
            {floors.map(f => {
              const unlocked = isFloorUnlocked(f.num)
              const completed = isCompleted(f.num)
              return (
                <div key={f.num} className="w-full flex items-center justify-between gap-4 group">
                  <div className="text-right flex-1">
                    <div className={`text-sm font-bold ${completed ? 'text-green-500' : unlocked ? 'text-primary' : 'text-slate-500'}`}>
                      {f.name}
                    </div>
                    <div className={`text-xs font-mono ${completed ? 'text-green-500/70' : unlocked ? 'text-primary/70' : 'text-slate-600'}`}>
                      {completed ? 'COMPLETED' : unlocked ? f.desc : 'LOCKED'}
                    </div>
                  </div>
                  <button
                    onClick={() => handleFloorClick(f.num)}
                    className={`w-16 h-16 rounded-lg flex items-center justify-center transition-all ${
                      completed
                        ? 'bg-green-600 border border-green-600 shadow-neon-strong'
                        : unlocked
                          ? 'bg-primary border border-primary shadow-neon cursor-pointer hover:scale-105'
                          : 'bg-[#151a25] border border-[#232f48] opacity-60'
                    }`}
                  >
                    <span className={`text-2xl font-bold font-mono drop-shadow-md ${
                      completed ? 'text-white' : unlocked ? 'text-white' : 'text-slate-500'
                    }`}>{f.num}</span>
                  </button>
                </div>
              )
            })}
          </div>
          <div className="p-6 border-t border-[#232f48] bg-[#0d111a] relative">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono uppercase mb-2">
              <span>Floors Restored</span>
              <span className="text-primary">{floors.filter(f => isCompleted(f.num)).length}/{floors.length}</span>
            </div>
          </div>
        </aside>
      </main>
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] z-40" />
    </div>
  )
}
