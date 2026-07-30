import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getScore, getHintsUsed, getCompletedCount } from '../lib/gameLogic'

export default function Victory() {
  const navigate = useNavigate()
  const score = getScore()
  const hints = getHintsUsed()
  const floors = getCompletedCount()

  useEffect(() => {
    const s = document.getElementById('v-scroll')
    let start: number | null = null
    const DURATION = 30000
    function tick(now: number) {
      if (!start) start = now
      const p = Math.min((now - start) / DURATION, 1)
      if (s) s.style.transform = `translateY(${-p * (window.innerHeight + (s?.scrollHeight || 0))}px)`
      if (p < 1) requestAnimationFrame(tick)
    }
    setTimeout(() => { start = null; requestAnimationFrame(tick) }, 1000)
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-mono">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0a1628_0%,_#000000_80%)]" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-cyan-500/[0.05] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-fuchsia-500/[0.05] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2306b6d4\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      </div>

      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 border border-cyan-400/30 bg-black/70 backdrop-blur-xl px-4 py-1.5 rounded-lg">
        <span className="font-bold text-xl text-cyan-400" style={{ fontFamily: "'Orbitron', monospace", textShadow: '0 0 12px rgba(6,182,212,0.7)' }}>405</span>
        <div className="flex flex-col">
          <span className="text-[6px] text-cyan-400/60 tracking-widest">FLOOR</span>
          <span className="text-[6px] text-cyan-400/60 tracking-widest">BREACHED</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-8 z-50 flex items-center justify-between px-6 bg-black/90 backdrop-blur-xl border-t border-cyan-400/10">
        <div className="font-mono text-[8px] text-cyan-400/40 tracking-widest">THE 404TH FLOOR // SYSTEM_SHUTDOWN</div>
        <div id="v-status" className="font-mono text-[8px] text-cyan-400/60 tracking-widest">TRANSMISSION COMPLETE</div>
        <button
          onClick={() => navigate('/')}
          className="font-mono text-[8px] text-white/40 hover:text-cyan-400 transition-colors tracking-widest border border-cyan-400/20 hover:border-cyan-400/40 px-3 py-0.5 rounded"
        >
          RESTART
        </button>
      </div>

      <div id="v-scroll" className="absolute left-0 right-0 z-10 flex justify-center" style={{ top: '100%' }}>
        <div className="w-full max-w-xl px-6 flex flex-col items-center">
          <div className="h-24" />

          <div className="flex flex-col items-center gap-5 mb-20 w-full">
            <div className="font-mono text-[9px] text-cyan-400/50 tracking-[0.5em] animate-pulse">SYSTEM BREACHED</div>
            <div className="text-center" style={{ fontFamily: "'Orbitron', monospace" }}>
              <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-400 leading-none">THE 404TH</div>
              <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-fuchsia-400 leading-none mt-2">FLOOR</div>
            </div>
            <div className="h-px w-40 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
            <div className="text-slate-500 text-xs tracking-[0.45em] text-center" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              CYBERDOME ESCAPE ROOM<br />
              <span className="text-cyan-400/70">ALL SYSTEMS BREACHED</span>
            </div>
          </div>

          <div className="w-full flex flex-col items-center gap-6 mb-20">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
            <div className="font-mono text-[9px] text-cyan-400/40 tracking-[0.45em]">MISSION STATS</div>
            <div className="grid grid-cols-3 gap-6 w-full text-center">
              <div className="bg-black/40 border border-cyan-400/10 rounded-lg p-3">
                <div className="text-[7px] font-mono text-slate-600 tracking-widest mb-1">FLOORS</div>
                <div className="text-2xl font-bold text-cyan-400" style={{ fontFamily: "'Orbitron', monospace" }}>{floors}</div>
              </div>
              <div className="bg-black/40 border border-cyan-400/10 rounded-lg p-3">
                <div className="text-[7px] font-mono text-slate-600 tracking-widest mb-1">SCORE</div>
                <div className="text-2xl font-bold text-fuchsia-400" style={{ fontFamily: "'Orbitron', monospace" }}>{score.toLocaleString()}</div>
              </div>
              <div className="bg-black/40 border border-cyan-400/10 rounded-lg p-3">
                <div className="text-[7px] font-mono text-slate-600 tracking-widest mb-1">HINTS</div>
                <div className="text-2xl font-bold text-yellow-400" style={{ fontFamily: "'Orbitron', monospace" }}>{hints}</div>
              </div>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
          </div>

          <div className="w-full flex flex-col items-center gap-8 mb-20">
            <div className="font-mono text-[9px] text-cyan-400/40 tracking-[0.45em]">DEVELOPED BY</div>
            {[
              { role: 'SYSTEM ARCHITECT', name: '@architect', desc: 'State · Routing · Navigation' },
              { role: 'UI ENGINEER', name: '@designer', desc: 'Design · Animations · Identity' },
              { role: 'CORE DEVELOPER', name: '@developer', desc: 'Puzzles · Components · React' },
              { role: 'SYSTEMS ENGINEER', name: '@devops', desc: 'Logic · Audio · CI/CD', feat: true },
            ].map((m, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-1">
                <div className="font-mono text-[8px] text-slate-600 tracking-[0.35em]">{m.role}</div>
                <div className={`font-bold tracking-wider text-xl ${m.feat ? 'text-[#a3e635]' : 'text-white'}`}
                  style={{ fontFamily: "'Orbitron', monospace", textShadow: m.feat ? '0 0 16px rgba(163,230,53,0.6)' : '0 0 14px rgba(6,182,212,0.5)' }}>
                  {m.name}
                </div>
                <div className="text-slate-500 text-sm tracking-widest text-center" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{m.desc}</div>
                <div className="h-px w-28 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent mt-2" />
              </div>
            ))}
          </div>

          <div className="w-full flex flex-col items-center gap-6 mb-24">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
            <div className="font-mono text-[9px] text-cyan-400/40 tracking-[0.45em]">STACK</div>
            <div className="grid grid-cols-3 gap-6 text-center w-full">
              {[
                { label: 'LANG', value: 'TypeScript' },
                { label: 'UI', value: 'React + Tailwind' },
                { label: 'AUDIO', value: 'Web Audio API' },
                { label: 'ROUTING', value: 'React Router' },
                { label: 'BUILD', value: 'Vite' },
                { label: 'STATE', value: 'localStorage' },
              ].map((t, i) => (
                <div key={i}>
                  <div className="font-mono text-[7px] text-slate-700 tracking-widest mb-1">{t.label}</div>
                  <div className="text-slate-400 font-semibold text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{t.value}</div>
                </div>
              ))}
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
          </div>

          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="font-mono text-[8px] text-cyan-400/30 tracking-[0.5em]">A PRODUCTION OF</div>
            <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-400 leading-none text-center" style={{ fontFamily: "'Orbitron', monospace" }}>
              THE 404TH<br />FLOOR
            </div>
            <div className="text-slate-700 text-xs tracking-[0.3em] text-center mt-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              ALL FLOORS WERE BREACHED IN THE MAKING OF THIS ESCAPE ROOM
            </div>
            <div className="font-mono text-[8px] text-slate-800 tracking-widest mt-4">
              ERR_ELEVATOR_BREACHED_SUCCESSFULLY_0x00405
            </div>
          </div>
          <div className="h-screen" />
        </div>
      </div>
    </div>
  )
}
