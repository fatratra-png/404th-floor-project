// Affiche le temps de jeu écoulé si dispo
const state = JSON.parse(localStorage.getItem("404floor_progress") || "{}");
if (state.startTime) {
  const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
  const m = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const s = String(elapsed % 60).padStart(2, "0");
  document.getElementById("time-val").textContent = `${m}:${s}`;
}

function restart() {
  localStorage.removeItem("404floor_progress");
  window.location.href = "index.html";
}
// ============================================================
// VICTORY.JS — Générique de fin The 404th Floor
// Cinématique : portes qui s'ouvrent + crédits + musique
// ============================================================

// ── CONFIG : renseignez vos GitHub usernames ──────────────
const TEAM = {
  m1: '@Arch1t3ct',    // System Architect
  m2: '@DesignM2',     // UI/UX Engineer
  m3: '@DevFrontM3',   // Frontend Developer
  m4: '@github_devops' // DevOps Engineer ← TOI, change ici
};

// ─────────────────────────────────────────────────────────
// MUSIC ENGINE — Cyberpunk ambient procedural (Web Audio)
// ─────────────────────────────────────────────────────────
const Music = (() => {
  let ctx = null;
  let masterGain = null;
  let started = false;

  function init() {
    if (started) return;
    started = true;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 4);
    masterGain.connect(ctx.destination);

    playDroneBass();
    playAmbientPad();
    playArpeggio();
    playHihatPulse();
    playDeepKick();
    playGlitchLayer();
    playMelody();
  }

  // ── Convolution reverb (fake — using delay network) ──
  function makeReverb(wet = 0.4) {
    const delay = ctx.createDelay(0.4);
    const fb    = ctx.createGain();
    const out   = ctx.createGain();
    delay.delayTime.value = 0.28;
    fb.gain.value = 0.55;
    out.gain.value = wet;
    delay.connect(fb);
    fb.connect(delay);
    delay.connect(out);
    return { input: delay, output: out };
  }

  // ── Low-pass filter helper ──
  function lpf(freq, q = 1) {
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = freq; f.Q.value = q;
    return f;
  }

  // ── Sub-bass drone ──
  function playDroneBass() {
    // Root note C1 = 32.7 Hz
    [32.7, 65.4, 98.0].forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      const filt = lpf(300, 0.8);
      osc.type = i === 0 ? 'sawtooth' : 'sine';
      osc.frequency.value = freq;
      // Slight detune for fatness
      osc.detune.value = (i - 1) * 4;
      gain.gain.value = i === 0 ? 0.18 : 0.09 - i * 0.02;
      osc.connect(filt); filt.connect(gain); gain.connect(masterGain);
      osc.start();

      // Slow drone modulation
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.05 + i * 0.02;
      lfoGain.gain.value  = freq * 0.008;
      lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
      lfo.start();
    });
  }

  // ── Dark ambient pad (detuned chords) ──
  function playAmbientPad() {
    // Dm chord: D3 F3 A3 C4
    const notes = [146.8, 174.6, 220.0, 261.6];
    notes.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      const filt = lpf(1200, 1.2);
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      osc.detune.value    = i % 2 === 0 ? -8 : 8;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 6);
      // Slow swell
      const lfo  = ctx.createOscillator();
      const lfoG = ctx.createGain();
      lfo.frequency.value = 0.08 + i * 0.012;
      lfoG.gain.value = 0.015;
      lfo.connect(lfoG); lfoG.connect(gain.gain);
      lfo.start();
      osc.connect(filt); filt.connect(gain); gain.connect(masterGain);
      osc.start();
    });
  }

  // ── Arpeggio — cyberpunk 16th note pattern ──
  function playArpeggio() {
    // Pattern over Dm: D4 F4 A4 C5 A4 F4
    const scale = [293.7, 349.2, 440.0, 523.3, 440.0, 349.2, 293.7, 261.6];
    const bpm   = 120;
    const step  = (60 / bpm) / 4; // 16th note
    const rev   = makeReverb(0.3);
    rev.output.connect(masterGain);

    scale.forEach((freq, i) => {
      const t    = ctx.currentTime + 3.5 + i * step;
      const osc  = ctx.createOscillator();
      const env  = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.06, t + 0.01);
      env.gain.exponentialRampToValueAtTime(0.001, t + step * 0.8);
      osc.connect(env); env.connect(rev.input);
      osc.start(t); osc.stop(t + step);
    });

    // Loop arpeggiation
    const loopDur = step * scale.length;
    setTimeout(() => { playArpeggio(); }, loopDur * 1000 + 3500);
  }

  // ── Hi-hat pulse — industrial rhythm ──
  function playHihatPulse() {
    const bpm  = 120;
    const beat = 60 / bpm;
    function hit(t, vol = 0.05) {
      const bufLen = Math.ceil(ctx.sampleRate * 0.04);
      const buf  = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.008));
      const src  = ctx.createBufferSource();
      const filt = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      src.buffer = buf;
      filt.type  = 'highpass'; filt.frequency.value = 8000;
      gain.gain.setValueAtTime(vol, t);
      src.connect(filt); filt.connect(gain); gain.connect(masterGain);
      src.start(t);
    }

    const now = ctx.currentTime + 4;
    for (let i = 0; i < 32; i++) {
      hit(now + i * beat * 0.5, i % 4 === 0 ? 0.08 : 0.03);
    }
    // Loop
    setTimeout(playHihatPulse, (32 * beat * 0.5) * 1000 + 4000);
  }

  // ── Deep kick drum ──
  function playDeepKick() {
    const bpm  = 120;
    const beat = 60 / bpm;
    function kick(t) {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(80, t);
      osc.frequency.exponentialRampToValueAtTime(30, t + 0.15);
      gain.gain.setValueAtTime(0.7, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain); gain.connect(masterGain);
      osc.start(t); osc.stop(t + 0.3);
    }

    const now = ctx.currentTime + 4;
    // 4-on-the-floor
    for (let i = 0; i < 16; i++) {
      kick(now + i * beat);
    }
    setTimeout(playDeepKick, (16 * beat) * 1000 + 4000);
  }

  // ── Glitch layer — random noise bursts ──
  function playGlitchLayer() {
    function burst() {
      if (!ctx) return;
      const t     = ctx.currentTime + Math.random() * 2;
      const dur   = 0.02 + Math.random() * 0.06;
      const bufLen= Math.ceil(ctx.sampleRate * dur);
      const buf   = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data  = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * 0.4;
      const src   = ctx.createBufferSource();
      const filt  = ctx.createBiquadFilter();
      const gain  = ctx.createGain();
      src.buffer  = buf;
      filt.type   = 'bandpass'; filt.frequency.value = 600 + Math.random() * 2000; filt.Q.value = 5;
      gain.gain.setValueAtTime(0.04, t);
      src.connect(filt); filt.connect(gain); gain.connect(masterGain);
      src.start(t);
      setTimeout(burst, 1500 + Math.random() * 3000);
    }
    setTimeout(burst, 5000);
  }

  // ── Haunting melody — slow 8th notes ──
  function playMelody() {
    // Minor pentatonic: D4 F4 G4 A4 C5
    const mel   = [293.7, 349.2, 392.0, 440.0, 523.3, 440.0, 392.0, 349.2, 293.7, 261.6, 293.7, 349.2];
    const bpm   = 120;
    const dur   = 60 / bpm; // 8th note
    const rev   = makeReverb(0.5);
    rev.output.connect(masterGain);

    mel.forEach((freq, i) => {
      if (Math.random() > 0.65) return; // sparse
      const t   = ctx.currentTime + 8 + i * dur;
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type  = 'sine';
      osc.frequency.value = freq;
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.07, t + 0.08);
      env.gain.exponentialRampToValueAtTime(0.001, t + dur * 1.6);
      osc.connect(env); env.connect(rev.input);
      osc.start(t); osc.stop(t + dur * 2);
    });

    const loopDur = mel.length * dur;
    setTimeout(playMelody, (loopDur + 8) * 1000);
  }

  function fadeOut() {
    if (!masterGain) return;
    masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
  }

  return { init, fadeOut };
})();


// ─────────────────────────────────────────────────────────
// CREDITS SCROLL ENGINE
// ─────────────────────────────────────────────────────────
const Credits = (() => {
  let startTime   = null;
  let scrollEl    = null;
  let totalH      = 0;
  let viewH       = 0;
  const DURATION  = 42000; // ms — full scroll duration

  function init() {
    scrollEl = document.getElementById('credits-scroll');
    viewH    = window.innerHeight;
    totalH   = scrollEl.scrollHeight;
  }

  function start() {
    if (!scrollEl) init();
    startTime = performance.now();
    requestAnimationFrame(tick);
  }

  function tick(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / DURATION, 1);
    // Ease-in start, ease-out end
    const eased    = easeInOut(progress);
    const travel   = viewH + totalH; // from below viewport to above
    scrollEl.style.transform = `translateY(${-eased * travel}px)`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  function easeInOut(t) {
    // Slow start, linear middle, slow end
    if (t < 0.05) return t * t * (1 / 0.0025) * 0.05 * 0.1;
    if (t > 0.92) {
      const r = (t - 0.92) / 0.08;
      return 1 - r * r * 0.08;
    }
    return t;
  }

  return { init, start };
})();


// ─────────────────────────────────────────────────────────
// DOOR CINEMATIC
// ─────────────────────────────────────────────────────────
const Cinema = (() => {
  const doorL    = document.getElementById('door-L');
  const doorR    = document.getElementById('door-R');
  const corridor = document.getElementById('corridor');
  const credWrap = document.getElementById('credits-wrap');
  const gapGlow  = document.getElementById('gap-glow');
  const statusTxt= document.getElementById('status-txt');

  function setStatus(txt) {
    if (statusTxt) statusTxt.textContent = txt;
  }

  // Rattle effect before opening
  function rattle(el, cb) {
    let i = 0;
    const frames = [
      'translateX(-3px)', 'translateX(3px)', 'translateX(-4px)',
      'translateX(4px)',  'translateX(-2px)', 'translateX(2px)',
      'translateX(0)'
    ];
    const id = setInterval(() => {
      el.style.transform = frames[i % frames.length];
      i++;
      if (i >= frames.length * 3) { clearInterval(id); if (cb) cb(); }
    }, 60);
  }

  // Floor number counter animation
  function animateFloor(targetEl, from, to, duration) {
    const start = performance.now();
    const tick  = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const val = Math.round(from + (to - from) * t);
      targetEl.textContent = val;
      if (t < 1) requestAnimationFrame(tick);
      else targetEl.textContent = to;
    };
    requestAnimationFrame(tick);
  }

  async function run() {
    // ── Phase 0: Populate team names ──
    document.getElementById('name-m1').textContent = TEAM.m1;
    document.getElementById('name-m2').textContent = TEAM.m2;
    document.getElementById('name-m3').textContent = TEAM.m3;
    document.getElementById('name-m4').textContent = TEAM.m4;

    // ── Phase 1: Warning flash (0–1.5s) ──
    setStatus('DOORS INITIALIZING...');
    await wait(800);

    setStatus('MOTOR ENGAGED');
    await wait(700);

    // ── Phase 2: Rattle (1.5–3s) ──
    setStatus('UNLOCKING...');
    await new Promise(resolve => {
      rattle(doorL, null);
      rattle(doorR, resolve);
    });

    // ── Phase 3: Gap glow intensifies ──
    gapGlow.style.filter = 'blur(6px) brightness(1.5)';
    await wait(200);

    // ── Phase 4: Doors slide open (3–5.5s) ──
    setStatus('DOORS OPENING');
    doorL.style.transition = 'transform 2.4s cubic-bezier(0.7,0,0.3,1)';
    doorR.style.transition = 'transform 2.4s cubic-bezier(0.7,0,0.3,1)';
    doorL.style.transform  = 'translateX(-100%)';
    doorR.style.transform  = 'translateX(100%)';

    // Reveal corridor while doors open
    corridor.style.transition = 'opacity 1.8s ease 0.6s';
    corridor.style.opacity    = '1';

    // Animate floor number going up
    await wait(300);

    // Floor counter (404 → 405)
    const numEl = document.querySelector('.floor-indicator');
    // Floor counter animation (if element exists)
    if (numEl) animateFloor(numEl, 404, 405, 1800);

    await wait(1400);
    setStatus('FLOOR 405 REACHED');

    await wait(1200);

    // ── Phase 5: Show credits ──
    setStatus('CREDITS ROLLING...');
    credWrap.style.transition = 'opacity 1.2s ease';
    credWrap.style.opacity    = '1';
    credWrap.style.pointerEvents = 'auto';

    // Start music + scroll
    Music.init();
    Credits.start();

    // Fade gap glow
    gapGlow.style.transition = 'opacity 2s ease';
    gapGlow.style.opacity    = '0';

    // Skip button visible
    const skipBtn = document.getElementById('skip-btn');
    if (skipBtn) {
      skipBtn.style.opacity = '1';
    }
  }

  return { run };
})();


// ─────────────────────────────────────────────────────────
// PARTICLES (floating dust in corridor)
// ─────────────────────────────────────────────────────────
function spawnParticles() {
  const container = document.getElementById('corridor');
  if (!container) return;

  function createParticle() {
    const p = document.createElement('div');
    const x = Math.random() * 100;
    const size = 1 + Math.random() * 2;
    const dur  = 6 + Math.random() * 10;
    const delay= Math.random() * 5;

    p.style.cssText = `
      position:absolute;
      left:${x}%;
      bottom:-4px;
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      background:rgba(19,91,236,${0.2 + Math.random() * 0.4});
      pointer-events:none;
      animation:particleRise ${dur}s ease-in ${delay}s infinite;
    `;
    container.appendChild(p);
    setTimeout(() => { if (p.parentNode) p.parentNode.removeChild(p); }, (dur + delay + 1) * 1000 * 3);
  }

  // Inject particle keyframe once
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleRise {
      0%   { transform:translateY(0) translateX(0) scale(1); opacity:0; }
      10%  { opacity:1; }
      90%  { opacity:0.3; }
      100% { transform:translateY(-60vh) translateX(${Math.random() > 0.5 ? '' : '-'}${Math.random()*40}px) scale(0.3); opacity:0; }
    }
  `;
  document.head.appendChild(style);

  for (let i = 0; i < 30; i++) createParticle();
  setInterval(() => { createParticle(); }, 600);
}


// ─────────────────────────────────────────────────────────
// SKIP BUTTON
// ─────────────────────────────────────────────────────────
function setupSkip() {
  const btn = document.getElementById('skip-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      Music.fadeOut();
      setTimeout(() => { window.location.href = 'index.html'; }, 800);
    });
  }
}


// ─────────────────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────────────────
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// ─────────────────────────────────────────────────────────
// BOOT
// ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Inject skip button if not in HTML
  if (!document.getElementById('skip-btn')) {
    const btn = document.createElement('button');
    btn.id = 'skip-btn';
    btn.className = 'absolute bottom-10 right-8 z-50 opacity-0 font-mono text-xs text-slate-600 border border-slate-800 px-4 py-2 hover:text-primary hover:border-primary/40 transition-all tracking-widest';
    btn.style.transition = 'opacity 0.5s ease';
    btn.textContent = '[ SKIP → RESTART ]';
    document.getElementById('scene').appendChild(btn);
    setTimeout(() => { btn.style.opacity = '1'; }, 6000);
  }

  setupSkip();
  Credits.init();
  spawnParticles();

  // Small delay so fonts/assets load then start the cinematic
  setTimeout(() => {
    Cinema.run();
  }, 600);
});