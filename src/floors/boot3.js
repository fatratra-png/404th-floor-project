      // Boot Floor 3 quand la page est prête
      document.addEventListener("DOMContentLoaded", () => {
        Floor3.init();
      });

      // Écoute la complétion (pour intégration avec main.js de M1)
      document.addEventListener("floor:complete", (e) => {
        if (e.detail.floor === 3) {
          const overlay = document.getElementById("f3-complete-overlay");
          overlay.classList.add("show");
          console.log("[M4] Floor 3 complete → signaling M1");
          // M1 prendra le relais ici
        }
      });

      // Visual feedback sur le bouton
      const tapBtn = document.getElementById("f3-tap-btn");
      tapBtn.addEventListener("pointerdown", () => {
        tapBtn.classList.add("pressed");
      });
      tapBtn.addEventListener("pointerup", () => {
        tapBtn.classList.remove("pressed");
      });

      // Update status badge avec la jauge
      function syncStatusBadge(pressure) {
        const badge = document.getElementById("f3-status-badge");
        const badgeR = document.getElementById("f3-status-right");
        if (pressure >= 90) {
          badge.textContent = "STABLE";
          badge.style.color = "#22c55e";
          badgeR.textContent = "STABLE";
          badgeR.style.color = "#22c55e";
        } else {
          badge.textContent = "UNSTABLE";
          badge.style.color = "var(--red)";
          badgeR.textContent = "UNSTABLE";
          badgeR.style.color = "var(--red)";
        }
      }

      // Monkey-patch updateUI pour sync le badge (optionnel)
      // Floor3 init handled by main.js via floor:complete event