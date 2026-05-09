import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

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

export default function Layout({ children, floorNumber, title, subtitle }: LayoutProps) {
  const navigate = useNavigate()
  const [panelOpen, setPanelOpen] = useState(false)

  const prevFloor = floorNumber > 1 ? floorNumber - 1 : null
  const nextFloor = floorNumber < 20 ? floorNumber + 1 : null

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-display flex flex-col overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#111722]/95 backdrop-blur-md border-b border-[#232f48] px-3 md:px-5 h-12 md:h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-primary text-xl md:text-2xl flex-shrink-0">elevator</span>
          <div className="min-w-0">
            <h1 className="text-white text-sm md:text-base font-bold tracking-tight truncate">FLOOR {floorNumber}</h1>
            <p className="text-[9px] md:text-[10px] text-primary font-mono tracking-wider opacity-80 truncate">
              {floorNames[floorNumber]?.name || 'UNKNOWN'} // {subtitle || floorNames[floorNumber]?.status || ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          {/* Floor nav */}
          <button
            onClick={() => prevFloor && navigate(`/floor/${prevFloor}`)}
            disabled={!prevFloor}
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded bg-[#232f48] hover:bg-[#2c3b59] disabled:opacity-30 transition-colors"
            title="Previous floor"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button
            onClick={() => nextFloor && navigate(`/floor/${nextFloor}`)}
            disabled={!nextFloor}
            className="hidden sm:flex items-center justify-center w-8 h-8 rounded bg-[#232f48] hover:bg-[#2c3b59] disabled:opacity-30 transition-colors"
            title="Next floor"
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>

          <div className="w-px h-5 bg-slate-700 mx-1 hidden sm:block" />

          {/* Toggle floor panel */}
          <button
            onClick={() => setPanelOpen(prev => !prev)}
            className="flex items-center justify-center w-8 h-8 rounded bg-[#232f48] hover:bg-[#2c3b59] transition-colors"
            title="Floor list"
          >
            <span className="material-symbols-outlined text-sm">layers</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 px-3 h-8 bg-[#232f48] hover:bg-[#2c3b59] transition-colors rounded text-white text-[10px] md:text-xs font-bold uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span className="hidden md:inline">Hub</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex pt-12 md:pt-14 overflow-hidden relative">
        <div className="flex-1 flex flex-col overflow-auto relative">
          {children}
        </div>
      </main>

      {/* Overlay floor panel */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setPanelOpen(false)} />
          <aside className="relative w-72 max-w-[85vw] h-full bg-panel-dark border-l border-[#232f48] shadow-2xl flex flex-col animate-slide-in">
            <div className="px-5 py-4 border-b border-[#232f48] bg-[#151a25]/80 flex items-center justify-between">
              <h2 className="text-white text-sm font-bold tracking-tight">FLOORS</h2>
              <button onClick={() => setPanelOpen(false)} className="text-slate-400 hover:text-white">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
              {FLOOR_LIST.map(f => {
                const cur = f.num === floorNumber
                const passed = f.num < floorNumber
                return (
                  <button
                    key={f.num}
                    onClick={() => { navigate(`/floor/${f.num}`); setPanelOpen(false) }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-all text-left ${
                      cur ? 'bg-primary/20 text-primary' :
                      passed ? 'bg-[#151a25] hover:bg-[#1a2235] text-slate-300 cursor-pointer' :
                      'text-slate-600 cursor-not-allowed'
                    }`}
                    disabled={!cur && !passed}
                  >
                    <span className={`w-7 h-7 rounded flex items-center justify-center text-xs font-mono font-bold ${
                      cur ? 'bg-primary text-white' :
                      passed ? 'bg-green-600 text-white' :
                      'bg-slate-800 text-slate-600'
                    }`}>
                      {f.num}
                    </span>
                    <div className="flex-1 min-w-0 text-left">
                      <div className={`text-xs font-bold truncate ${cur ? 'text-primary' : passed ? 'text-slate-300' : 'text-slate-600'}`}>
                        {f.name}
                      </div>
                      <div className={`text-[10px] font-mono truncate ${cur ? 'text-primary/60' : passed ? 'text-slate-500' : 'text-slate-700'}`}>
                        {cur ? 'CURRENT' : passed ? 'COMPLETED' : 'LOCKED'}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="px-5 py-3 border-t border-[#232f48] bg-[#111722]/80">
              <button
                onClick={() => navigate('/')}
                className="w-full py-2 bg-[#1a1f2e] hover:bg-[#232f48] border border-[#232f48] text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded flex items-center justify-center gap-1.5 transition-colors"
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
