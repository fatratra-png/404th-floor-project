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

    // ─────────────────────────────────────────
    // FLOOR 2 — Access Terminal
    // ─────────────────────────────────────────

    // ACCESS GRANTED → ascenseur qui bouge
    elevator_move: () => {
      if (muted) return;
      const ac = getCtx();

      // Rumble mécanique grave — moteur qui tourne
      const rumbleOsc = ac.createOscillator();
      const rumbleGain = ac.createGain();
      rumbleOsc.type = 'sawtooth';
      rumbleOsc.frequency.setValueAtTime(48, ac.currentTime);
      rumbleOsc.frequency.linearRampToValueAtTime(55, ac.currentTime + 1.5);
      rumbleOsc.frequency.linearRampToValueAtTime(50, ac.currentTime + 3.5);
      rumbleGain.gain.setValueAtTime(0, ac.currentTime);
      rumbleGain.gain.linearRampToValueAtTime(0.35, ac.currentTime + 0.3);
      rumbleGain.gain.setValueAtTime(0.35, ac.currentTime + 3.0);
      rumbleGain.gain.linearRampToValueAtTime(0, ac.currentTime + 4.0);
      rumbleOsc.connect(rumbleGain);
      rumbleGain.connect(ac.destination);
      rumbleOsc.start(ac.currentTime);
      rumbleOsc.stop(ac.currentTime + 4.2);

      // Vibration tremblante — câbles tendus
      const vibraOsc = ac.createOscillator();
      const vibraGain = ac.createGain();
      vibraOsc.type = 'sine';
      vibraOsc.frequency.setValueAtTime(120, ac.currentTime);
      vibraOsc.frequency.setValueAtTime(118, ac.currentTime + 0.5);
      vibraOsc.frequency.setValueAtTime(122, ac.currentTime + 1.0);
      vibraOsc.frequency.setValueAtTime(116, ac.currentTime + 1.8);
      vibraOsc.frequency.setValueAtTime(124, ac.currentTime + 2.5);
      vibraGain.gain.setValueAtTime(0, ac.currentTime);
      vibraGain.gain.linearRampToValueAtTime(0.12, ac.currentTime + 0.4);
      vibraGain.gain.setValueAtTime(0.12, ac.currentTime + 3.2);
      vibraGain.gain.linearRampToValueAtTime(0, ac.currentTime + 4.0);
      vibraOsc.connect(vibraGain);
      vibraGain.connect(ac.destination);
      vibraOsc.start(ac.currentTime);
      vibraOsc.stop(ac.currentTime + 4.2);

      // Ding d'arrivée à la fin
      const dingOsc = ac.createOscillator();
      const dingGain = ac.createGain();
      dingOsc.type = 'sine';
      dingOsc.frequency.setValueAtTime(1047, ac.currentTime + 3.6);
      dingGain.gain.setValueAtTime(0, ac.currentTime + 3.6);
      dingGain.gain.linearRampToValueAtTime(0.5, ac.currentTime + 3.65);
      dingGain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 4.5);
      dingOsc.connect(dingGain);
      dingGain.connect(ac.destination);
      dingOsc.start(ac.currentTime + 3.6);
      dingOsc.stop(ac.currentTime + 4.6);

      // Claquement mécanique de démarrage
      const bufferSize = ac.sampleRate * 0.12;
      const noiseBuffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
      }
      const noiseSource = ac.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      const noiseFilter = ac.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 300;
      noiseFilter.Q.value = 0.8;
      const noiseGain = ac.createGain();
      noiseGain.gain.setValueAtTime(0.6, ac.currentTime);
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ac.destination);
      noiseSource.start(ac.currentTime);
    },

    // ACCESS DENIED → câble qui menace de lâcher
    cable_stress: () => {
      if (muted) return;
      const ac = getCtx();

      // Craquement de câble métallique tendu
      const bufferSize = ac.sampleRate * 0.6;
      const noiseBuffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const t = i / ac.sampleRate;
        const crack = Math.random() < 0.003 ? (Math.random() * 2 - 1) * 3.0 : 0;
        data[i] = ((Math.random() * 2 - 1) * 0.15 + crack) * Math.exp(-t * 2.5);
      }
      const crackSource = ac.createBufferSource();
      crackSource.buffer = noiseBuffer;
      const crackFilter = ac.createBiquadFilter();
      crackFilter.type = 'highpass';
      crackFilter.frequency.value = 800;
      const crackGain = ac.createGain();
      crackGain.gain.setValueAtTime(0.7, ac.currentTime);
      crackSource.connect(crackFilter);
      crackFilter.connect(crackGain);
      crackGain.connect(ac.destination);
      crackSource.start(ac.currentTime);

      // Grincement métallique grave
      const groanOsc = ac.createOscillator();
      const groanGain = ac.createGain();
      groanOsc.type = 'sawtooth';
      groanOsc.frequency.setValueAtTime(85, ac.currentTime);
      groanOsc.frequency.linearRampToValueAtTime(60, ac.currentTime + 0.4);
      groanOsc.frequency.linearRampToValueAtTime(95, ac.currentTime + 0.7);
      groanGain.gain.setValueAtTime(0, ac.currentTime);
      groanGain.gain.linearRampToValueAtTime(0.28, ac.currentTime + 0.05);
      groanGain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.8);
      groanOsc.connect(groanGain);
      groanGain.connect(ac.destination);
      groanOsc.start(ac.currentTime);
      groanOsc.stop(ac.currentTime + 0.85);

      // Vibration aiguë de câble (comme une corde qui claque)
      const twangOsc = ac.createOscillator();
      const twangGain = ac.createGain();
      twangOsc.type = 'sine';
      twangOsc.frequency.setValueAtTime(340, ac.currentTime + 0.05);
      twangOsc.frequency.exponentialRampToValueAtTime(180, ac.currentTime + 0.5);
      twangGain.gain.setValueAtTime(0, ac.currentTime + 0.05);
      twangGain.gain.linearRampToValueAtTime(0.22, ac.currentTime + 0.08);
      twangGain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.55);
      twangOsc.connect(twangGain);
      twangGain.connect(ac.destination);
      twangOsc.start(ac.currentTime + 0.05);
      twangOsc.stop(ac.currentTime + 0.6);

      // Choc sourd — structure qui absorbe le stress
      const thudOsc = ac.createOscillator();
      const thudGain = ac.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(55, ac.currentTime + 0.02);
      thudOsc.frequency.exponentialRampToValueAtTime(28, ac.currentTime + 0.25);
      thudGain.gain.setValueAtTime(0.5, ac.currentTime + 0.02);
      thudGain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.3);
      thudOsc.connect(thudGain);
      thudGain.connect(ac.destination);
      thudOsc.start(ac.currentTime + 0.02);
      thudOsc.stop(ac.currentTime + 0.35);
    },

    // ─────────────────────────────────────────
    // FLOOR 3 — Emergency Brake
    // ─────────────────────────────────────────

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

    // ─────────────────────────────────────────
    // FLOOR 4 — Final Debug
    // ─────────────────────────────────────────

    bug_spawn: () => {
      beep({ frequency: 200, type: 'sawtooth', duration: 0.08, gain: 0.2 });
      beep({ frequency: 150, type: 'square',   duration: 0.05, gain: 0.15, delay: 0.05 });
    },

    bug_kill: () => {
      beep({ frequency: 600, type: 'sine',   duration: 0.06, gain: 0.3 });
      beep({ frequency: 300, type: 'square', duration: 0.08, gain: 0.2, delay: 0.04 });
    },

    // ─────────────────────────────────────────
    // GLOBAL
    // ─────────────────────────────────────────

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
    if (muted) return;
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