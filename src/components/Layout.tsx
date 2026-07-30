import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { isCompleted, getCompletedCount, getScore } from '../lib/gameLogic'
import { LEVELS } from '../lib/levels'

interface LayoutProps {
  children: ReactNode
  floorNumber: number
  title: string
  subtitle?: string
}

const floorNames: Record<number, { name: string; status: string }> = {}
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
  const score = getScore()

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-display flex flex-col overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0a1628_0%,_#000000_80%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-cyan-500/[0.03] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-fuchsia-500/[0.03] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2306b6d4\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-40 bg-black/70 backdrop-blur-xl border-b border-cyan-500/20 px-3 md:px-5 h-12 md:h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-cyan-400 text-xl md:text-2xl flex-shrink-0" style={{ textShadow: '0 0 10px rgba(6,182,212,0.5)' }}>elevator</span>
          <div className="min-w-0">
            <h1 className="text-white text-sm md:text-base font-bold tracking-tight truncate" style={{ fontFamily: "'Orbitron', monospace" }}>
              <span className="text-cyan-400">FLOOR</span> {String(floorNumber).padStart(3, '0')}
            </h1>
            <p className="text-[9px] md:text-[10px] text-cyan-400/70 font-mono tracking-wider truncate">
              {floorNames[floorNumber]?.name || title || 'UNKNOWN'} // {subtitle || floorNames[floorNumber]?.status || ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
            <span className="text-[9px] font-mono text-cyan-400/60">SCORE</span>
            <span className="text-xs font-mono text-cyan-400 font-bold">{score.toLocaleString()}</span>
          </div>

          <div className="w-px h-5 bg-cyan-500/20 mx-1 hidden sm:block" />

          <button
            onClick={() => prevFloor && navigate(`/floor/${prevFloor}`)}
            disabled={!prevFloor}
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded bg-white/[0.06] hover:bg-white/[0.12] disabled:opacity-20 transition-all"
            title="Previous floor"
          >
            <span className="material-symbols-outlined text-sm text-cyan-400">chevron_left</span>
          </button>
          <button
            onClick={() => nextFloor && navigate(`/floor/${nextFloor}`)}
            disabled={!nextFloor}
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded bg-white/[0.06] hover:bg-white/[0.12] disabled:opacity-20 transition-all"
            title={floorCompleted ? 'Next floor' : 'Complete this floor first'}
          >
            <span className="material-symbols-outlined text-sm text-cyan-400">chevron_right</span>
          </button>

          <div className="w-px h-5 bg-cyan-500/20 mx-1 hidden sm:block" />

          <button
            onClick={() => setPanelOpen(prev => !prev)}
            className="flex items-center justify-center w-8 h-8 rounded bg-white/[0.06] hover:bg-white/[0.12] transition-all"
            title="Floor list"
          >
            <span className="material-symbols-outlined text-sm text-cyan-400">layers</span>
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

      <main className="flex-1 flex pt-12 md:pt-14 overflow-hidden relative z-10">
        <div className="flex-1 flex flex-col overflow-auto relative">
          {children}
        </div>
      </main>

      {panelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setPanelOpen(false)} />
          <aside className="relative w-72 max-w-[85vw] h-full bg-black/90 backdrop-blur-2xl border-l border-cyan-500/20 shadow-2xl flex flex-col animate-slide-in">
            <div className="px-5 py-4 border-b border-cyan-500/20 flex items-center justify-between">
              <div>
                <h2 className="text-white text-sm font-bold tracking-tight" style={{ fontFamily: "'Orbitron', monospace" }}>FLOORS</h2>
                <p className="text-[10px] text-cyan-400/50 font-mono">{done}/404 COMPLETED</p>
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
                      cur ? 'bg-cyan-500/15 text-cyan-400' :
                      complete ? 'bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 cursor-pointer' :
                      unlockable ? 'bg-white/[0.02] hover:bg-white/[0.05] text-white/50 cursor-pointer' :
                      'text-white/20 cursor-not-allowed'
                    }`}
                    disabled={!canAccess}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                      cur ? 'bg-cyan-500 text-black' :
                      complete ? 'bg-green-500/20 text-green-400' :
                      unlockable ? 'bg-white/[0.06] text-white/40' :
                      'bg-white/[0.03] text-white/15'
                    }`}>
                      {complete ? '✓' : f.num}
                    </span>
                    <div className="flex-1 min-w-0 text-left">
                      <div className={`text-xs font-bold truncate ${cur ? 'text-cyan-400' : complete ? 'text-green-400/80' : unlockable ? 'text-white/60' : 'text-white/20'}`}>
                        {f.name}
                      </div>
                      <div className={`text-[9px] font-mono truncate ${cur ? 'text-cyan-400/50' : complete ? 'text-green-400/50' : unlockable ? 'text-white/30' : 'text-white/15'}`}>
                        {cur ? 'CURRENT' : complete ? 'COMPLETED' : unlockable ? 'UNLOCKED' : 'LOCKED'}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="px-5 py-3 border-t border-cyan-500/20">
              <button
                onClick={() => navigate('/')}
                className="w-full py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-cyan-500/20 text-white/50 hover:text-white/80 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5 transition-all"
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

const FLOOR_LIST = LEVELS.map(l => ({ num: l.id, name: l.name })).reverse()
