document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("technician-id");
  const buttons = document.querySelectorAll(".gridBtn");
  const terminal = document.querySelector(".terminal");
  const elevator = document.querySelector(".elevator");
  const elevator1 = document.querySelector(".elevatorIndicator");
  const overlay = document.querySelector("#black-overlay");
  const passwdBtn = document.getElementById("password");
  const system = {
    validId: "8492",
    diagnosticOverride: false,
    validate(id) {
      return id === this.validId;
    },
  };

function playElevator() {
  elevator.classList.add("elevator-start");
  passwdBtn.style.display = "none";
  setTimeout(() => {
    elevator.classList.remove("elevator-start");
    elevator.classList.add("elevator-moving");
    elevator1.classList.remove("elevator-start");
    elevator1.classList.add("elevator-moving");
    
  }, 400);
  setTimeout(() => {
    overlay.classList.add("fade-black");
  }, 2500);
  setTimeout(() => {
    elevator1.classList.remove("elevator-moving");
    elevator1.classList.add("elevator-stop");
  }, 4000);
  
  setTimeout(() => {
    elevator1.classList.remove("elevator-stop");
  }, 300);
  
}
  function updateStatus() {
    const lockIcon = document.getElementById("lock-icon");
    const indicator = document.getElementById("status-light");

    if (input.value === system.validId) {
      input.value = "ACCESS_GRANTED";
      input.classList.remove("text-red-500");
      input.classList.add("text-green-500", "font-bold");
      lockIcon.textContent = "lock_open"; 
    lockIcon.classList.remove("text-slate-600");
    lockIcon.classList.add("text-green-500");
      indicator.classList.remove("bg-red-500");
      indicator.classList.add("bg-green-500");
      localStorage.setItem("floor2", "completed");
      setTimeout(() => {
        terminal.classList.add("scale-0");
      },1000);
      setTimeout(() => {
        playElevator();
      }, 2000);
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

      const digitMatch = value.match(/\d/);
      if (digitMatch) {
        if (input.value.length < 4) input.value += digitMatch[0];
      }

      if (btn.innerHTML.includes("backspace") || value.toLowerCase().includes("backspace")) {
        input.value = input.value.slice(0, -1);
      }

      if (btn.innerHTML.includes("keyboard_return") || value.toLowerCase().includes("keyboard_return") || value.toLowerCase().includes("enter")) {
        updateStatus(system.validate(input.value));
      }
      
      if (value.toLowerCase().includes("diagnostic override")) {
        system.diagnosticOverride = !system.diagnosticOverride;
        btn.textContent = system.diagnosticOverride ? "Diagnostic Override: ON" : "Diagnostic Override: OFF";
        passwdBtn.style.display = system.diagnosticOverride ? "block" : "none";
        btn.classList.remove("bg-slate-800", "hover:bg-slate-700", "bg-gray-300");
        if (system.diagnosticOverride) {
          btn.classList.add("bg-yellow-500");
          btn.classList.remove("text-slate-300");
          btn.classList.add("text-black");
        } else {
          btn.classList.remove("bg-yellow-500");
          btn.classList.add("bg-slate-800", "text-slate-300");
        }
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

