const Sounds = (() => {
  let ctx = null;
  let muted = false;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  function beep({
    frequency = 440,
    type = "sine",
    duration = 0.1,
    gain = 0.3,
    rampDown = true,
    delay = 0,
  } = {}) {
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
      vol.gain.exponentialRampToValueAtTime(
        0.001,
        ac.currentTime + delay + duration,
      );
    }
    osc.start(ac.currentTime + delay);
    osc.stop(ac.currentTime + delay + duration + 0.01);
  }

  const library = {
    // ─────────────────────────────────────────────────────────────
    // FLOOR 2 — ACCESS DENIED : ascenseur qui TOMBE
    // ─────────────────────────────────────────────────────────────
    elevator_fall: () => {
      if (muted) return;
      const ac = getCtx();

      // 1. CHOC initial — câble qui lâche brutalement
      const chocBuf = ac.createBuffer(
        1,
        Math.ceil(ac.sampleRate * 0.08),
        ac.sampleRate,
      );
      const chocData = chocBuf.getChannelData(0);
      for (let i = 0; i < chocData.length; i++) {
        chocData[i] =
          (Math.random() * 2 - 1) * Math.exp(-i / (ac.sampleRate * 0.012));
      }
      const chocSrc = ac.createBufferSource();
      chocSrc.buffer = chocBuf;
      const chocFilter = ac.createBiquadFilter();
      chocFilter.type = "lowpass";
      chocFilter.frequency.value = 280;
      const chocGain = ac.createGain();
      chocGain.gain.setValueAtTime(1.8, ac.currentTime);
      chocSrc.connect(chocFilter);
      chocFilter.connect(chocGain);
      chocGain.connect(ac.destination);
      chocSrc.start(ac.currentTime);

      // 2. CHUTE — moteur grave en accélération descendante
      const fallOsc = ac.createOscillator();
      fallOsc.type = "sawtooth";
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

      // 3. WHOOSH d'air — bruit qui monte en intensité
      const airBuf = ac.createBuffer(
        1,
        Math.ceil(ac.sampleRate * 1.4),
        ac.sampleRate,
      );
      const airData = airBuf.getChannelData(0);
      for (let i = 0; i < airData.length; i++)
        airData[i] = Math.random() * 2 - 1;
      const airSrc = ac.createBufferSource();
      airSrc.buffer = airBuf;
      const airFilter = ac.createBiquadFilter();
      airFilter.type = "bandpass";
      airFilter.frequency.setValueAtTime(500, ac.currentTime + 0.08);
      airFilter.frequency.linearRampToValueAtTime(1100, ac.currentTime + 1.2);
      airFilter.Q.value = 0.6;
      const airGain = ac.createGain();
      airGain.gain.setValueAtTime(0, ac.currentTime + 0.08);
      airGain.gain.linearRampToValueAtTime(0.2, ac.currentTime + 0.3);
      airGain.gain.linearRampToValueAtTime(0.28, ac.currentTime + 1.0);
      airGain.gain.linearRampToValueAtTime(0, ac.currentTime + 1.4);
      airSrc.connect(airFilter);
      airFilter.connect(airGain);
      airGain.connect(ac.destination);
      airSrc.start(ac.currentTime + 0.08);

      // 4. IMPACT en bas — boom sourd
      const boomOsc = ac.createOscillator();
      boomOsc.type = "sine";
      boomOsc.frequency.setValueAtTime(65, ac.currentTime + 1.3);
      boomOsc.frequency.exponentialRampToValueAtTime(18, ac.currentTime + 1.9);
      const boomGain = ac.createGain();
      boomGain.gain.setValueAtTime(0, ac.currentTime + 1.3);
      boomGain.gain.linearRampToValueAtTime(1.0, ac.currentTime + 1.33);
      boomGain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 2.1);
      boomOsc.connect(boomGain);
      boomGain.connect(ac.destination);
      boomOsc.start(ac.currentTime + 1.3);
      boomOsc.stop(ac.currentTime + 2.15);

      // 5. MÉTAL froissé à l'impact — débris
      const metalBuf = ac.createBuffer(
        1,
        Math.ceil(ac.sampleRate * 0.5),
        ac.sampleRate,
      );
      const metalData = metalBuf.getChannelData(0);
      for (let i = 0; i < metalData.length; i++) {
        const t = i / ac.sampleRate;
        metalData[i] =
          (Math.random() * 2 - 1) *
          Math.exp(-t * 8) *
          (Math.random() < 0.05 ? 2.5 : 0.4);
      }
      const metalSrc = ac.createBufferSource();
      metalSrc.buffer = metalBuf;
      const metalFilter = ac.createBiquadFilter();
      metalFilter.type = "highpass";
      metalFilter.frequency.value = 1200;
      const metalGain = ac.createGain();
      metalGain.gain.setValueAtTime(1.2, ac.currentTime + 1.32);
      metalSrc.connect(metalFilter);
      metalFilter.connect(metalGain);
      metalGain.connect(ac.destination);
      metalSrc.start(ac.currentTime + 1.32);

      // 6. GRINCEMENT de câbles après impact
      const squeakOsc = ac.createOscillator();
      squeakOsc.type = "sine";
      squeakOsc.frequency.setValueAtTime(420, ac.currentTime + 1.6);
      squeakOsc.frequency.linearRampToValueAtTime(280, ac.currentTime + 2.2);
      squeakOsc.frequency.linearRampToValueAtTime(360, ac.currentTime + 2.6);
      const squeakGain = ac.createGain();
      squeakGain.gain.setValueAtTime(0, ac.currentTime + 1.6);
      squeakGain.gain.linearRampToValueAtTime(0.09, ac.currentTime + 1.65);
      squeakGain.gain.linearRampToValueAtTime(0.05, ac.currentTime + 2.3);
      squeakGain.gain.linearRampToValueAtTime(0, ac.currentTime + 2.8);
      squeakOsc.connect(squeakGain);
      squeakGain.connect(ac.destination);
      squeakOsc.start(ac.currentTime + 1.6);
      squeakOsc.stop(ac.currentTime + 2.85);
    },

    // ─────────────────────────────────────────────────────────────
    // FLOOR 2 — ACCESS GRANTED : ascenseur qui MONTE (bizarre/glitché)
    // ─────────────────────────────────────────────────────────────
    elevator_rise: () => {
      if (muted) return;
      const ac = getCtx();

      // 1. Démarrage hésitant — moteur qui peine
      const startOsc = ac.createOscillator();
      startOsc.type = "sawtooth";
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

      // 2. MONTÉE principale — moteur électrique
      const motorOsc = ac.createOscillator();
      motorOsc.type = "sawtooth";
      motorOsc.frequency.setValueAtTime(48, ac.currentTime + 0.7);
      motorOsc.frequency.linearRampToValueAtTime(62, ac.currentTime + 1.5);
      motorOsc.frequency.setValueAtTime(55, ac.currentTime + 2.0); // glitch
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

      // 3. Vibration des parois
      const vibraOsc = ac.createOscillator();
      vibraOsc.type = "sine";
      vibraOsc.frequency.setValueAtTime(130, ac.currentTime + 0.8);
      vibraOsc.frequency.setValueAtTime(125, ac.currentTime + 1.4);
      vibraOsc.frequency.setValueAtTime(138, ac.currentTime + 2.1);
      vibraOsc.frequency.setValueAtTime(122, ac.currentTime + 2.7);
      vibraOsc.frequency.setValueAtTime(135, ac.currentTime + 3.3);
      const vibraGain = ac.createGain();
      vibraGain.gain.setValueAtTime(0, ac.currentTime + 0.8);
      vibraGain.gain.linearRampToValueAtTime(0.14, ac.currentTime + 1.1);
      vibraGain.gain.setValueAtTime(0.14, ac.currentTime + 3.4);
      vibraGain.gain.linearRampToValueAtTime(0, ac.currentTime + 4.0);
      vibraOsc.connect(vibraGain);
      vibraGain.connect(ac.destination);
      vibraOsc.start(ac.currentTime + 0.8);
      vibraOsc.stop(ac.currentTime + 4.1);

      // 4. GLITCH sonore à mi-montée
      const glitchOsc = ac.createOscillator();
      glitchOsc.type = "square";
      glitchOsc.frequency.setValueAtTime(180, ac.currentTime + 2.0);
      glitchOsc.frequency.linearRampToValueAtTime(80, ac.currentTime + 2.25);
      const glitchGain = ac.createGain();
      glitchGain.gain.setValueAtTime(0, ac.currentTime + 2.0);
      glitchGain.gain.linearRampToValueAtTime(0.3, ac.currentTime + 2.02);
      glitchGain.gain.linearRampToValueAtTime(0, ac.currentTime + 2.28);
      glitchOsc.connect(glitchGain);
      glitchGain.connect(ac.destination);
      glitchOsc.start(ac.currentTime + 2.0);
      glitchOsc.stop(ac.currentTime + 2.3);

      // 5. Sifflement des câbles qui montent
      const cableOsc = ac.createOscillator();
      cableOsc.type = "sine";
      cableOsc.frequency.setValueAtTime(280, ac.currentTime + 0.9);
      cableOsc.frequency.linearRampToValueAtTime(520, ac.currentTime + 3.5);
      const cableGain = ac.createGain();
      cableGain.gain.setValueAtTime(0, ac.currentTime + 0.9);
      cableGain.gain.linearRampToValueAtTime(0.06, ac.currentTime + 1.2);
      cableGain.gain.setValueAtTime(0.06, ac.currentTime + 3.3);
      cableGain.gain.linearRampToValueAtTime(0, ac.currentTime + 3.8);
      cableOsc.connect(cableGain);
      cableGain.connect(ac.destination);
      cableOsc.start(ac.currentTime + 0.9);
      cableOsc.stop(ac.currentTime + 3.85);

      // 6. Cliquetis mécaniques — poulie + engrenages à 8Hz
      const mechBuf = ac.createBuffer(
        1,
        Math.ceil(ac.sampleRate * 3.5),
        ac.sampleRate,
      );
      const mechData = mechBuf.getChannelData(0);
      for (let i = 0; i < mechData.length; i++) {
        const t = i / ac.sampleRate;
        const click =
          Math.abs(Math.sin(2 * Math.PI * 8 * t)) > 0.97
            ? (Math.random() * 2 - 1) * 0.9
            : 0;
        mechData[i] = (Math.random() * 2 - 1) * 0.04 + click;
      }
      const mechSrc = ac.createBufferSource();
      mechSrc.buffer = mechBuf;
      const mechFilter = ac.createBiquadFilter();
      mechFilter.type = "bandpass";
      mechFilter.frequency.value = 900;
      mechFilter.Q.value = 2;
      const mechGain = ac.createGain();
      mechGain.gain.setValueAtTime(0, ac.currentTime + 0.85);
      mechGain.gain.linearRampToValueAtTime(0.35, ac.currentTime + 1.1);
      mechGain.gain.setValueAtTime(0.35, ac.currentTime + 3.5);
      mechGain.gain.linearRampToValueAtTime(0, ac.currentTime + 4.1);
      mechSrc.connect(mechFilter);
      mechFilter.connect(mechGain);
      mechGain.connect(ac.destination);
      mechSrc.start(ac.currentTime + 0.85);

      // 7. DING d'arrivée
      const dingOsc1 = ac.createOscillator();
      dingOsc1.type = "sine";
      dingOsc1.frequency.setValueAtTime(1047, ac.currentTime + 4.3);
      const dingGain1 = ac.createGain();
      dingGain1.gain.setValueAtTime(0, ac.currentTime + 4.3);
      dingGain1.gain.linearRampToValueAtTime(0.55, ac.currentTime + 4.32);
      dingGain1.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 5.0);
      dingOsc1.connect(dingGain1);
      dingGain1.connect(ac.destination);
      dingOsc1.start(ac.currentTime + 4.3);
      dingOsc1.stop(ac.currentTime + 5.1);

      const dingOsc2 = ac.createOscillator();
      dingOsc2.type = "sine";
      dingOsc2.frequency.setValueAtTime(1319, ac.currentTime + 4.55);
      const dingGain2 = ac.createGain();
      dingGain2.gain.setValueAtTime(0, ac.currentTime + 4.55);
      dingGain2.gain.linearRampToValueAtTime(0.4, ac.currentTime + 4.57);
      dingGain2.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 5.2);
      dingOsc2.connect(dingGain2);
      dingGain2.connect(ac.destination);
      dingOsc2.start(ac.currentTime + 4.55);
      dingOsc2.stop(ac.currentTime + 5.25);
    },

    // ─────────────────────────────────────────
    // FLOOR 3 — Emergency Brake
    // ─────────────────────────────────────────

    brake_press: () => {
      beep({ frequency: 180, type: "sawtooth", duration: 0.05, gain: 0.4 });
    },

    alarm: () => {
      for (let i = 0; i < 3; i++) {
        beep({
          frequency: 880,
          type: "square",
          duration: 0.15,
          gain: 0.3,
          delay: i * 0.2,
        });
        beep({
          frequency: 660,
          type: "square",
          duration: 0.15,
          gain: 0.3,
          delay: i * 0.2 + 0.15,
        });
      }
    },

    tick: () => {
      beep({ frequency: 1200, type: "sine", duration: 0.03, gain: 0.1 });
    },

    // ─────────────────────────────────────────
    // FLOOR 4 — Final Debug
    // ─────────────────────────────────────────

    bug_spawn: () => {
      beep({ frequency: 200, type: "sawtooth", duration: 0.08, gain: 0.2 });
      beep({
        frequency: 150,
        type: "square",
        duration: 0.05,
        gain: 0.15,
        delay: 0.05,
      });
    },

    bug_kill: () => {
      beep({ frequency: 600, type: "sine", duration: 0.06, gain: 0.3 });
      beep({
        frequency: 300,
        type: "square",
        duration: 0.08,
        gain: 0.2,
        delay: 0.04,
      });
    },

    // ─────────────────────────────────────────
    // GLOBAL
    // ─────────────────────────────────────────

    floor_complete: () => {
      [523, 659, 784, 1047].forEach((f, i) => {
        beep({
          frequency: f,
          type: "sine",
          duration: 0.2,
          gain: 0.35,
          delay: i * 0.12,
        });
      });
    },

    victory: () => {
      const melody = [523, 659, 784, 1047, 784, 1047, 1319];
      melody.forEach((f, i) => {
        beep({
          frequency: f,
          type: "sine",
          duration: 0.25,
          gain: 0.4,
          delay: i * 0.15,
        });
      });
    },

    elevator_ding: () => {
      beep({ frequency: 1047, type: "sine", duration: 0.4, gain: 0.5 });
      beep({
        frequency: 1319,
        type: "sine",
        duration: 0.3,
        gain: 0.3,
        delay: 0.15,
      });
    },

    error_buzz: () => {
      beep({ frequency: 100, type: "sawtooth", duration: 0.3, gain: 0.5 });
    },

    keyclick: () => {
      beep({ frequency: 800, type: "square", duration: 0.02, gain: 0.15 });
    },
  };

  function play(name) {
    if (muted) return;
    if (library[name]) {
      try {
        library[name]();
      } catch (e) {
        console.warn("Sound error:", e);
      }
    }
  }

  function toggleMute() {
    muted = !muted;
    return muted;
  }

  function unlock() {
    if (ctx && ctx.state === "suspended") ctx.resume();
  }

  document.addEventListener("click", unlock);
  document.addEventListener("keydown", unlock);

  return { play, toggleMute };
})();
