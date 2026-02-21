/* =========================
   COMPTEUR
========================= */

/* =========================
   COMPTEUR
========================= */

let s = 0* 3600 + 30 * 60 + 0;
const el = document.getElementById("counter");

const timer = setInterval(() => {
  if (s <= 0) {
    clearInterval(timer);
    return;
  }

  s--;
  el.textContent = new Date(s * 1000).toISOString().slice(11, 19);
}, 1000);


/* =========================
   DRAG & DROP FUSIBLES
========================= */

const fuses = document.querySelectorAll(".fuse-item");
const dropZones = document.querySelectorAll(".border-dashed");

let dragged = null;

/* ---- Drag start ---- */
fuses.forEach(fuse => {
  fuse.addEventListener("dragstart", () => {
    dragged = fuse;
  });
});


/* =========================
   BARRE DE PROGRESSION
========================= */

let insertedFuses = 0;
const maxFuses = 3;

const voltageBar = document.getElementById("voltageBar");
const voltageText = document.getElementById("voltageText");

function updateVoltage() {
  const percent = Math.min(
    Math.round((insertedFuses / maxFuses) * 100),
    100
  );

  voltageBar.style.width = percent + "%";
  voltageText.textContent = percent + "%";

  if (percent === 100) {

    clearInterval(timer); // 🔥 STOP LE COMPTEUR

    const statusEl = document.getElementById("status");
    if (statusEl) {
      statusEl.textContent = "ONLINE";
      statusEl.classList.add("text-green-500", "font-bold");
    }

    const criticalEl = document.getElementById("critical");
    if (criticalEl) {
      criticalEl.textContent = "System Online";
      criticalEl.classList.remove("text-accent-red");
      criticalEl.classList.add("text-green-500");
    }
  }
}


/* =========================
   DROP LOGIQUE PROPRE
========================= */

const allowedTypes = ["quantum", "plasma", "thermal", "typeA"];
const indicators = document.querySelectorAll(".indicator");

dropZones.forEach(zone => {

  /* Hover effect */
  zone.addEventListener("dragover", e => {
    e.preventDefault();
    zone.classList.add(
      "border-primary",
      "bg-slate-900/80",
      "shadow-[0_0_20px_rgba(19,91,236,0.3)]"
    );
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove(
      "border-primary",
      "bg-slate-900/80",
      "shadow-[0_0_20px_rgba(19,91,236,0.3)]"
    );
  });

  /* Drop */
 zone.addEventListener("drop", e => {
  e.preventDefault();
  if (!dragged) return;

  if (zone.dataset.filled === "true") {
    dragged = null;
    return;
  }

  const acceptedType = zone.dataset.accept;

  const fuseType = [...dragged.classList].find(cls =>
    ["quantum","plasma","thermal","typeA"].includes(cls)
  );

  if (fuseType !== acceptedType) {
    dragged = null;
    return;
  }

  // 🔥 Supprimer complètement l’original
  dragged.remove();

  // Nettoyer le slot
  zone.innerHTML = "";

  // 🎨 Couleurs selon type
  let bgColor = "";
  let iconColor = "";
  let iconName = "blur_on";
  

  if (fuseType === "plasma") {
    bgColor = "bg-primary/10";
    iconColor = "text-primary";
  }

  if (fuseType === "quantum") {
    bgColor = "bg-purple-500/10";
    iconColor = "text-purple-400";
  }

  if (fuseType === "thermal") {
    bgColor = "bg-accent-yellow/10";
    iconColor = "text-accent-yellow";
  }

  // 📦 Création du nouveau bloc stylisé
  const fuseBox = document.createElement("div");
  fuseBox.className =
    "w-24 h-32 bg-gradient-to-br from-slate-700 to-slate-900 rounded border border-slate-600 flex items-center justify-center relative overflow-hidden";

  // Overlay couleur
  const overlay = document.createElement("div");
  overlay.className = `absolute inset-0 ${bgColor}`;

  // Effet scan
  const scanLine = document.createElement("div");
  scanLine.className =
    "absolute w-full h-1 top-0 left-0 animate-[scan_2s_ease-in-out_infinite] bg-white/30";

  // Icône
  const icon = document.createElement("span");
  icon.className = `material-symbols-outlined ${iconColor} text-2xl`;
  if (fuseType === "thermal") {
    iconName = "whatshot";
  }
  else if (fuseType === "typeA") {
    iconName = "adf_scanner";
  }
  else if (fuseType === "quantum") {
    iconName = "blur_on";
  }
  else if (fuseType === "plasma") {
    iconName = "electric_bolt";
  }
  icon.textContent = iconName;

  // Assemblage
  fuseBox.appendChild(overlay);
  fuseBox.appendChild(scanLine);
  fuseBox.appendChild(icon);

  zone.appendChild(fuseBox);

  zone.dataset.filled = "true";
  const index = zone.dataset.index;

if (indicators[index]) {
  indicators[index].classList.remove("bg-slate-800");
  indicators[index].classList.add("bg-primary");
}

  insertedFuses++;
  updateVoltage();

  dragged = null;
});

});
/*INDICATOR*/
