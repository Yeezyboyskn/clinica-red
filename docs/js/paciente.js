document.getElementById("contenido").innerHTML = `
  <div class="card card-custom p-4">
    <h4 class="mb-3">Reservar Atención Médica</h4>
    <form id="formReserva">
      <div class="mb-3">
        <select class="form-select" id="especialidad" required>
          <option value="">Selecciona Especialidad</option>
        </select>
      </div>
      <div class="mb-3">
        <select class="form-select" id="profesional" required>
          <option value="">Selecciona Doctor</option>
        </select>
      </div>
      <div class="mb-3">
        <select class="form-select" id="dia" required>
          <option value="">Selecciona Día</option>
        </select>
      </div>
      <div class="mb-3">
        <select class="form-select" id="hora" required>
          <option value="">Selecciona Hora</option>
        </select>
      </div>
      <div class="d-grid">
        <button class="btn btn-primary">Reservar</button>
      </div>
    </form>
  </div>
`;

async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, opts);
  return res.json();
}

const API = "http://localhost:3000/api";
const especialidadSelect = document.getElementById("especialidad");
const profesionalSelect = document.getElementById("profesional");
const diaSelect = document.getElementById("dia");
const horaSelect = document.getElementById("hora");

async function cargarEspecialidades() {
  const especialidades = await fetchJSON(`${API}/especialidades`);
  especialidades.forEach(e => {
    especialidadSelect.innerHTML += `<option value="${e}">${e}</option>`;
  });
}
cargarEspecialidades();

especialidadSelect.onchange = async () => {
  const esp = especialidadSelect.value;
  profesionalSelect.innerHTML = `<option value="">Cargando...</option>`;
  const doctores = await fetchJSON(`${API}/doctores/${encodeURIComponent(esp)}`);
  profesionalSelect.innerHTML = `<option value="">Selecciona Doctor</option>`;
  doctores.forEach(d => {
    profesionalSelect.innerHTML += `<option value="${d}">${d}</option>`;
  });
  diaSelect.innerHTML = `<option value="">Selecciona Día</option>`;
  horaSelect.innerHTML = `<option value="">Selecciona Hora</option>`;
};

profesionalSelect.onchange = async () => {
  const prof = profesionalSelect.value;
  const dias = await fetchJSON(`${API}/horarios/${encodeURIComponent(prof)}`);
  diaSelect.innerHTML = `<option value="">Selecciona Día</option>`;
  Object.keys(dias).forEach(d => {
    if (dias[d].length > 0) {
      diaSelect.innerHTML += `<option value="${d}">${d}</option>`;
    }
  });
  horaSelect.innerHTML = `<option value="">Selecciona Hora</option>`;
};

diaSelect.onchange = async () => {
  const prof = profesionalSelect.value;
  const dia = diaSelect.value;
  const dias = await fetchJSON(`${API}/horarios/${encodeURIComponent(prof)}`);
  horaSelect.innerHTML = `<option value="">Selecciona Hora</option>`;
  dias[dia].forEach(h => {
    horaSelect.innerHTML += `<option value="${h}">${h}</option>`;
  });
};

document.getElementById("formReserva").onsubmit = async (e) => {
  e.preventDefault();
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const data = {
    rut: usuario.rut,
    prevision: "Fonasa",
    fecha: diaSelect.value,
    hora: horaSelect.value,
    profesional: profesionalSelect.value
  };
  await fetchJSON(`${API}/reservas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  alert("✅ Reserva creada exitosamente");
};
