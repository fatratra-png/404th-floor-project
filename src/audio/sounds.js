const Sounds = (() => {
  let ctx = null;
  let muted = false;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  function beep({ frequency = 440, type = 'sine', duration = 0.1,
                  gain = 0.3, rampDown = true, delay = 0 } = {}) {
    if (muted) return;
    const ac = getCtx();
    const osc = ac.createOscillator();
    const vol = ac.createGain();

    osc.connect(vol);
    vol.connect(ac.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ac.currentTime + delay);
    vol.gain.setValueAtTime(gain, ac.currentTime + delay);

    if (rampDown) {
      vol.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duration);
    }

    osc.start(ac.currentTime + delay);
    osc.stop(ac.currentTime + delay + duration + 0.01);
  }

  const library = {

    // --- FLOOR 3 ---
    brake_press: () => {
      beep({ frequency: 180, type: 'sawtooth', duration: 0.05, gain: 0.4 });
    },

    alarm: () => {
      for (let i = 0; i < 3; i++) {
        beep({ frequency: 880, type: 'square', duration: 0.15, gain: 0.3, delay: i * 0.2 });
        beep({ frequency: 660, type: 'square', duration: 0.15, gain: 0.3, delay: i * 0.2 + 0.15 });
      }
    },

    tick: () => {
      beep({ frequency: 1200, type: 'sine', duration: 0.03, gain: 0.1 });
    },

    // --- FLOOR 4 ---
    bug_spawn: () => {
      beep({ frequency: 200, type: 'sawtooth', duration: 0.08, gain: 0.2 });
      beep({ frequency: 150, type: 'square',   duration: 0.05, gain: 0.15, delay: 0.05 });
    },

    bug_kill: () => {
      beep({ frequency: 600, type: 'sine',   duration: 0.06, gain: 0.3 });
      beep({ frequency: 300, type: 'square', duration: 0.08, gain: 0.2, delay: 0.04 });
    },

    // --- GLOBAL ---
    floor_complete: () => {
      [523, 659, 784, 1047].forEach((f, i) => {
        beep({ frequency: f, type: 'sine', duration: 0.2, gain: 0.35, delay: i * 0.12 });
      });
    },

    victory: () => {
      const melody = [523, 659, 784, 1047, 784, 1047, 1319];
      melody.forEach((f, i) => {
        beep({ frequency: f, type: 'sine', duration: 0.25, gain: 0.4, delay: i * 0.15 });
      });
    },

    elevator_ding: () => {
      beep({ frequency: 1047, type: 'sine', duration: 0.4, gain: 0.5 });
      beep({ frequency: 1319, type: 'sine', duration: 0.3, gain: 0.3, delay: 0.15 });
    },

    error_buzz: () => {
      beep({ frequency: 100, type: 'sawtooth', duration: 0.3, gain: 0.5 });
    },

    keyclick: () => {
      beep({ frequency: 800, type: 'square', duration: 0.02, gain: 0.15 });
    },
  };

  function play(name) {
    if (library[name]) {
      try { library[name](); }
      catch(e) { console.warn('Sound error:', e); }
    }
  }

  function toggleMute() {
    muted = !muted;
    return muted;
  }

  function unlock() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  document.addEventListener('click',   unlock);
  document.addEventListener('keydown', unlock);

  return { play, toggleMute };
})();