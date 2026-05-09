import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
  floorNumber: number
  title: string
  subtitle?: string
  showPanel?: boolean
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
}

export default function Layout({ children, floorNumber, title, subtitle, showPanel = true }: LayoutProps) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-display flex flex-col overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#111722]/90 backdrop-blur-md border-b border-[#232f48] px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">elevator</span>
          <div>
            <h1 className="text-white text-lg font-bold tracking-tight">FLOOR {floorNumber}</h1>
            <p className="text-xs text-primary font-mono tracking-wider opacity-80">
              {floorNames[floorNumber]?.name || 'UNKNOWN'} // {subtitle || floorNames[floorNumber]?.status || ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:flex items-center gap-1 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            CONNECTION UNSTABLE
          </span>
          <button
            onClick={() => navigate('/')}
            className="bg-[#232f48] hover:bg-[#2c3b59] transition-colors px-4 py-2 rounded-lg text-white text-xs font-bold uppercase tracking-widest"
          >
            Hub
          </button>
        </div>
      </header>

      <main className="flex-1 flex pt-16 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-auto relative">
          {children}
        </div>
        {showPanel && (
          <ControlPanel floorNumber={floorNumber} />
        )}
      </main>
    </div>
  )
}

function ControlPanel({ floorNumber }: { floorNumber: number }) {
  const navigate = useNavigate()

  const floors = [
    { num: 8, name: 'Mainframe', status: floorNumber === 8 ? 'ACTIVE' : floorNumber > 8 ? 'PASSED' : 'LOCKED', color: floorNumber === 8 ? 'primary' : floorNumber > 8 ? 'green' : 'slate' },
    { num: 7, name: 'Comms Hub', status: floorNumber === 7 ? 'ACTIVE' : floorNumber > 7 ? 'PASSED' : 'LOCKED', color: floorNumber === 7 ? 'primary' : floorNumber > 7 ? 'green' : 'slate' },
    { num: 6, name: 'Power Plant', status: floorNumber === 6 ? 'ACTIVE' : floorNumber > 6 ? 'PASSED' : 'LOCKED', color: floorNumber === 6 ? 'primary' : floorNumber > 6 ? 'green' : 'slate' },
    { num: 5, name: 'Memory Core', status: floorNumber === 5 ? 'ACTIVE' : floorNumber > 5 ? 'PASSED' : 'LOCKED', color: floorNumber === 5 ? 'primary' : floorNumber > 5 ? 'green' : 'slate' },
    { num: 4, name: 'Executive Suite', status: floorNumber === 4 ? 'ACTIVE' : floorNumber > 4 || (floorNumber === 4) ? 'PASSED' : 'LOCKED', color: floorNumber === 4 ? 'primary' : floorNumber > 4 ? 'green' : 'slate' },
    { num: 3, name: 'Server Room', status: floorNumber === 3 ? 'ACTIVE' : floorNumber > 3 ? 'PASSED' : 'LOCKED', color: floorNumber === 3 ? 'primary' : floorNumber > 3 ? 'green' : 'slate' },
    { num: 2, name: 'Access Terminal', status: floorNumber === 2 ? 'ACTIVE' : floorNumber > 2 ? 'PASSED' : 'LOCKED', color: floorNumber === 2 ? 'primary' : floorNumber > 2 ? 'green' : 'slate' },
    { num: 1, name: 'Lobby', status: floorNumber === 1 ? 'ACTIVE' : floorNumber > 1 ? 'PASSED' : 'LOCKED', color: floorNumber === 1 ? 'primary' : floorNumber > 1 ? 'green' : 'slate' },
  ]

  const colorMap: Record<string, string> = {
    primary: 'bg-primary border-primary shadow-neon-strong text-white',
    green: 'bg-green-600 border-green-600 shadow-neon-strong text-white',
    slate: 'bg-[#151a25] border-[#232f48] shadow-button-normal text-slate-500',
  }

  return (
    <aside className="w-72 h-full bg-panel-dark border-l border-[#232f48] shadow-2xl flex flex-col relative flex-shrink-0">
      <div className="absolute inset-0 bg-brushed-metal opacity-50 pointer-events-none" />
      <div className="p-5 border-b border-[#232f48] bg-[#151a25]/50 backdrop-blur relative">
        <h2 className="text-white text-lg font-bold tracking-tight">CONTROL PANEL</h2>
        <div className="flex items-center gap-2 mt-2">
          <div className="h-1.5 flex-1 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 w-[35%] animate-pulse" />
          </div>
          <span className="text-xs text-red-400 font-mono">PWR: 35%</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 items-center justify-center relative">
        {floors.map(f => (
          <div key={f.num} className="w-full flex items-center justify-between gap-3 group">
            <div className="text-right flex-1">
              <div className={`text-sm font-bold ${f.color === 'primary' ? 'text-primary' : f.color === 'green' ? 'text-green-500' : 'text-slate-400'}`}>
                {f.name}
              </div>
              <div className={`text-xs font-mono ${f.color === 'primary' ? 'text-primary/70' : f.color === 'green' ? 'text-green-500/70' : 'text-slate-600'}`}>
                {f.status}
              </div>
            </div>
            <button
              onClick={() => {
                if (f.num < floorNumber) navigate(`/floor/${f.num}`)
              }}
              className={`w-14 h-14 rounded-lg ${colorMap[f.color]} flex items-center justify-center transition-all ${f.color !== 'slate' ? 'hover:scale-105 active:scale-95 cursor-pointer' : ''}`}
            >
              <span className="text-xl font-bold font-mono drop-shadow-md">{f.num}</span>
            </button>
          </div>
        ))}
      </div>
      <div className="p-5 border-t border-[#232f48] bg-[#0d111a] relative">
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 bg-[#1a1f2e] hover:bg-[#232f48] border border-[#232f48] text-slate-300 text-xs font-bold uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Return to Hub
        </button>
      </div>
    </aside>
  )
}
