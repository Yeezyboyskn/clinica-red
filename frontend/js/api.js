const API = "https://clinica-red-production.up.railway.app/api";


async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, opts);
  return res.json();
}

async function obtenerReservas(filtro = {}) {
  const params = new URLSearchParams(filtro).toString();
  const res = await fetch(`${API}/reservas?${params}`);
  return res.json();
}
