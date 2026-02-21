// ============================================================
// FLOOR 4 — FINAL DEBUG
// Mission : Cliquer sur tous les bugs générés aléatoirement
// Bugs créés avec createElement + appendChild
// Clic = removeChild → quand écran vide → puzzle résolu
// ============================================================

const Floor4 = (() => {
  // --- CONFIG ---
  const TOTAL_BUGS = 20; // Total de bugs à spawner
  const SPAWN_RATE = 800; // ms entre chaque spawn
  const BUG_TYPES = [
    { label: "ERR_01", icon: "🐛", msg: "Uncaught ReferenceError" },
    { label: "ERR_02", icon: "💀", msg: "Stack Overflow" },
    { label: "ERR_03", icon: "⚠️", msg: "undefined is not a function" },
    { label: "ERR_404", icon: "👾", msg: "Memory leak detected" },
    { label: "ERR_NaN", icon: "🔥", msg: "NaN at Elevator.js:404" },
  ];

  // --- STATE ---
  let bugsSpawned = 0;
  let bugsClicked = 0;
  let spawnInterval = null;
  let isActive = false;
  let arena; // le conteneur DOM des bugs

  // --- SONS ---
  const SFX = {
    spawn: () => Sounds.play("bug_spawn"),
    click: () => Sounds.play("bug_kill"),
    success: () => Sounds.play("floor_complete"),
    final: () => Sounds.play("victory"),
  };

  // --- INIT ---
  function init() {
    isActive = true;
    bugsSpawned = 0;
    bugsClicked = 0;

    arena = document.getElementById("f4-arena");
    updateCounter();
    spawnInterval = setInterval(spawnBug, SPAWN_RATE);
  }

  // --- SPAWN UN BUG ---
  function spawnBug() {
    if (!isActive || bugsSpawned >= TOTAL_BUGS) {
      clearInterval(spawnInterval);
      return;
    }

    bugsSpawned++;
    SFX.spawn();

    const type = BUG_TYPES[Math.floor(Math.random() * BUG_TYPES.length)];

    // --- createElement (technique clé M4) ---
    const bug = document.createElement("div");
    bug.id = `bug-${bugsSpawned}`;

    // Position aléatoire dans l'arène
    const x = Math.random() * 80 + 5; // 5% → 85%
    const y = Math.random() * 70 + 10; // 10% → 80%

    bug.style.cssText = `
      position: absolute;
      left: ${x}%;
      top:  ${y}%;
      z-index: 10;
      cursor: pointer;
      animation: bugFloat 2s ease-in-out infinite alternate;
    `;

    bug.className = `
      flex flex-col items-center justify-center
      w-16 h-16 rounded-sm
      bg-red-900 border border-red-500
      text-red-300 font-mono text-xs
      hover:scale-110 transition-transform duration-100
      select-none
    `;

    bug.innerHTML = `
      <span class="text-2xl">${type.icon}</span>
      <span class="text-[9px] mt-1 opacity-70">${type.label}</span>
    `;

    // --- Tooltip erreur ---
    const tooltip = document.createElement("div");
    tooltip.className = `
      absolute -top-8 left-1/2 -translate-x-1/2
      bg-black border border-red-700 text-red-400
      text-[9px] px-2 py-1 rounded whitespace-nowrap
      opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
    `;
    tooltip.textContent = type.msg;
    bug.appendChild(tooltip);
    bug.classList.add("group");

    // --- CLICK → suppression DOM (technique clé M4) ---
    bug.addEventListener("click", () => killBug(bug));

    // --- appendChild dans l'arène ---
    arena.appendChild(bug);

    // Effet d'entrée
    bug.style.opacity = "0";
    bug.style.transform = "scale(0)";
    requestAnimationFrame(() => {
      bug.style.transition = "opacity 0.3s, transform 0.3s";
      bug.style.opacity = "1";
      bug.style.transform = "scale(1)";
    });

    updateCounter();
  }

  // --- TUER UN BUG ---
  function killBug(bugEl) {
    if (!isActive) return;
    bugsClicked++;
    SFX.click();

    // Animation de suppression
    bugEl.style.transition = "all 0.2s";
    bugEl.style.transform = "scale(0) rotate(45deg)";
    bugEl.style.opacity = "0";

    // Particle glitch effect
    spawnGlitchParticle(bugEl);

    setTimeout(() => {
      if (bugEl.parentNode) {
        bugEl.parentNode.removeChild(bugEl); // removeChild explicite
      }
      updateCounter();
      checkComplete();
    }, 200);
  }

  // --- PARTICLE GLITCH ---
  function spawnGlitchParticle(bugEl) {
    const rect = bugEl.getBoundingClientRect();
    const arenaRect = arena.getBoundingClientRect();

    for (let i = 0; i < 5; i++) {
      const p = document.createElement("div");
      p.className =
        "absolute w-1 h-1 bg-red-400 rounded-full pointer-events-none";
      p.style.left = `${rect.left - arenaRect.left + 32}px`;
      p.style.top = `${rect.top - arenaRect.top + 32}px`;

      const dx = (Math.random() - 0.5) * 80;
      const dy = (Math.random() - 0.5) * 80;

      arena.appendChild(p);

      p.animate(
        [
          { transform: "translate(0,0)", opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px)`, opacity: 0 },
        ],
        { duration: 400, easing: "ease-out" },
      ).onfinish = () => {
        if (p.parentNode) p.parentNode.removeChild(p);
      };
    }
  }

  // --- COMPTEUR UI ---
  function updateCounter() {
    const remaining = document.getElementById("f4-bugs-remaining");
    const progress = document.getElementById("f4-progress-bar");
    const pctLabel = document.getElementById("f4-pct-label");

    if (!remaining) return;

    const killed = bugsClicked;
    const pct = Math.round((killed / TOTAL_BUGS) * 100);

    remaining.textContent = TOTAL_BUGS - killed;
    if (progress) progress.style.width = `${pct}%`;
    if (pctLabel) pctLabel.textContent = `${pct}% Cleared`;
  }

  // --- VÉRIF VICTOIRE ---
  function checkComplete() {
    // Victoire si tous les bugs spawnés sont cliqués ET spawn terminé
    const remainingInDOM = arena.querySelectorAll('[id^="bug-"]').length;
    if (bugsSpawned >= TOTAL_BUGS && remainingInDOM === 0) {
      complete();
    }
  }

  // --- COMPLETE ---
  function complete() {
    isActive = false;
    clearInterval(spawnInterval);
    SFX.final();

    const overlay = document.getElementById("f4-complete-overlay");
    if (overlay) {
      overlay.classList.remove("hidden");
      overlay.classList.add("flex");
    }

    setTimeout(() => {
      document.dispatchEvent(
        new CustomEvent("floor:complete", {
          detail: { floor: 4 },
        }),
      );
    }, 2000);
  }

  function destroy() {
    isActive = false;
    clearInterval(spawnInterval);
  }

  return { init, destroy };
})();
