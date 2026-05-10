import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Sounds } from '../audio/sounds'
import { markComplete } from '../lib/gameLogic'
import type { FuseItem } from '../types'

const fuses: FuseItem[] = [
  { id: 'fuse-a', type: 'thermal', label: 'Thermal', voltage: '250V / 10A', icon: 'whatshot', color: 'accent-yellow' },
  { id: 'fuse-b', type: 'plasma', label: 'Plasma', voltage: '500V / 25A', icon: 'electric_bolt', color: 'primary' },
  { id: 'fuse-c', type: 'quantum', label: 'Quantum', voltage: '∞V / ∞A', icon: 'blur_on', color: 'purple-400' },
]

const slotConfigs = [
  { accept: 'thermal', label: 'Thermal' },
  { accept: 'quantum', label: 'Quantum' },
  { accept: 'plasma', label: 'Plasma' },
]

export default function Floor1() {
  const navigate = useNavigate()
  const [inventory, setInventory] = useState<FuseItem[]>(fuses)
  const [slots, setSlots] = useState<{ fill: FuseItem | null; accept: string; label: string }[]>(
    slotConfigs.map(s => ({ fill: null, accept: s.accept, label: s.label }))
  )
  const [completed, setCompleted] = useState(false)
  const [voltage, setVoltage] = useState(0)

  const handleDrop = useCallback((acceptedType: string, fuseItem: FuseItem) => {
    setSlots(prev => {
      const idx = prev.findIndex(s => s.accept === acceptedType && !s.fill)
      if (idx === -1) return prev
      const next = [...prev]
      next[idx] = { ...next[idx], fill: fuseItem }
      return next
    })
    setInventory(prev => prev.filter(f => f.id !== fuseItem.id))
    Sounds.play('keyclick')
  }, [])

  const allFilled = slots.every(s => s.fill !== null)

  useEffect(() => {
    if (!allFilled) return
    let v = 0
    const ramp = setInterval(() => {
      v += 2
      if (v > 100) { v = 100; clearInterval(ramp) }
      setVoltage(v)
      if (v === 100) {
        markComplete(1)
        setCompleted(true)
        Sounds.play('floor_complete')
      }
    }, 50)
    return () => clearInterval(ramp)
  }, [allFilled])

  useEffect(() => {
    if (!completed) return
    const t = setTimeout(() => navigate('/floor/2'), 3000)
    return () => clearTimeout(t)
  }, [completed, navigate])

  return (
    <Layout floorNumber={1} title="Main Breaker Panel" subtitle="Fuse Puzzle">
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative">
        <div className="w-full max-w-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 md:p-8 shadow-lg flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white glitch-text" data-text="MAIN BREAKER PANEL">MAIN BREAKER PANEL</h1>
          <p className="text-slate-400 text-sm">Status: <span className={completed ? 'text-green-500 font-mono font-bold' : 'text-red-500 font-mono font-bold'}>
            {completed ? 'ONLINE' : 'OFFLINE'}
          </span></p>
        </div>

        {/* Voltage bar */}
        <div className="w-full max-w-sm">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-500">System Voltage</span>
            <span className="text-primary font-mono font-bold">{voltage}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mt-1">
            <div className="h-full bg-primary transition-all duration-200" style={{ width: `${voltage}%` }} />
          </div>
        </div>

        {/* Circuit Board with Slots */}
        <div className="bg-[#1a1f2c] rounded-xl border border-slate-700 p-8 relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative z-10 flex items-center justify-center gap-8">
            {slots.map((slot, idx) => (
              <DropSlot key={idx} slot={slot} index={idx} onDrop={handleDrop} filled={slot.fill !== null} />
            ))}
          </div>
        </div>

        {/* Fuse Inventory */}
        <div className="flex flex-col items-center gap-3">
          <h3 className="text-white text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">inventory_2</span>
            Fuses
          </h3>
          <div className="flex gap-3">
            {inventory.map(fuse => (
              <FuseCard key={fuse.id} fuse={fuse} onDrop={handleDrop} />
            ))}
            {inventory.length === 0 && (
              <div className="text-slate-600 text-sm font-mono py-4">ALL FUSES INSERTED</div>
            )}
          </div>
          </div>
        </div>

        {completed && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
            <div className="text-center animate-pulse">
              <div className="text-3xl text-green-400 font-bold mb-2">SYSTEM ONLINE</div>
              <div className="text-primary font-mono text-sm">ACCESS GRANTED - PROCEEDING...</div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

function FuseCard({ fuse, onDrop }: { fuse: FuseItem; onDrop: (type: string, item: FuseItem) => void }) {
  const colorMap: Record<string, string> = {
    'accent-yellow': 'bg-yellow-500/10 shadow-[0_0_8px_rgba(250,204,21,0.6)]',
    primary: 'bg-primary/10 shadow-[0_0_8px_rgba(19,91,236,0.6)]',
    'purple-400': 'bg-purple-500/10 shadow-[0_0_8px_rgba(168,85,247,0.6)]',
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(fuse))
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="group relative bg-slate-800/50 border border-slate-700 rounded-lg p-2 hover:border-primary/50 transition-all cursor-grab active:cursor-grabbing"
    >
      <div className={`absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full ${colorMap[fuse.color] || 'bg-yellow-500/10'}`} />
      <div className="flex items-center gap-2">
        <div className="w-8 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded border border-slate-600 flex items-center justify-center">
          <span className={`material-symbols-outlined text-${fuse.color} text-base`}>{fuse.icon}</span>
        </div>
        <div>
          <div className="text-white font-bold tracking-widest text-xs">{fuse.label}</div>
          <div className={`text-[10px] font-mono text-${fuse.color}`}>{fuse.voltage}</div>
        </div>
      </div>
    </div>
  )
}

function DropSlot({ slot, index, onDrop, filled }: {
  slot: { fill: FuseItem | null; accept: string; label: string }
  index: number
  onDrop: (type: string, item: FuseItem) => void
  filled: boolean
}) {
  const [hover, setHover] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!filled) setHover(true)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setHover(false)
    if (filled) return
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain')) as FuseItem
      if (data.type === slot.accept) {
        onDrop(slot.accept, data)
      }
    } catch { /* ignore */ }
  }

  const colorAccent = slot.accept === 'thermal' ? 'accent-yellow' : slot.accept === 'quantum' ? 'purple-400' : 'primary'

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        onDragOver={handleDragOver}
        onDragLeave={() => setHover(false)}
        onDrop={handleDrop}
        className={`relative w-20 h-28 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all ${
          filled
            ? 'border-green-500 bg-slate-900/80'
            : hover
              ? 'border-primary bg-slate-900/80 shadow-[0_0_20px_rgba(19,91,236,0.3)]'
              : 'border-slate-600 bg-slate-900/50'
        }`}
      >
        {filled ? (
          <span className="material-symbols-outlined text-3xl" style={{ color: colorAccent === 'accent-yellow' ? '#eab308' : colorAccent === 'purple-400' ? '#a855f7' : '#135bec' }}>
            {slot.accept === 'thermal' ? 'whatshot' : slot.accept === 'quantum' ? 'blur_on' : 'electric_bolt'}
          </span>
        ) : (
          <>
            <span className="material-symbols-outlined text-slate-600 text-3xl mb-1">download</span>
            <span className="text-[9px] font-mono uppercase text-slate-500">{slot.label}</span>
          </>
        )}
      </div>
      <span className={`text-[10px] font-mono ${filled ? 'text-primary font-bold' : 'text-slate-500'}`}>
        {slot.accept.toUpperCase()}
      </span>
    </div>
  )
}
