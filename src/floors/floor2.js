document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("technician-id");
  const buttons = document.querySelectorAll(".terminal button");
  const terminal = document.querySelector(".terminal");
  const elevator = document.querySelector(".elevator");
  const elevator1 = document.querySelector(".elevatorIndicator");
  const overlay = document.querySelector("#black-overlay");

  const system = {
    validId: "8492",
    diagnosticOverride: false,
    validate(id) {
      return id === this.validId;
    },
  };

  // ── Injecte les keyframes CSS pour la chute et la montée ──
  const style = document.createElement('style');
  style.textContent = `
    @keyframes elevatorFall {
      0%   { transform: translateY(0px) rotate(0deg); }
      8%   { transform: translateY(6px) rotate(0.3deg); }
      15%  { transform: translateY(22px) rotate(-0.5deg); }
      25%  { transform: translateY(18px) rotate(0.4deg); }
      35%  { transform: translateY(38px) rotate(-0.3deg); }
      50%  { transform: translateY(32px) rotate(0.2deg); }
      65%  { transform: translateY(52px) rotate(-0.4deg); }
      80%  { transform: translateY(48px) rotate(0.2deg); }
      88%  { transform: translateY(62px) rotate(-0.1deg); }
      93%  { transform: translateY(58px) rotate(0.3deg); }
      96%  { transform: translateY(64px) rotate(0deg); }
      100% { transform: translateY(60px) rotate(0deg); }
    }

    @keyframes elevatorShakeReturn {
      0%   { transform: translateY(60px) rotate(0deg); }
      20%  { transform: translateY(54px) rotate(0.8deg); }
      35%  { transform: translateY(58px) rotate(-0.6deg); }
      50%  { transform: translateY(55px) rotate(0.4deg); }
      65%  { transform: translateY(57px) rotate(-0.3deg); }
      80%  { transform: translateY(56px) rotate(0.2deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }

    @keyframes elevatorRise {
      0%   { transform: translateY(0px) rotate(0deg); }
      5%   { transform: translateY(8px) rotate(0.5deg); }
      10%  { transform: translateY(-5px) rotate(-0.4deg); }
      15%  { transform: translateY(4px) rotate(0.3deg); }
      20%  { transform: translateY(-15px) rotate(-0.3deg); }
      28%  { transform: translateY(-12px) rotate(0.5deg); }
      35%  { transform: translateY(-28px) rotate(-0.4deg); }
      42%  { transform: translateY(-25px) rotate(0.2deg); }
      50%  { transform: translateY(-38px) rotate(0.6deg); }  /* glitch */
      52%  { transform: translateY(-32px) rotate(-0.8deg); } /* glitch */
      54%  { transform: translateY(-42px) rotate(0.3deg); }
      65%  { transform: translateY(-55px) rotate(-0.3deg); }
      78%  { transform: translateY(-68px) rotate(0.2deg); }
      90%  { transform: translateY(-78px) rotate(-0.1deg); }
      100% { transform: translateY(-90px) rotate(0deg); }
    }

    @keyframes screenShake {
      0%,100% { transform: translateX(0); }
      10%     { transform: translateX(-8px) translateY(3px); }
      20%     { transform: translateX(6px) translateY(-4px); }
      30%     { transform: translateX(-5px) translateY(2px); }
      40%     { transform: translateX(7px) translateY(-3px); }
      50%     { transform: translateX(-4px) translateY(4px); }
      60%     { transform: translateX(5px) translateY(-2px); }
      70%     { transform: translateX(-6px) translateY(1px); }
      80%     { transform: translateX(4px) translateY(-3px); }
      90%     { transform: translateX(-3px) translateY(2px); }
    }

    @keyframes screenRiseShake {
      0%,100% { transform: translateX(0) translateY(0); }
      10%     { transform: translateX(-3px) translateY(-1px); }
      20%     { transform: translateX(4px) translateY(1px); }
      30%     { transform: translateX(-2px) translateY(-2px); }
      40%     { transform: translateX(3px) translateY(1px); }
      50%     { transform: translateX(-4px) translateY(-1px); }  /* glitch */
      52%     { transform: translateX(8px) translateY(2px); }    /* glitch */
      54%     { transform: translateX(-3px) translateY(0px); }
      70%     { transform: translateX(2px) translateY(-1px); }
      85%     { transform: translateX(-2px) translateY(1px); }
    }

    .elevator-falling {
      animation: elevatorFall 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
    .elevator-shaking {
      animation: screenShake 1.4s ease-in-out;
    }
    .elevator-returning {
      animation: elevatorShakeReturn 0.8s ease-out forwards;
    }
    .elevator-rising {
      animation: elevatorRise 4.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    .elevator-rise-shaking {
      animation: screenRiseShake 4.5s ease-in-out;
    }
  `;
  document.head.appendChild(style);

  // ── Animation de CHUTE (ACCESS DENIED) ──
  function triggerFall() {
    if (!elevator) return;

    // Chute
    elevator.classList.add('elevator-falling');
    document.body.classList.add('elevator-shaking');

    // Après l'impact → tremblement résiduel + retour
    setTimeout(() => {
      elevator.classList.remove('elevator-falling');
      elevator.classList.add('elevator-returning');
      document.body.classList.remove('elevator-shaking');
    }, 1500);

    setTimeout(() => {
      elevator.classList.remove('elevator-returning');
    }, 2400);
  }

  // ── Animation de MONTÉE (ACCESS GRANTED) ──
  function triggerRise() {
    if (!elevator) return;

    elevator.classList.add('elevator-rising');
    document.body.classList.add('elevator-rise-shaking');

    setTimeout(() => {
      document.body.classList.remove('elevator-rise-shaking');
    }, 4600);
  }

  // ── Transition originale de l'ascenseur (garder pour la séquence) ──
  function playElevatorTransition() {
    if (elevator) elevator.classList.add("elevator-start");

    setTimeout(() => {
      if (elevator) {
        elevator.classList.remove("elevator-start");
        elevator.classList.add("elevator-moving");
      }
      if (elevator1) {
        elevator1.classList.remove("elevator-start");
        elevator1.classList.add("elevator-moving");
      }
    }, 400);

    setTimeout(() => {
      overlay.classList.add("fade-black");
    }, 2500);

    setTimeout(() => {
      if (elevator1) {
        elevator1.classList.remove("elevator-moving");
        elevator1.classList.add("elevator-stop");
      }
    }, 4000);

    setTimeout(() => {
      if (elevator1) elevator1.classList.remove("elevator-stop");
    }, 300);
  }

  // ── Logique principale ──
  function updateStatus() {
    const lockIcon = document.getElementById("lock-icon");
    const indicator = document.getElementById("status-light");
    const statusText = document.getElementById("system-status");

    if (input.value === system.validId) {
      // ────── ACCESS GRANTED ──────
      Sounds.play('elevator_rise');  // son ascenseur qui monte
      triggerRise();                 // animation montée + tremblement

      input.value = "ACCESS_GRANTED";
      input.classList.remove("text-red-500");
      input.classList.add("text-green-500", "font-bold");

      if (lockIcon) {
        lockIcon.textContent = "lock_open";
        lockIcon.classList.remove("text-slate-600");
        lockIcon.classList.add("text-green-500");
      }
      if (indicator) {
        indicator.classList.remove("bg-red-500");
        indicator.classList.add("bg-green-500");
      }
      if (statusText) statusText.textContent = "ACCESS_GRANTED";

      localStorage.setItem("floor2", "completed");

      setTimeout(() => {
        if (terminal) terminal.classList.add("scale-0");
      }, 1000);

      setTimeout(() => {
        playElevatorTransition();
      }, 2000);

    } else {
      // ────── ACCESS DENIED ──────
      Sounds.play('elevator_fall');  // son de chute + impact
      triggerFall();                 // animation chute visuelle

      input.value = "ACCESS_DENIED";
      input.classList.remove("text-green-500");
      input.classList.add("text-red-500", "font-bold");

      if (indicator) {
        indicator.classList.remove("bg-green-500");
        indicator.classList.add("bg-red-500");
      }
      if (statusText) statusText.textContent = "ACCESS_DENIED";

      setTimeout(() => {
        input.value = "";
        input.classList.remove("text-red-500", "font-bold");
        if (indicator) {
          indicator.classList.remove("bg-red-500");
          indicator.classList.add("bg-green-500");
        }
        if (statusText) statusText.textContent = "SYSTEM_READY";
      }, 2500);
    }
  }

  // ── Boutons du keypad ──
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
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

      // Chiffres
      const digitMatch = value.match(/\d/);
      if (digitMatch) {
        if (input.value.length < 4) {
          input.value += digitMatch[0];
          Sounds.play('keyclick');
        }
      }

      // Backspace
      if (btn.innerHTML.includes("backspace") || value.toLowerCase().includes("backspace")) {
        input.value = input.value.slice(0, -1);
        Sounds.play('keyclick');
      }

      // Entrée
      if (
        btn.innerHTML.includes("keyboard_return") ||
        value.toLowerCase().includes("keyboard_return") ||
        value.toLowerCase().includes("enter")
      ) {
        updateStatus();
      }

      // Diagnostic Override
      const passwdBtn = document.getElementById("password");
      if (
        value.toLowerCase().includes("diagnostic override") ||
        btn.textContent.toLowerCase().includes("diagnostic")
      ) {
        system.diagnosticOverride = !system.diagnosticOverride;
        btn.textContent = system.diagnosticOverride
          ? "Diagnostic Override: ON"
          : "Diagnostic Override: OFF";

        if (passwdBtn) {
          passwdBtn.style.display = system.diagnosticOverride ? "block" : "none";
        }

        btn.classList.remove("bg-slate-800", "hover:bg-slate-700", "bg-gray-300");
        if (system.diagnosticOverride) {
          btn.classList.add("bg-yellow-500", "text-black");
          btn.classList.remove("text-slate-300");
        } else {
          btn.classList.remove("bg-yellow-500", "text-black");
          btn.classList.add("bg-slate-800", "text-slate-300");
        }
      }
    });
  });

  // ── Clavier physique ──
  document.addEventListener("keydown", (e) => {
    if (/^[0-9]$/.test(e.key)) {
      if (input.value.length < 4) {
        input.value += e.key;
        Sounds.play('keyclick');
      }
    }
    if (e.key === "Backspace") {
      input.value = input.value.slice(0, -1);
      Sounds.play('keyclick');
    }
    if (e.key === "Enter") {
      updateStatus();
    }
  });
});