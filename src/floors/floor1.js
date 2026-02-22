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
const statusText = document.getElementById('status');

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
      "shadow-[0_0_20px_rgba(19,91,236,0.3)]",
    );
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove(
      "border-primary",
      "bg-slate-900/80",
      "shadow-[0_0_20px_rgba(19,91,236,0.3)]",
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

// Liste des nodes dans l’ordre
const nodeClasses = ["NODE_A", "NODE_B", "NODE_C"];

const node = document.querySelector(`.${nodeClasses[index]}`);

if (node) {
  const dot = node.querySelector("div");
  const label = node.querySelector("span");

  // 🔵 Rond
  dot.className =
    "w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_5px_#135bec]";

  // 📝 Texte
  label.className =
    "text-xs text-primary font-bold font-mono";
}

if (indicators[index]) {
  indicators[index].classList.remove("bg-slate-800");
  indicators[index].classList.add("bg-primary");
}

  insertedFuses++;
  updateVoltage();

  dragged = null;
});

});
/*INVENTORY TOGGLE*/

const inventory = document.getElementById("inventoryContainer");
const toggleBtn = document.getElementById("inventory");
toggleBtn.addEventListener("click", () => {
  if (inventory.classList.contains("hidden")) {
    inventory.classList.remove("hidden");
  } else {
    inventory.classList.add("hidden");
  }
});/*
/*FINAL ANIMATION*/
const rebootButton = document.querySelector('button');
rebootButton.addEventListener('click', async () => {
  const allFilled = [...dropZones].every(z => z.dataset.filled === 'true');
  if (!allFilled) {
    rebootButton.classList.add('animate-shake');
    setTimeout(() => rebootButton.classList.remove('animate-shake'), 500);
    return;
  }

  rebootButton.disabled = true;
  rebootButton.innerHTML = `<span class="material-symbols-outlined mr-2 text-[18px]">engineering</span>REBOOTING...`;
  const nodes = [
  document.querySelector('.NODE_A'),
  document.querySelector('.NODE_B'),
  document.querySelector('.NODE_C')
];

  nodes.forEach(node => {
    const dot = node.querySelector('div');
    const label = node.querySelector('span');
    dot.classList.add('bg-primary', 'animate-pulse', 'shadow-[0_0_5px_#135bec]');
    label.classList.add('text-primary', 'font-bold');
  });

  let voltage = 0;
  const ramp = setInterval(() => {
    voltage += 2;
    if (voltage > 100) voltage = 100;
    voltageBar.style.width = voltage + '%';
    voltageText.textContent = voltage + '%';
    if (voltage === 100) clearInterval(ramp);
  }, 50);

  const panel = document.querySelector('.relative.w-full.max-w-4xl');
  panel.classList.add('animate-[flash_0.3s_ease-in-out_3]');
  
  const status = statusText;
  status.textContent = 'ONLINE';
  status.classList.remove('text-accent-red');
  status.classList.add('text-primary');

  await new Promise(res => setTimeout(res, 2800));

  const accessMsg = document.createElement('div');
  accessMsg.textContent = 'SYSTEM ONLINE - ACCESS GRANTED';
  accessMsg.className =
    'absolute inset-0 flex items-center justify-center text-4xl text-green-400 font-bold pointer-events-none animate-[pulse_1s_ease-in-out_infinite]';
  panel.appendChild(accessMsg);

    await new Promise(res => setTimeout(res, 2000));
    accessMsg.remove();
    const curtainTop = document.getElementById('curtainTop');
    const curtainBottom = document.getElementById('curtainBottom');
    curtainTop.classList.add('transition-[height]', 'duration-700', 'ease-in-out');
    curtainBottom.classList.add('transition-[height]', 'duration-700', 'ease-in-out');

    // Déclencher l’animation rideaux
    curtainTop.style.height = '50%';
    curtainBottom.style.height = '50%';

  // transition vers étage suivant
  setTimeout(() => {
    accessMsg.remove();
    // Ici tu peux déclencher l’ouverture de porte ou la transition
  }, 2000);
});