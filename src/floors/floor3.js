// ============================================================
// FLOOR 3 — EMERGENCY BRAKE
// Mission : Marteler ESPACE pour monter la pression hydraulique
// Si on s'arrête → la pression redescend (gravité simulée)
// Puzzle résolu quand pression >= 90% pendant 3 secondes
// ============================================================

const Floor3 = (() => {
  // --- STATE ---
  let pressure = 0; // 0 → 100
  let decayInterval = null;
  let checkInterval = null;
  let sustainTimer = 0;
  let isActive = false;
  const TARGET = 90;
  const GAIN = 8; // +% par frappe
  const DECAY = 0.8; // -% par tick (gravité)
  const DECAY_RATE = 80; // ms entre chaque tick de decay
  const SUSTAIN_NEEDED = 3000; // ms à tenir au-dessus de TARGET
TARGET
  // --- DOM REFS ---
  let gaugeBar,
    pressureLabel,
    velocityLabel,
    alertBanner,
    statusLabel,
    sustainBar;

  // --- SONS (M4 intègre ici) ---
  const SFX = {
    keypress: () => Sounds.play("brake_press"),
    alarm: () => Sounds.play("alarm"),
    success: () => Sounds.play("floor_complete"),
    tick: () => Sounds.play("tick"),
  };

  // --- INIT ---
  function init() {
    isActive = true;
    pressure = 0;
    sustainTimer = 0;

    // Récupère les éléments du HTML Floor 3
    gaugeBar = document.getElementById("f3-gauge-bar");
    pressureLabel = document.getElementById("f3-pressure-label");
    velocityLabel = document.getElementById("f3-velocity");
    alertBanner = document.getElementById("f3-alert");
    statusLabel = document.getElementById("f3-status");
    sustainBar = document.getElementById("f3-sustain-bar");

    SFX.alarm();
    startDecay();
    startSustainCheck();

    // Écoute ESPACE uniquement
    document.addEventListener("keydown", handleKeyDown);
    // Support mobile : bouton tap
    document
      .getElementById("f3-tap-btn")
      ?.addEventListener("pointerdown", handleTap);
  }

  // --- KEYDOWN HANDLER ---
  function handleKeyDown(e) {
    if (!isActive) return;
    if (e.code === "Space") {
      e.preventDefault();
      applyPressure();
    }
  }

  function handleTap() {
    if (!isActive) return;
    applyPressure();
  }

  // --- LOGIQUE PRINCIPALE ---
  function applyPressure() {
    pressure = Math.min(100, pressure + GAIN);
    SFX.keypress();
    updateUI();
    shakeScreen(pressure < TARGET ? "light" : "none");
  }

  function startDecay() {
    decayInterval = setInterval(() => {
      if (!isActive) return;
      pressure = Math.max(0, pressure - DECAY);
      updateUI();
    }, DECAY_RATE);
  }

  function startSustainCheck() {
    checkInterval = setInterval(() => {
      if (!isActive) return;

      if (pressure >= TARGET) {
        sustainTimer += 100;
        updateSustainBar();
        SFX.tick();

        if (sustainTimer >= SUSTAIN_NEEDED) {
          complete();
        }
      } else {
        // Réinitialise si on redescend
        sustainTimer = 0;
        updateSustainBar();
      }
    }, 100);
  }

  // --- UI UPDATE ---
  function updateUI() {
    if (!gaugeBar) return;

    // Couleur dynamique de la jauge
    const pct = pressure;
    gaugeBar.style.height = `${pct}%`;

    if (pct < 30) {
      gaugeBar.className = "gauge-bar w-full bg-red-600";
    } else if (pct < TARGET) {
      gaugeBar.className = "gauge-bar w-full bg-yellow-400";
    } else {
      gaugeBar.className = "gauge-bar w-full bg-green-500";
    }

    // Labels
    pressureLabel.textContent = `${Math.round(pct)}%`;
    velocityLabel.textContent = pct >= TARGET ? "STABILIZING" : "CRITICAL";
    velocityLabel.className =
      pct >= TARGET
        ? "text-green-400 font-mono text-xl font-bold"
        : "text-red-400 font-mono text-xl font-bold animate-pulse";

    alertBanner.style.display = pct < 20 ? "flex" : "none";
  }

  function updateSustainBar() {
    if (!sustainBar) return;
    const pct = Math.min(100, (sustainTimer / SUSTAIN_NEEDED) * 100);
    sustainBar.style.width = `${pct}%`;
  }

  // --- SCREEN SHAKE ---
  function shakeScreen(intensity) {
    const el = document.getElementById("floor3-root");
    if (!el) return;
    el.classList.remove("animate-shake", "animate-shake-once");
    if (intensity === "light") {
      void el.offsetWidth; // reflow trick
      el.classList.add("animate-shake-once");
    }
  }

  // --- COMPLETE ---
  function complete() {
    isActive = false;
    clearInterval(decayInterval);
    clearInterval(checkInterval);
    document.removeEventListener("keydown", handleKeyDown);

    SFX.success();

    statusLabel.textContent = "✓ BRAKES ENGAGED";
    statusLabel.className = "text-green-400 font-mono text-lg tracking-widest";

    // Déclenche l'événement Custom pour M1 (changement d'étage)
    setTimeout(() => {
      document.dispatchEvent(
        new CustomEvent("floor:complete", {
          detail: { floor: 3 },
        }),
      );
    }, 1500);
  }

  // --- DESTROY (nettoyage quand on quitte l'étage) ---
  function destroy() {
    isActive = false;
    clearInterval(decayInterval);
    clearInterval(checkInterval);
    document.removeEventListener("keydown", handleKeyDown);
  }

  return { init, destroy };
})();
