/*compteur*/
let s = 4 * 3600 + 59 * 60 + 2;
const el = document.getElementById("counter");

setInterval(() => {
  if (s <= 0) return;
  s--;
  el.textContent = new Date(s * 1000).toISOString().slice(11, 19);
}, 1000);

/*fusible*/
const fuses = document.querySelectorAll(".fuse-item");
const dropZones = document.querySelectorAll(".border-dashed"); // TOUTES les zones de drop

let dragged = null;

// Drag start
fuses.forEach((f) => {
  f.addEventListener("dragstart", () => {
    dragged = f;
  });
});

// Drag & drop
dropZones.forEach((zone) => {
  zone.addEventListener("dragover", (e) => {
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
});

// Drag & drop sans clone
dropZones.forEach((zone) => {
  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    if (!dragged) return;

    // Clear le slot avant d'ajouter la fuse
    zone.innerHTML = "";

    // Utiliser la fuse dragguée directement (pas de clone)
    const fuseDropped = dragged;
    dragged = null; // reset pour le prochain drag

    // Ajouter les classes style "validé" (slot 2)
    fuseDropped.classList.add(
      "w-16",
      "h-24",
      "bg-gradient-to-b",
      "from-slate-700",
      "to-slate-800",
      "rounded",
      "border",
      "border-slate-600",
      "flex",
      "items-center",
      "justify-center",
      "relative",
      "overflow-hidden",
      "group-hover:brightness-110",
    );

    // Scan line
    const scanLine = document.createElement("div");
    scanLine.className =
      "absolute w-full h-1 top-0 left-0 animate-[scan_2s_ease-in-out_infinite] bg-white/30";
    fuseDropped.appendChild(scanLine);

    // Sparks
    const sparkContainer = document.createElement("div");
    sparkContainer.className = "absolute -right-2 -top-2";
    const spark = document.createElement("span");
    spark.className =
      "material-symbols-outlined text-accent-yellow text-sm animate-ping opacity-75";
    spark.textContent = "flash_on";
    sparkContainer.appendChild(spark);
    fuseDropped.appendChild(sparkContainer);

    // Ajouter le fusible dans le slot
    zone.appendChild(fuseDropped);

    // Supprimer le style hover du drop
    zone.classList.remove(
      "border-primary",
      "bg-slate-900/80",
      "shadow-[0_0_20px_rgba(19,91,236,0.3)]",
    );

    // Mettre à jour la barre et le status
    insertedFuses++;
    updateVoltage();
  });
});

/*BARRE*/

let insertedFuses = 0;
const maxFuses = 3; // nombre de fuses total pour 100%
const voltageBar = document.getElementById("voltageBar");
const voltageText = document.getElementById("voltageText");

// Fonction pour mettre à jour la barre
function updateVoltage() {
  const percent = Math.min(Math.round((insertedFuses / maxFuses) * 100), 100);
  voltageBar.style.width = percent + "%";
  voltageText.textContent = percent + "%";
  if (percent === 100) {
    const statusEl = document.getElementById("status");
    if (statusEl) {
      statusEl.textContent = "ONLINE";
      statusEl.classList.add("text-green-500", "font-bold"); // optionnel : couleur verte
    }
  }
}

// Exemple : ajouter une fuse

dropZones.forEach((zone) => {
  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    if (!dragged) return;

    // Clear le slot
    zone.innerHTML = "";

    // Utiliser la fuse réellement draguée
    const fuseClone = dragged.cloneNode(true); // ou juste dragged si tu veux enlever l’original
    dragged = null;

    // Classes style "validé" (slot 2)
    fuseClone.classList.add(
      "w-16",
      "h-24",
      "bg-gradient-to-b",
      "from-slate-700",
      "to-slate-800",
      "rounded",
      "border",
      "border-slate-600",
      "flex",
      "items-center",
      "justify-center",
      "relative",
      "overflow-hidden",
      "group-hover:brightness-110",
    );

    // Scan line
    const scanLine = document.createElement("div");
    scanLine.className =
      "absolute w-full h-1 top-0 left-0 animate-[scan_2s_ease-in-out_infinite] bg-white/30";
    fuseClone.appendChild(scanLine);

    // Sparks
    const sparkContainer = document.createElement("div");
    sparkContainer.className = "absolute -right-2 -top-2";
    const spark = document.createElement("span");
    spark.className =
      "material-symbols-outlined text-accent-yellow text-sm animate-ping opacity-75";
    spark.textContent = "flash_on";
    sparkContainer.appendChild(spark);
    fuseClone.appendChild(sparkContainer);

    // Ajouter le fusible dans le slot
    zone.appendChild(fuseClone);

    // Mettre à jour la barre
    insertedFuses++;
    updateVoltage();

    // Supprime le style hover du drop
    zone.classList.remove(
      "border-primary",
      "bg-slate-900/80",
      "shadow-[0_0_20px_rgba(19,91,236,0.3)]",
    );
  });
});
