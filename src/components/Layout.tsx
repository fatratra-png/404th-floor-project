import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { isCompleted, getCompletedCount } from '../lib/gameLogic'
import { LEVELS } from '../lib/levels'

interface LayoutProps {
  children: ReactNode
  floorNumber: number
  title: string
  subtitle?: string
}

const floorNames: Record<number, { name: string; status: string }> = {
  1: { name: 'Lobby', status: 'Fuse Panel' },
  2: { name: 'Access Terminal', status: 'Keypad' },
  3: { name: 'Server Room', status: 'Emergency Brake' },
  4: { name: 'Executive Suite', status: 'Final Debug' },
  5: { name: 'Memory Core', status: 'Sequence Lock' },
  6: { name: 'Power Plant', status: 'Circuit Balance' },
  7: { name: 'Comms Hub', status: 'Wire Cipher' },
  8: { name: 'Mainframe', status: 'Core Reboot' },
  9: { name: 'Signal Lab', status: 'Frequency Match' },
  10: { name: 'Plumbing Core', status: 'Pipe Network' },
  11: { name: 'Logic Bay', status: 'Boolean Gates' },
  12: { name: 'Decode Chamber', status: 'Binary Decoder' },
  13: { name: 'Reactor Core', status: 'Pattern Matrix' },
  14: { name: 'Thermal Unit', status: 'Temperature Control' },
  15: { name: 'Vault Room', status: 'Cipher Lock' },
  16: { name: 'Pulse Lab', status: 'EM Sequencing' },
  17: { name: 'Life Support', status: 'Oxygen Balance' },
  18: { name: 'Zero Point', status: 'Final Ascent' },
  19: { name: 'The Crucible', status: 'Ultimate Trial' },
  20: { name: 'The Overlord', status: 'Final Boss' },
}

// Populate floorNames for floors 21-404 from LEVELS data
for (const level of LEVELS) {
  floorNames[level.id] = { name: level.name, status: level.challenge }
}

export default function Layout({ children, floorNumber, title, subtitle }: LayoutProps) {
  const navigate = useNavigate()
  const [panelOpen, setPanelOpen] = useState(false)

  const floorCompleted = isCompleted(floorNumber)
  const prevFloor = floorNumber > 1 ? floorNumber - 1 : null
  const nextFloor = floorNumber < 404 && floorCompleted ? floorNumber + 1 : null
  const done = getCompletedCount()

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-display flex flex-col overflow-hidden">
      {/* Glass header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/[0.04] backdrop-blur-xl border-b border-white/[0.06] px-3 md:px-5 h-12 md:h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-primary text-xl md:text-2xl flex-shrink-0">elevator</span>
          <div className="min-w-0">
            <h1 className="text-white text-sm md:text-base font-bold tracking-tight truncate">FLOOR {floorNumber}</h1>
            <p className="text-[9px] md:text-[10px] text-primary/70 font-mono tracking-wider truncate">
              {floorNames[floorNumber]?.name || 'UNKNOWN'} // {subtitle || floorNames[floorNumber]?.status || ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          <button
            onClick={() => prevFloor && navigate(`/floor/${prevFloor}`)}
            disabled={!prevFloor}
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded bg-white/[0.06] hover:bg-white/[0.12] disabled:opacity-20 transition-all"
            title="Previous floor"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button
            onClick={() => nextFloor && navigate(`/floor/${nextFloor}`)}
            disabled={!nextFloor}
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded bg-white/[0.06] hover:bg-white/[0.12] disabled:opacity-20 transition-all"
            title={floorCompleted ? 'Next floor' : 'Complete this floor first'}
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>

          <div className="w-px h-5 bg-white/[0.06] mx-1 hidden sm:block" />

          <button
            onClick={() => setPanelOpen(prev => !prev)}
            className="flex items-center justify-center w-8 h-8 rounded bg-white/[0.06] hover:bg-white/[0.12] transition-all"
            title="Floor list"
          >
            <span className="material-symbols-outlined text-sm">layers</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 px-3 h-8 bg-white/[0.06] hover:bg-white/[0.12] transition-all rounded text-white/80 text-[10px] md:text-xs font-bold uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span className="hidden md:inline">Hub</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex pt-12 md:pt-14 overflow-hidden relative">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-primary/[0.03] blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-red-500/[0.03] blur-3xl" />
        </div>
        <div className="flex-1 flex flex-col overflow-auto relative">
          {children}
        </div>
      </main>

      {/* Glass overlay floor panel */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPanelOpen(false)} />
          <aside className="relative w-72 max-w-[85vw] h-full bg-white/[0.04] backdrop-blur-2xl border-l border-white/[0.06] shadow-2xl flex flex-col animate-slide-in">
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <h2 className="text-white text-sm font-bold tracking-tight">FLOORS</h2>
                <p className="text-[10px] text-primary/50 font-mono">{done}/404 completed</p>
              </div>
              <button onClick={() => setPanelOpen(false)} className="text-white/40 hover:text-white/80 transition-colors">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
              {FLOOR_LIST.map(f => {
                const cur = f.num === floorNumber
                const complete = isCompleted(f.num)
                const unlockable = f.num === 1 || isCompleted(f.num - 1) || cur
                const canAccess = cur || (unlockable && (complete || f.num < floorNumber))
                return (
                  <button
                    key={f.num}
                    onClick={() => { if (canAccess) { navigate(`/floor/${f.num}`); setPanelOpen(false) } }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                      cur ? 'bg-white/[0.08] text-primary' :
                      complete ? 'bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 cursor-pointer' :
                      unlockable ? 'bg-white/[0.02] hover:bg-white/[0.05] text-white/50 cursor-pointer' :
                      'text-white/20 cursor-not-allowed'
                    }`}
                    disabled={!canAccess}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                      cur ? 'bg-primary text-white' :
                      complete ? 'bg-green-500/20 text-green-400' :
                      unlockable ? 'bg-white/[0.06] text-white/40' :
                      'bg-white/[0.03] text-white/15'
                    }`}>
                      {complete ? '✓' : f.num}
                    </span>
                    <div className="flex-1 min-w-0 text-left">
                      <div className={`text-xs font-bold truncate ${cur ? 'text-primary' : complete ? 'text-green-400/80' : unlockable ? 'text-white/60' : 'text-white/20'}`}>
                        {f.name}
                      </div>
                      <div className={`text-[9px] font-mono truncate ${cur ? 'text-primary/50' : complete ? 'text-green-400/50' : unlockable ? 'text-white/30' : 'text-white/15'}`}>
                        {cur ? 'CURRENT' : complete ? 'COMPLETED' : unlockable ? 'UNLOCKED' : 'LOCKED'}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="px-5 py-3 border-t border-white/[0.06]">
              <button
                onClick={() => navigate('/')}
                className="w-full py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white/50 hover:text-white/80 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Return to Hub
              </button>
            </div>
          </aside>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in { animation: slideIn 0.2s ease-out; }
      `}</style>
    </div>
  )
}

const FLOOR_LIST = [
  ...LEVELS.map(l => ({ num: l.id, name: l.name })).reverse(),
  { num: 20, name: 'The Overlord' },
  { num: 19, name: 'The Crucible' },
  { num: 18, name: 'Zero Point' },
  { num: 17, name: 'Life Support' },
  { num: 16, name: 'Pulse Lab' },
  { num: 15, name: 'Vault Room' },
  { num: 14, name: 'Thermal Unit' },
  { num: 13, name: 'Reactor Core' },
  { num: 12, name: 'Decode Chamber' },
  { num: 11, name: 'Logic Bay' },
  { num: 10, name: 'Plumbing Core' },
  { num: 9, name: 'Signal Lab' },
  { num: 8, name: 'Mainframe' },
  { num: 7, name: 'Comms Hub' },
  { num: 6, name: 'Power Plant' },
  { num: 5, name: 'Memory Core' },
  { num: 4, name: 'Executive Suite' },
  { num: 3, name: 'Server Room' },
  { num: 2, name: 'Access Terminal' },
  { num: 1, name: 'Lobby' },
]
