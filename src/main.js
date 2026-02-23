// ============================================================
// MAIN.JS — Moteur de navigation The 404th Floor
// ============================================================

const Game = (() => {
  const PROGRESS_KEY = '404floor_progress';

  function getState() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; }
    catch { return {}; }
  }

  function markComplete(floor) {
    const s = getState();
    s[`floor${floor}`] = 'completed';
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(s));
  }

  function isCompleted(floor) {
    return getState()[`floor${floor}`] === 'completed';
  }

  // Fondu noir puis redirection
  function goTo(url, delay = 0) {
    setTimeout(() => {
      const fade = document.createElement('div');
      fade.style.cssText = 'position:fixed;inset:0;background:#000;z-index:9999;opacity:0;transition:opacity 0.6s ease;pointer-events:all;';
      document.body.appendChild(fade);
      requestAnimationFrame(() => { fade.style.opacity = '1'; });
      setTimeout(() => { window.location.href = url; }, 680);
    }, delay);
  }

  // Met à jour le control panel de l'index
  function updateIndexButtons() {
    const map = { 1: 'floor1.html', 2: 'floor2.html', 3: 'floor3.html', 4: 'floor4.html' };
    document.querySelectorAll('[data-floor-btn]').forEach(btn => {
      const f = parseInt(btn.dataset.floorBtn);
      if (f === 1 || isCompleted(f - 1)) {
        btn.classList.remove('opacity-60', 'cursor-not-allowed');
        btn.classList.add('cursor-pointer');
        btn.addEventListener('click', () => goTo(map[f]));
      }
    });
  }

  function init() {
    const page = window.location.pathname.split('/').pop() || 'index.html';

    // ── FLOOR 1 : rideaux → floor2 ──
    if (page === 'floor1.html') {
      const curtainTop = document.getElementById('curtainTop');
      if (curtainTop) {
        const obs = new MutationObserver(() => {
          if (parseFloat(curtainTop.style.height) >= 49) {
            obs.disconnect();
            markComplete(1);
            goTo('floor2.html', 1200);
          }
        });
        obs.observe(curtainTop, { attributes: true, attributeFilter: ['style'] });
      }
    }

    // ── FLOOR 2 : fondu noir → floor3 ──
    if (page === 'floor2.html') {
      const overlay = document.getElementById('black-overlay');
      if (overlay) {
        const obs = new MutationObserver(() => {
          if (overlay.classList.contains('fade-black')) {
            obs.disconnect();
            markComplete(2);
            goTo('floor3.html', 1400);
          }
        });
        obs.observe(overlay, { attributes: true, attributeFilter: ['class'] });
      }
    }

    // ── FLOOR 3 : floor:complete → floor4 ──
    if (page === 'floor3.html') {
      document.addEventListener('floor:complete', (e) => {
        if (e.detail.floor === 3) {
          markComplete(3);
          goTo('floor4.html', 2800);
        }
      });
    }

    // ── FLOOR 4 : floor:complete → victory ──
    if (page === 'floor4.html') {
      document.addEventListener('floor:complete', (e) => {
        if (e.detail.floor === 4) {
          markComplete(4);
          goTo('victory.html', 3500);
        }
      });
    }

    // ── INDEX ──
    if (page === 'index.html' || page === '') {
      updateIndexButtons();
    }
  }

  return { init, goTo, isCompleted, markComplete };
})();

document.addEventListener('DOMContentLoaded', () => Game.init());