import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getState,
  isCompleted,
  isFloorUnlocked,
  resetProgress,
  getCompletedCount,
  getScore,
} from "../lib/gameLogic";
import { LEVELS } from "../lib/levels";

const floors = LEVELS.map((l) => ({
  num: l.id,
  name: l.name,
  desc: l.challenge,
}));

export default function ElevatorHub() {
  const navigate = useNavigate();
  const [glitching, setGlitching] = useState(false);
  const state = getState();
  const hasStarted = Object.keys(state).some((k) => k.startsWith("floor"));
  const done = getCompletedCount();
  const score = getScore();

  const handleFloorClick = (num: number) => {
    if (isFloorUnlocked(num)) navigate(`/floor/${num}`);
  };

  const handleStart = () => {
    setGlitching(true);
    setTimeout(() => {
      setGlitching(false);
      navigate("/floor/1");
    }, 1200);
  };

  return (
    <div
      className={`min-h-screen bg-background-dark text-slate-100 font-display overflow-hidden relative ${glitching ? "glitch-active" : ""}`}
    >
      {glitching && <GlitchOverlay />}

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0a1628_0%,_#000000_80%)]" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-cyan-500/[0.04] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-fuchsia-500/[0.04] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      </div>

      <header className="relative z-50 bg-black/70 backdrop-blur-xl border-b border-cyan-500/20 px-4 md:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="material-symbols-outlined text-cyan-400 text-2xl"
            style={{ textShadow: "0 0 10px rgba(6,182,212,0.5)" }}
          >
            elevator
          </span>
          <div>
            <h1
              className="text-white text-base font-bold tracking-tight"
              style={{ fontFamily: "'Orbitron', monospace" }}
            >
              ELEVATOR HUB
            </h1>
            <p className="text-[10px] text-cyan-400/60 font-mono tracking-wider">
              SYS.VER.4.0.4 // CYBERDOME
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
            <span className="text-[9px] font-mono text-cyan-400/60">SCORE</span>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              {score.toLocaleString()}
            </span>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400/60">
            <span
              className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"
              style={{ boxShadow: "0 0 6px rgba(6,182,212,0.8)" }}
            />
            SYS ONLINE
          </span>
          <button
            onClick={() => {
              resetProgress();
              window.location.reload();
            }}
            className="bg-white/[0.06] hover:bg-white/[0.12] transition-colors p-1.5 rounded-lg text-white/60"
            title="Reset Progress"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
          </button>
        </div>
      </header>

      <main className="relative h-[calc(100vh-3.5rem)] flex flex-col md:flex-row z-10">
        <section className="relative flex-1 flex flex-col items-center justify-center p-4 md:p-8">
          <div className="absolute top-6 left-6 w-56 bg-black/60 backdrop-blur-lg rounded-xl border border-cyan-500/20 overflow-hidden hidden md:block">
            <div className="bg-cyan-500/10 px-2.5 py-1 flex items-center justify-between border-b border-cyan-500/20">
              <span className="text-[9px] text-cyan-400/60 font-mono">
                TERM_01
              </span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500/50" />
              </div>
            </div>
            <div className="p-3 h-24 bg-black/60 font-mono text-[10px]">
              <div className="text-cyan-400">&gt; SYSTEM_INITIALIZED</div>
              <div className="text-fuchsia-400">
                &gt; NEURAL_INTERFACE_ACTIVE
              </div>
              <div className="text-white/40">&gt; Loading floor modules...</div>
              <div className="text-white/40 animate-pulse">
                &gt; {done}/404 floors resolved_
              </div>
            </div>
          </div>

          <div className="relative flex flex-col items-center gap-6">
            <div
              className="text-cyan-400/40 text-xs font-mono tracking-[0.4em] uppercase"
              style={{ textShadow: "0 0 10px rgba(6,182,212,0.3)" }}
            >
              Will you able to reach the Floor
            </div>
            <h1
              className="text-[100px] md:text-[180px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-fuchsia-500 glitch-text tracking-tighter"
              data-text="404"
              style={{
                textShadow:
                  "0 0 30px rgba(6,182,212,0.3), 0 0 60px rgba(217,70,239,0.2)",
              }}
            >
              404
            </h1>

            {!hasStarted ? (
              <button
                onClick={handleStart}
                disabled={glitching}
                className="group relative px-10 py-3 bg-cyan-500/20 backdrop-blur-lg hover:bg-cyan-500/30 border border-cyan-400/30 rounded-xl font-bold text-white text-lg tracking-widest transition-all disabled:opacity-50"
                style={{ boxShadow: "0 0 20px rgba(6,182,212,0.2)" }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl">
                    play_arrow
                  </span>
                  INITIALIZE
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-1.5 bg-fuchsia-500/10 backdrop-blur-lg border border-fuchsia-500/20 rounded-xl text-fuchsia-400 font-mono text-xs">
                <span className="material-symbols-outlined text-sm animate-pulse">
                  warning
                </span>
                ELEVATOR ACTIVE — {done}/404 COMPLETE
              </div>
            )}
          </div>

          <div className="absolute bottom-6 left-6 flex flex-col gap-1.5">
            <span className="text-[9px] uppercase text-cyan-400/30 font-bold tracking-widest">
              Neural Link
            </span>
            <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-lg border border-cyan-400/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-cyan-400/40 text-lg">
                podcasts
              </span>
            </div>
          </div>
        </section>

        <aside className="w-full md:w-72 h-auto md:h-full bg-black/40 backdrop-blur-xl border-l border-cyan-500/20 flex flex-col">
          <div className="px-5 py-4 border-b border-cyan-500/20">
            <div className="flex items-center justify-between">
              <h2
                className="text-white text-sm font-bold tracking-tight"
                style={{ fontFamily: "'Orbitron', monospace" }}
              >
                FLOORS
              </h2>
              <span className="text-[10px] font-mono text-cyan-400/50">
                {done}/{floors.length}
              </span>
            </div>
            <div className="mt-2 h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 rounded-full transition-all"
                style={{ width: `${(done / floors.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
            {floors.map((f) => {
              const completed = isCompleted(f.num);
              const unlocked = isFloorUnlocked(f.num);
              const active = !hasStarted && f.num === 1;
              return (
                <button
                  key={f.num}
                  onClick={() => handleFloorClick(f.num)}
                  disabled={!unlocked}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${
                    completed
                      ? "bg-green-500/10 text-green-400"
                      : unlocked
                        ? "bg-white/[0.04] hover:bg-white/[0.08] text-cyan-400 cursor-pointer"
                        : "text-white/20 cursor-not-allowed"
                  } ${active ? "ring-1 ring-cyan-400/30 animate-pulse" : ""}`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                      completed
                        ? "bg-green-500/20 text-green-400"
                        : unlocked
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "bg-white/[0.04] text-white/20"
                    }`}
                  >
                    {completed ? "✓" : f.num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-xs font-bold truncate ${
                        completed
                          ? "text-green-400"
                          : unlocked
                            ? "text-white/80"
                            : "text-white/20"
                      }`}
                    >
                      {f.name}
                    </div>
                    <div
                      className={`text-[10px] font-mono truncate ${
                        completed
                          ? "text-green-400/50"
                          : unlocked
                            ? "text-white/40"
                            : "text-white/15"
                      }`}
                    >
                      {completed ? "COMPLETED" : unlocked ? f.desc : "LOCKED"}
                    </div>
                  </div>
                  <span
                    className={`material-symbols-outlined text-sm ${
                      completed
                        ? "text-green-400"
                        : unlocked
                          ? "text-cyan-400/30"
                          : "text-white/10"
                    }`}
                  >
                    {completed
                      ? "check_circle"
                      : unlocked
                        ? "lock_open"
                        : "lock"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="px-5 py-3 border-t border-cyan-500/20">
            <button
              onClick={() => navigate("/")}
              className="w-full py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-cyan-500/20 text-white/40 hover:text-white/70 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Return to Hub
            </button>
          </div>
        </aside>
      </main>

      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.85)] z-40" />
    </div>
  );
}

function GlitchOverlay() {
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div className="absolute inset-0 bg-white/10 animate-[glitchFlash_0.1s_ease-in-out_3]" />
      <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay animate-[glitchShift_0.05s_ease-in-out_8]" />
      <div
        className="absolute inset-0 bg-fuchsia-500/10 mix-blend-screen animate-[glitchShift_0.04s_ease-in-out_6]"
        style={{ clipPath: "inset(20% 0 60% 0)" }}
      />
      <div
        className="absolute inset-0 bg-cyan-300/10 mix-blend-screen animate-[glitchShift_0.06s_ease-in-out_5] delay-75"
        style={{ clipPath: "inset(60% 0 15% 0)" }}
      />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.3)_2px,rgba(0,0,0,0.3)_4px)]" />
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22%3E%3C/rect%3E%3C/svg%3E")',
          backgroundSize: "150px 150px",
        }}
      />
      <style>{`
        @keyframes glitchFlash {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        @keyframes glitchShift {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px) skewX(2deg); }
          75% { transform: translateX(3px) skewX(-1deg); }
        }
        .glitch-active { animation: glitchShake 0.1s ease-in-out 8; }
        @keyframes glitchShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px) rotate(-0.5deg); }
          75% { transform: translateX(2px) rotate(0.5deg); }
        }
      `}</style>
    </div>
  );
}
