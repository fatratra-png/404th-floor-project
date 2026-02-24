// Affiche le temps de jeu écoulé si dispo
const state = JSON.parse(localStorage.getItem("404floor_progress") || "{}");
if (state.startTime) {
  const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
  const m = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const s = String(elapsed % 60).padStart(2, "0");
  document.getElementById("time-val").textContent = `${m}:${s}`;
}

function restart() {
  localStorage.removeItem("404floor_progress");
  window.location.href = "index.html";
}
