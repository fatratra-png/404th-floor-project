import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sounds } from '../audio/sounds'

const TEAM = {
  m1: '@architect',
  m2: '@designer',
  m3: '@developer',
  m4: '@devops',
}

export default function Victory() {
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const doorL = document.getElementById('door-L')
    const doorR = document.getElementById('door-R')
    const corridor = document.getElementById('corridor')
    const credWrap = document.getElementById('credits-wrap')
    const gapGlow = document.getElementById('gap-glow')
    const statusTxt = document.getElementById('status-txt')

    if (statusTxt) statusTxt.textContent = 'DOORS INITIALIZING...'

    // Animate team names
    const nameMap: Record<string, string> = {
      'name-m1': TEAM.m1, 'name-m2': TEAM.m2, 'name-m3': TEAM.m3, 'name-m4': TEAM.m4,
    }
    Object.entries(nameMap).forEach(([id, val]) => {
      const el = document.getElementById(id)
      if (el) el.textContent = val
    })

    // Sequence
    setTimeout(() => {
      if (statusTxt) statusTxt.textContent = 'MOTOR ENGAGED'
    }, 800)

    setTimeout(() => {
      if (statusTxt) statusTxt.textContent = 'UNLOCKING...'
      // Rattle
      if (doorL) {
        let i = 0
        const frames = ['translateX(-3px)', 'translateX(3px)', 'translateX(-4px)', 'translateX(4px)', 'translateX(-2px)', 'translateX(2px)', 'translateX(0)']
        const id = setInterval(() => {
          doorL.style.transform = frames[i % frames.length]
          i++
          if (i >= frames.length * 3) clearInterval(id)
        }, 60)
      }
      if (doorR) {
        let i = 0
        const frames = ['translateX(3px)', 'translateX(-3px)', 'translateX(4px)', 'translateX(-4px)', 'translateX(2px)', 'translateX(-2px)', 'translateX(0)']
        const id = setInterval(() => {
          doorR.style.transform = frames[i % frames.length]
          i++
          if (i >= frames.length * 3) clearInterval(id)
        }, 60)
      }
    }, 1500)

    setTimeout(() => {
      if (gapGlow) gapGlow.style.filter = 'blur(6px) brightness(1.5)'
    }, 2800)

    setTimeout(() => {
      if (statusTxt) statusTxt.textContent = 'DOORS OPENING'
      if (doorL) {
        doorL.style.transition = 'transform 2.4s cubic-bezier(0.7,0,0.3,1)'
        doorL.style.transform = 'translateX(-100%)'
      }
      if (doorR) {
        doorR.style.transition = 'transform 2.4s cubic-bezier(0.7,0,0.3,1)'
        doorR.style.transform = 'translateX(100%)'
      }
      if (corridor) {
        corridor.style.transition = 'opacity 1.8s ease 0.6s'
        corridor.style.opacity = '1'
      }
    }, 3300)

    setTimeout(() => {
      if (statusTxt) statusTxt.textContent = 'FLOOR 405 REACHED'
    }, 5000)

    setTimeout(() => {
      if (statusTxt) statusTxt.textContent = 'CREDITS ROLLING...'
      if (credWrap) {
        credWrap.style.transition = 'opacity 1.2s ease'
        credWrap.style.opacity = '1'
        credWrap.style.pointerEvents = 'auto'
      }
      if (gapGlow) {
        gapGlow.style.transition = 'opacity 2s ease'
        gapGlow.style.opacity = '0'
      }
      Sounds.play('victory')
    }, 6400)

    // Scroll credits
    const scrollEl = document.getElementById('credits-scroll')
    let startTime: number | null = null
    const DURATION = 42000

    function tick(now: number) {
      if (!startTime) startTime = now
      const elapsed = now - startTime
      const progress = Math.min(elapsed / DURATION, 1)
      const travel = window.innerHeight + (scrollEl?.scrollHeight || 0)
      if (scrollEl) scrollEl.style.transform = `translateY(${-progress * travel}px)`
      if (progress < 1) requestAnimationFrame(tick)
    }

    setTimeout(() => {
      startTime = null
      requestAnimationFrame(tick)
    }, 6600)

  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-mono">
      {/* Elevator background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-cyan-400/70 shadow-[0_0_12px_rgba(6,182,212,0.6)]" />
        <div className="absolute bottom-8 left-0 right-0 h-px bg-primary/20" />
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2 border border-primary/30 bg-black/60 px-4 py-1.5 z-10 animate-flicker">
          <span className="font-bold text-xl text-cyan-400 floor-indicator" style={{ fontFamily: "'Orbitron', monospace", textShadow: '0 0 12px rgba(6,182,212,0.7)' }}>404</span>
          <div className="flex flex-col">
            <span className="text-[6px] text-primary/60 tracking-widest">FLOOR</span>
            <span className="text-[6px] text-primary/60 tracking-widest">CURRENT</span>
          </div>
        </div>
        <div className="absolute left-0 right-0 h-0.5 bg-cyan-400/10 blur-sm z-20 animate-scanline" />
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
        <div className="absolute right-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 rounded-full bg-primary/5 blur-3xl animate-pulse pointer-events-none" />
      </div>

      {/* Corridor */}
      <div id="corridor" className="absolute inset-0 z-[1] opacity-0 pointer-events-none">
        <div className="absolute inset-0 opacity-25">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="50" y1="38" x2="0" y2="100" stroke="#135bec" strokeWidth="0.3" />
            <line x1="50" y1="38" x2="25" y2="100" stroke="#135bec" strokeWidth="0.2" />
            <line x1="50" y1="38" x2="75" y2="100" stroke="#135bec" strokeWidth="0.2" />
            <line x1="50" y1="38" x2="100" y2="100" stroke="#135bec" strokeWidth="0.3" />
            <line x1="30" y1="60" x2="70" y2="60" stroke="#135bec" strokeWidth="0.2" opacity="0.4" />
            <line x1="20" y1="72" x2="80" y2="72" stroke="#135bec" strokeWidth="0.2" opacity="0.3" />
            <line x1="10" y1="84" x2="90" y2="84" stroke="#135bec" strokeWidth="0.2" opacity="0.2" />
          </svg>
        </div>
      </div>

      {/* Left door */}
      <div id="door-L" className="absolute top-0 left-0 w-1/2 h-full z-20 overflow-hidden" style={{ transformOrigin: 'left center', background: 'linear-gradient(135deg, #1a1f2e 0%, #0d1117 100%)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2))', backgroundSize: '100% 4px' }} />
        <div className="absolute right-0 top-0 bottom-0 w-0.5" style={{ background: 'linear-gradient(180deg, transparent, rgba(6,182,212,0.4) 30%, rgba(19,91,236,0.6) 50%, rgba(6,182,212,0.4) 70%, transparent)' }} />
        <div className="absolute bottom-20 right-8 text-[8px] text-primary/20 tracking-[0.3em] rotate-90 origin-right">SYS // DOOR-L</div>
      </div>

      {/* Right door */}
      <div id="door-R" className="absolute top-0 right-0 w-1/2 h-full z-20 overflow-hidden" style={{ transformOrigin: 'right center', background: 'linear-gradient(135deg, #0d1117 0%, #1a1f2e 100%)' }}>
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2))', backgroundSize: '100% 4px' }} />
        <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: 'linear-gradient(180deg, transparent, rgba(6,182,212,0.4) 30%, rgba(19,91,236,0.6) 50%, rgba(6,182,212,0.4) 70%, transparent)' }} />
        <div className="absolute bottom-20 left-8 text-[8px] text-primary/20 tracking-[0.3em] rotate-90 origin-left">SYS // DOOR-R</div>
      </div>

      {/* Center glow */}
      <div className="absolute top-0 bottom-0 z-[19] pointer-events-none" style={{ left: 'calc(50% - 1px)', width: '2px' }}>
        <div id="gap-glow" className="w-full h-full" />
      </div>

      {/* Credits */}
      <div id="credits-wrap" className="absolute inset-0 z-10 overflow-hidden opacity-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-28 z-30 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.95), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-36 z-30 pointer-events-none" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.98), transparent)' }} />

        <div id="credits-scroll" className="absolute left-0 right-0 flex justify-center" style={{ top: '100%' }}>
          <div className="w-full max-w-xl px-6 flex flex-col items-center">
            <div className="h-24" />
            <div className="flex flex-col items-center gap-5 mb-28 w-full">
              <div className="font-mono text-[9px] text-cyan-400/50 tracking-[0.5em] animate-flicker">ELEVATOR RESTORED</div>
              <div className="text-center" style={{ fontFamily: "'Orbitron', monospace" }}>
                <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-primary leading-none">THE 404TH</div>
                <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400 leading-none mt-2">FLOOR</div>
              </div>
              <div className="h-px w-40 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="text-slate-500 text-xs tracking-[0.45em] text-center" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                ESCAPE ROOM ADVENTURE<br />
                <span className="text-primary/70">ALL SYSTEMS NOMINAL</span>
              </div>
            </div>

            <div className="w-full flex flex-col items-center gap-8 mb-24">
              <div className="font-mono text-[9px] text-primary/40 tracking-[0.45em]">DEVELOPED BY</div>
              {[
                { role: 'SYSTEM ARCHITECT', name: TEAM.m1, desc: 'State Management · Routing · Navigation' },
                { role: 'UI / UX ENGINEER', name: TEAM.m2, desc: 'Design System · Animations · Visual Identity' },
                { role: 'FRONTEND DEVELOPER', name: TEAM.m3, desc: 'Floor 1-4 Puzzles · Components · React' },
                { role: 'DEVOPS ENGINEER', name: TEAM.m4, desc: 'Floor 5-8 Puzzles · Audio Engine · CI/CD', featured: true },
              ].map((m, i) => (
                <div key={i} className="w-full flex flex-col items-center gap-1">
                  <div className="font-mono text-[8px] text-slate-600 tracking-[0.35em]">{m.role}</div>
                  <div className={`font-bold tracking-wider text-xl ${m.featured ? 'text-[#a3e635]' : 'text-white'}`}
                    style={{ fontFamily: "'Orbitron', monospace", textShadow: m.featured ? '0 0 16px rgba(163,230,53,0.6)' : '0 0 14px rgba(19,91,236,0.5)' }}>
                    {m.name}
                  </div>
                  <div className="text-slate-500 text-sm tracking-widest text-center" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{m.desc}</div>
                  <div className="h-px w-28 bg-gradient-to-r from-transparent via-primary/30 to-transparent mt-2" />
                </div>
              ))}
            </div>

            <div className="w-full flex flex-col items-center gap-6 mb-24">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <div className="font-mono text-[9px] text-primary/40 tracking-[0.45em]">BUILT WITH</div>
              <div className="grid grid-cols-3 gap-8 text-center w-full">
                {[
                  { label: 'LANGUAGE', value: 'TypeScript + React' },
                  { label: 'STYLING', value: 'Tailwind CSS v3' },
                  { label: 'AUDIO', value: 'Web Audio API' },
                  { label: 'ROUTING', value: 'React Router' },
                  { label: 'TESTING', value: 'Mocha + Chai' },
                  { label: 'BUILD', value: 'Vite' },
                ].map((t, i) => (
                  <div key={i}>
                    <div className="font-mono text-[7px] text-slate-700 tracking-widest mb-1">{t.label}</div>
                    <div className="text-slate-400 font-semibold text-sm" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{t.value}</div>
                  </div>
                ))}
              </div>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </div>

            <div className="flex flex-col items-center gap-6 mb-8">
              <div className="font-mono text-[8px] text-primary/30 tracking-[0.5em]">A PRODUCTION OF</div>
              <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-primary leading-none text-center" style={{ fontFamily: "'Orbitron', monospace" }}>
                THE 404TH<br />FLOOR
              </div>
              <div className="text-slate-700 text-xs tracking-[0.3em] text-center mt-2" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                NO FLOORS WERE HARMED IN THE MAKING OF THIS ESCAPE ROOM
              </div>
              <div className="font-mono text-[8px] text-slate-800 tracking-widest mt-4">
                ERR_ELEVATOR_ESCAPED_SUCCESSFULLY_0x00404
              </div>
            </div>
            <div className="h-screen" />
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="absolute bottom-0 left-0 right-0 h-8 z-50 flex items-center justify-between px-6 bg-black/90 border-t border-primary/10">
        <div className="font-mono text-[8px] text-primary/40 tracking-widest animate-flicker">THE 404TH FLOOR // CREDITS</div>
        <div id="status-txt" className="font-mono text-[8px] text-slate-700 tracking-widest">INITIALIZING...</div>
        <button
          onClick={() => navigate('/')}
          className="font-mono text-[8px] text-slate-700 hover:text-primary transition-colors tracking-widest border border-slate-800 hover:border-primary/30 px-3 py-0.5"
        >
          RESTART
        </button>
      </div>
    </div>
  )
}
