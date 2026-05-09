import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { Sounds } from '../audio/sounds'
import { markComplete, BUG_TYPES } from '../lib/gameLogic'

const TOTAL_BUGS = 25
const SPAWN_RATE = 600

interface Bug {
  id: number
  x: number
  y: number
  type: typeof BUG_TYPES[number]
  alive: boolean
}

export default function Floor4() {
  const navigate = useNavigate()
  const [bugs, setBugs] = useState<Bug[]>([])
  const [bugsSpawned, setBugsSpawned] = useState(0)
  const [bugsKilled, setBugsKilled] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const activeRef = useRef(true)

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [...prev.slice(-20), msg])
  }, [])

  useEffect(() => {
    activeRef.current = true
    addLog('Initiating purge sequence...')
    addLog('ERROR: Multiple entities detected.')

    const interval = setInterval(() => {
      if (!activeRef.current) return
      setBugsSpawned(prev => {
        if (prev >= TOTAL_BUGS) { clearInterval(interval); return prev }
        const newBug: Bug = {
          id: prev,
          x: Math.random() * 80 + 5,
          y: Math.random() * 70 + 10,
          type: BUG_TYPES[Math.floor(Math.random() * BUG_TYPES.length)],
          alive: true,
        }
        setBugs(b => [...b, newBug])
        Sounds.play('bug_spawn')
        return prev + 1
      })
    }, SPAWN_RATE)
    return () => { activeRef.current = false }
  }, [addLog])

  const killBug = useCallback((bug: Bug) => {
    if (!activeRef.current || !bug.alive) return
    setBugs(prev => prev.filter(b => b.id !== bug.id))
    setBugsKilled(prev => {
      const killed = prev + 1
      Sounds.play('bug_kill')
      addLog(`Entity removed: ${bug.type.label} (${killed}/${TOTAL_BUGS})`)
      return killed
    })
  }, [addLog])

  useEffect(() => {
    if (bugsSpawned >= TOTAL_BUGS && bugs.length === 0 && bugsKilled > 0 && !completed) {
      setCompleted(true)
      activeRef.current = false
      markComplete(4)
      Sounds.play('victory')
      addLog('ALL ENTITIES ELIMINATED')
      setTimeout(() => navigate('/floor/5'), 3000)
    }
  }, [bugsSpawned, bugs.length, bugsKilled, completed, navigate, addLog])

  const pct = Math.round((bugsKilled / TOTAL_BUGS) * 100)

  return (
    <Layout floorNumber={4} title="Debug Terminal" subtitle="Click the Bugs">
      <div className="flex-1 relative overflow-hidden cursor-crosshair bg-[#080b0f]"
        style={{
          background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(239,68,68,0.03) 0%, transparent 70%), #080b0f',
        }}
      >
        {/* Background watermark */}
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center">
          <span className="text-[12rem] font-black text-red-500/[0.03] border-4 border-red-500/[0.03] px-8">404</span>
        </div>

        {/* HUD overlay */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          <div className="bg-black/70 border border-red-900/50 rounded px-3 py-2 text-[10px] font-mono">
            <div className="text-red-400">BUGS: <span className="text-white">{bugs.length}</span></div>
            <div className="text-green-400">KILLED: <span className="text-white">{bugsKilled}</span></div>
          </div>
          <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div className="h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Bug log */}
        <div className="absolute bottom-4 right-4 z-20 bg-black/80 border border-slate-800 rounded w-56 max-h-28 overflow-y-auto p-2 text-[9px] font-mono leading-relaxed">
          {logs.map((log, i) => (
            <div key={i} className={
              log.startsWith('Initiating') || log.startsWith('ALL') ? 'text-green-400' :
              log.startsWith('Entity') ? 'text-green-400' :
              log.startsWith('ERROR') ? 'text-red-400' : 'text-slate-400'
            }>
              &gt; {log}
            </div>
          ))}
          {!completed && (
            <div className="text-primary animate-pulse mt-1">&gt; Awaiting user action...</div>
          )}
        </div>

        {/* Bugs */}
        {bugs.map(bug => (
          <div
            key={bug.id}
            onClick={() => killBug(bug)}
            className="absolute flex flex-col items-center justify-center w-14 h-14 rounded bg-red-900/80 border border-red-500 text-red-300 text-xs hover:scale-110 transition-all duration-100 select-none cursor-pointer animate-float group z-10"
            style={{ left: `${bug.x}%`, top: `${bug.y}%` }}
          >
            <span className="text-xl">{bug.type.icon}</span>
            <span className="text-[7px] mt-0.5 opacity-70">{bug.type.label}</span>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black border border-red-700 text-red-400 text-[7px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {bug.type.msg}
            </div>
          </div>
        ))}

        {completed && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-30">
            <div className="text-center animate-pulse">
              <div className="text-green-400 text-2xl font-mono font-bold mb-2">ALL ENTITIES ELIMINATED</div>
              <div className="text-primary font-mono">System restored.</div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
