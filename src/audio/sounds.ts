let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return ctx;
}

function beep({ frequency = 440, type = 'sine', duration = 0.1, gain = 0.3, rampDown = true, delay = 0 } = {}) {
  if (muted) return;
  const ac = getCtx();
  const osc = ac.createOscillator();
  const vol = ac.createGain();
  osc.connect(vol);
  vol.connect(ac.destination);
  osc.type = type as OscillatorType;
  osc.frequency.setValueAtTime(frequency, ac.currentTime + delay);
  vol.gain.setValueAtTime(gain, ac.currentTime + delay);
  if (rampDown) {
    vol.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duration);
  }
  osc.start(ac.currentTime + delay);
  osc.stop(ac.currentTime + delay + duration + 0.01);
}

const library: Record<string, () => void> = {
  elevator_fall: () => {
    if (muted) return;
    const ac = getCtx();
    const chocBuf = ac.createBuffer(1, Math.ceil(ac.sampleRate * 0.08), ac.sampleRate);
    const chocData = chocBuf.getChannelData(0);
    for (let i = 0; i < chocData.length; i++) {
      chocData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ac.sampleRate * 0.012));
    }
    const chocSrc = ac.createBufferSource();
    chocSrc.buffer = chocBuf;
    const chocFilter = ac.createBiquadFilter();
    chocFilter.type = 'lowpass';
    chocFilter.frequency.value = 280;
    const chocGain = ac.createGain();
    chocGain.gain.setValueAtTime(1.8, ac.currentTime);
    chocSrc.connect(chocFilter);
    chocFilter.connect(chocGain);
    chocGain.connect(ac.destination);
    chocSrc.start(ac.currentTime);

    const fallOsc = ac.createOscillator();
    fallOsc.type = 'sawtooth';
    fallOsc.frequency.setValueAtTime(38, ac.currentTime + 0.05);
    fallOsc.frequency.linearRampToValueAtTime(22, ac.currentTime + 1.2);
    const fallGain = ac.createGain();
    fallGain.gain.setValueAtTime(0, ac.currentTime + 0.05);
    fallGain.gain.linearRampToValueAtTime(0.5, ac.currentTime + 0.15);
    fallGain.gain.linearRampToValueAtTime(0.6, ac.currentTime + 0.9);
    fallGain.gain.linearRampToValueAtTime(0, ac.currentTime + 1.3);
    fallOsc.connect(fallGain);
    fallGain.connect(ac.destination);
    fallOsc.start(ac.currentTime + 0.05);
    fallOsc.stop(ac.currentTime + 1.35);
  },

  elevator_rise: () => {
    if (muted) return;
    const ac = getCtx();
    const startOsc = ac.createOscillator();
    startOsc.type = 'sawtooth';
    startOsc.frequency.setValueAtTime(28, ac.currentTime);
    startOsc.frequency.linearRampToValueAtTime(18, ac.currentTime + 0.3);
    startOsc.frequency.linearRampToValueAtTime(45, ac.currentTime + 0.7);
    const startGain = ac.createGain();
    startGain.gain.setValueAtTime(0.4, ac.currentTime);
    startGain.gain.linearRampToValueAtTime(0.25, ac.currentTime + 0.3);
    startGain.gain.linearRampToValueAtTime(0.5, ac.currentTime + 0.7);
    startOsc.connect(startGain);
    startGain.connect(ac.destination);
    startOsc.start(ac.currentTime);
    startOsc.stop(ac.currentTime + 0.75);

    const motorOsc = ac.createOscillator();
    motorOsc.type = 'sawtooth';
    motorOsc.frequency.setValueAtTime(48, ac.currentTime + 0.7);
    motorOsc.frequency.linearRampToValueAtTime(62, ac.currentTime + 1.5);
    motorOsc.frequency.setValueAtTime(55, ac.currentTime + 2.0);
    motorOsc.frequency.linearRampToValueAtTime(65, ac.currentTime + 2.8);
    motorOsc.frequency.linearRampToValueAtTime(60, ac.currentTime + 3.8);
    const motorGain = ac.createGain();
    motorGain.gain.setValueAtTime(0, ac.currentTime + 0.7);
    motorGain.gain.linearRampToValueAtTime(0.38, ac.currentTime + 1.0);
    motorGain.gain.setValueAtTime(0.38, ac.currentTime + 3.5);
    motorGain.gain.linearRampToValueAtTime(0, ac.currentTime + 4.2);
    motorOsc.connect(motorGain);
    motorGain.connect(ac.destination);
    motorOsc.start(ac.currentTime + 0.7);
    motorOsc.stop(ac.currentTime + 4.25);
  },

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

  bug_spawn: () => {
    beep({ frequency: 200, type: 'sawtooth', duration: 0.08, gain: 0.2 });
    beep({ frequency: 150, type: 'square', duration: 0.05, gain: 0.15, delay: 0.05 });
  },

  bug_kill: () => {
    beep({ frequency: 600, type: 'sine', duration: 0.06, gain: 0.3 });
    beep({ frequency: 300, type: 'square', duration: 0.08, gain: 0.2, delay: 0.04 });
  },

  floor_complete: () => {
    [523, 659, 784, 1047].forEach((f, i) => {
      beep({ frequency: f, type: 'sine', duration: 0.2, gain: 0.35, delay: i * 0.12 });
    });
  },

  victory: () => {
    [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => {
      beep({ frequency: f, type: 'sine', duration: 0.25, gain: 0.4, delay: i * 0.15 });
    });
  },

  keyclick: () => {
    beep({ frequency: 800, type: 'square', duration: 0.02, gain: 0.15 });
  },

  mem_fail: () => {
    beep({ frequency: 200, type: 'square', duration: 0.3, gain: 0.4 });
  },

  mem_success: () => {
    beep({ frequency: 600, type: 'sine', duration: 0.1, gain: 0.3, delay: 0 });
    beep({ frequency: 800, type: 'sine', duration: 0.1, gain: 0.3, delay: 0.1 });
  },

  wire_cut: () => {
    beep({ frequency: 300, type: 'sawtooth', duration: 0.15, gain: 0.3 });
  },

  core_phase: () => {
    beep({ frequency: 400, type: 'sine', duration: 0.2, gain: 0.3 });
    beep({ frequency: 600, type: 'sine', duration: 0.2, gain: 0.3, delay: 0.15 });
    beep({ frequency: 800, type: 'sine', duration: 0.2, gain: 0.3, delay: 0.3 });
  },
};

export const Sounds = {
  play(name: string) {
    if (muted) return;
    if (library[name]) {
      try { library[name](); } catch { /* ignore */ }
    }
  },
  toggleMute() {
    muted = !muted;
    return muted;
  },
  unlock() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  },
};
