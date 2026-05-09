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
  const arenaRef = useRef<HTMLDivElement>(null)

  const addLog = useCallback((msg: string, cls = 'text-slate-400') => {
    setLogs(prev => [...prev.slice(-50), msg])
  }, [])

  useEffect(() => {
    activeRef.current = true
    addLog('Initiating purge sequence...', 'text-primary')
    addLog('Scanning sector 4...', 'text-slate-400')
    addLog('ERROR: Multiple entities detected.', 'text-red-400')

    const interval = setInterval(() => {
      if (!activeRef.current) return
      setBugsSpawned(prev => {
        if (prev >= TOTAL_BUGS) {
          clearInterval(interval)
          return prev
        }
        const newBug: Bug = {
          id: prev,
          x: Math.random() * 75 + 5,
          y: Math.random() * 65 + 10,
          type: BUG_TYPES[Math.floor(Math.random() * BUG_TYPES.length)],
          alive: true,
        }
        setBugs(b => [...b, newBug])
        Sounds.play('bug_spawn')
        addLog(`Entity spawned: ${newBug.type.label}`, 'text-yellow-400')
        return prev + 1
      })
    }, SPAWN_RATE)

    return () => {
      activeRef.current = false
      clearInterval(interval)
    }
  }, [addLog])

  const killBug = useCallback((bug: Bug) => {
    if (!activeRef.current || !bug.alive) return
    setBugs(prev => prev.filter(b => b.id !== bug.id))
    setBugsKilled(prev => {
      const killed = prev + 1
      Sounds.play('bug_kill')
      addLog(`Entity removed: ${bug.type.label} (${killed}/${TOTAL_BUGS})`, 'text-green-400')
      return killed
    })
    addLog(`> ${bug.type.msg}`, 'text-red-400')
  }, [addLog])

  useEffect(() => {
    if (bugsSpawned >= TOTAL_BUGS && bugs.length === 0 && bugsKilled > 0 && !completed) {
      setCompleted(true)
      activeRef.current = false
      markComplete(4)
      Sounds.play('victory')
      addLog('ALL ENTITIES ELIMINATED', 'text-green-400')
      addLog('System restored.', 'text-primary')
      setTimeout(() => navigate('/floor/5'), 3000)
    }
  }, [bugsSpawned, bugs.length, bugsKilled, completed, navigate, addLog])

  const pct = Math.round((bugsKilled / TOTAL_BUGS) * 100)

  return (
    <Layout floorNumber={4} title="Debug Terminal" subtitle="Click the Bugs">
      <div className="flex-1 flex" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
        {/* Left Controls */}
        <div className="w-48 border-r border-[#1a2030] bg-[#0c1018] p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between border-b border-[#1a2030] pb-2">
            <span className="text-[10px] tracking-widest text-slate-500">CONTROLS</span>
            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </div>
          <div className="text-[10px] text-slate-600 border border-[#1a2030] p-2 text-center">🔒 SYSTEM_LOCKED</div>
          <div className="mt-auto">
            <div className="text-[10px] text-slate-500">BUGS: {bugs.length}</div>
            <div className="text-[10px] text-slate-500">KILLED: {bugsKilled}</div>
            <div className="text-[10px] text-slate-500">STATUS: {completed ? 'PURGED' : 'ACTIVE'}</div>
          </div>
        </div>

        {/* Arena */}
        <div
          ref={arenaRef}
          className="flex-1 relative overflow-hidden cursor-crosshair bg-[#080b0f]"
          style={{
            background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(239,68,68,0.03) 0%, transparent 70%), #080b0f',
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9rem] font-black text-red-500/5 pointer-events-none select-none border-4 border-red-500/5 px-4">
            404
          </div>
          <div className="absolute bottom-[15%] left-[8%] text-4xl font-black text-red-500/5 pointer-events-none select-none">
            undefined
          </div>

          {bugs.map(bug => (
            <div
              key={bug.id}
              onClick={() => killBug(bug)}
              className="absolute flex flex-col items-center justify-center w-16 h-16 rounded-sm bg-red-900/80 border border-red-500 text-red-300 text-xs hover:scale-110 transition-all duration-100 select-none cursor-pointer animate-float group"
              style={{ left: `${bug.x}%`, top: `${bug.y}%` }}
            >
              <span className="text-2xl">{bug.type.icon}</span>
              <span className="text-[8px] mt-0.5 opacity-70">{bug.type.label}</span>
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black border border-red-700 text-red-400 text-[8px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {bug.type.msg}
              </div>
            </div>
          ))}
        </div>

        {/* Right Syslog */}
        <div className="w-72 border-l border-[#1a2030] bg-[#0c1018] flex flex-col">
          <div className="m-3 border border-[#1a2030] rounded flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-[#0c1018] border-b border-[#1a2030]">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[9px] text-slate-600 ml-1">sys_monitor.log</span>
            </div>
            <div className="flex-1 p-3 overflow-y-auto bg-[#020406] text-[10px] leading-relaxed" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              {logs.map((log, i) => {
                const colorClass = log.startsWith('>') ? 'text-red-400' :
                  log.startsWith('Initiating') || log.startsWith('System') ? 'text-primary' :
                  log.startsWith('ERROR') || log.startsWith('Entity') ? 'text-red-400' :
                  log.startsWith('ALL') ? 'text-green-400' :
                  'text-slate-400'
                return (
                  <div key={i} className={`${colorClass} mb-0.5`}>
                    <span className="text-slate-600">&gt; </span>{log}
                  </div>
                )
              })}
              {!completed && (
                <div className="text-primary animate-pulse mt-1">
                  <span className="text-slate-600">&gt; </span>Awaiting user action...
                  <span className="inline-block w-1.5 h-3 bg-primary ml-0.5 animate-pulse" />
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 p-3 border-t border-[#1a2030]">
            <div className="text-[8px]">
              <div className="text-slate-600 tracking-wider">SECTOR</div>
              <div className="text-slate-400 mt-0.5">0x004F</div>
            </div>
            <div className="text-[8px]">
              <div className="text-slate-600 tracking-wider">ENTITIES</div>
              <div className="text-red-400 mt-0.5">{bugs.length}</div>
            </div>
            <div className="text-[8px]">
              <div className="text-slate-600 tracking-wider">PURGED</div>
              <div className="text-green-400 mt-0.5">{bugsKilled}</div>
            </div>
            <div className="text-[8px]">
              <div className="text-slate-600 tracking-wider">STATUS</div>
              <div className={`mt-0.5 ${completed ? 'text-green-400' : 'text-red-400'}`}>{completed ? 'PURGED' : 'ACTIVE'}</div>
            </div>
          </div>

          {/* Progress */}
          <div className="p-3 border-t border-[#1a2030]">
            <div className="text-[8px] text-slate-600 tracking-wider mb-1">DEBUG PROGRESS</div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-300" style={{ width: `${pct}%` }} />
            </div>
            <div className="text-[8px] text-slate-500 text-right mt-0.5">{pct}%</div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
