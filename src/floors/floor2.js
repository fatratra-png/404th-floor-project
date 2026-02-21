document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("technician-id");
  const buttons = document.querySelectorAll("button");

  const system = {
    validId: "8492",
    diagnosticOverride: false,
    validate(id) {
      if (this.diagnosticOverride) return true; // override actif : toujours correct
      return id === this.validId;
    },
  };
  function updateStatus(success) {
    const lockIcon = document.getElementById("lock-icon");
    const indicator = document.getElementById("status-light");

    if (success) {
      input.value = "ACCESS_GRANTED";
      input.classList.remove("text-red-500");
      input.classList.add("text-green-500", "font-bold");
      lockIcon.textContent = "lock_open";   // icône cadenas ouvert
    lockIcon.classList.remove("text-slate-600");
    lockIcon.classList.add("text-green-500"); // vert

      indicator.classList.remove("bg-red-500");
      indicator.classList.add("bg-green-500");
      localStorage.setItem("floor2", "completed");
    } else {
      input.value = "ACCESS_DENIED";
      input.classList.remove("text-green-500");
      input.classList.add("text-red-500", "font-bold");

      indicator.classList.remove("bg-green-500");
      indicator.classList.add("bg-red-500");

      setTimeout(() => {
        input.value = "";
        input.classList.remove("text-red-500", "font-bold");
      }, 500);
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Récupère le texte pertinent du bouton.
      // Priorité : span qui contient un chiffre, sinon premier span non-icône, sinon texte du bouton.
      let value = "";
      const spans = btn.querySelectorAll("span");
      if (spans.length) {
        const spanArray = Array.from(spans);
        const digitSpan = spanArray.find((s) => /\d/.test(s.textContent));
        const nonIconSpan = spanArray.find((s) => !s.classList.contains("material-symbols-outlined"));
        const chosen = digitSpan || nonIconSpan || spanArray[0];
        value = chosen.textContent.trim();
      } else {
        value = btn.textContent.trim();
      }

      // Si on a trouvé un chiffre quelque part dans la valeur, on l'ajoute (seulement 1 caractère)
      const digitMatch = value.match(/\d/);
      if (digitMatch) {
        if (input.value.length < 4) input.value += digitMatch[0];
      }

      // Backspace (icône) — on teste aussi le texte 'backspace' dans le contenu
      if (btn.innerHTML.includes("backspace") || value.toLowerCase().includes("backspace")) {
        input.value = input.value.slice(0, -1);
      }

      // Enter / submit
      if (btn.innerHTML.includes("keyboard_return") || value.toLowerCase().includes("keyboard_return") || value.toLowerCase().includes("enter")) {
        updateStatus(system.validate(input.value));
      }
      const passwdBtn = document.getElementById("password");
      // Diagnostic override (texte sur le bouton)
      if (value.toLowerCase().includes("diagnostic override")) {
        system.diagnosticOverride = !system.diagnosticOverride;
        btn.classList.toggle("bg-yellow-500");
        btn.classList.toggle("bg-gray-300");
        btn.textContent = system.diagnosticOverride ? "Diagnostic Override: ON" : "Diagnostic Override: OFF";
        btn.style.pointerEvents = "none"; // Empêche les clics rapides de causer des problèmes
        passwdBtn.style.display = system.diagnosticOverride ? "block" : "none"; // Affiche le bouton de mot de passe si override activé
        }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (/^[0-9]$/.test(e.key)) {
      if (input.value.length < 4) input.value += e.key;
    }

    if (e.key === "Backspace") input.value = input.value.slice(0, -1);

    if (e.key === "Enter") updateStatus(system.validate(input.value));
  });
});
// Exemple : status peut changer dynamiquement
