const API = "http://localhost:3000/api";

// Cargar estructura del panel de administración
document.getElementById("contenido").innerHTML = `
<div class="card card-custom p-4 mt-4">
  <h4>📊 Estadísticas</h4>
  <div id="statsMedicos">Cargando top médicos...</div>
</div>
<div class="card card-custom p-4 mt-4">


<div class="card card-custom p-4">
  <h4>📦 Gestión de Boxes</h4>
  <div id="boxList">Cargando...</div>
  <hr>
  <h4>👨‍⚕️ Gestión de Médicos</h4>
  <div id="doctorList">Cargando...</div>
<form id="formDoctor" class="row g-2 mt-3">
  <div class="col-md-2">
    <input class="form-control" id="rutMed" placeholder="RUT" required>
  </div>
  <div class="col-md-2">
    <input class="form-control" id="nombreMed" placeholder="Nombre" required>
  </div>
  <div class="col-md-2">
    <input class="form-control" id="passMed" type="password" placeholder="Contraseña" required>
  </div>
  <div class="col-md-2">
    <input class="form-control" id="especialidadMed" placeholder="Especialidad" required>
  </div>
  <div class="col-md-2">
    <input class="form-control" id="correoMed" placeholder="Correo" required>
  </div>
  <div class="col-md-2">
    <input class="form-control" id="telefonoMed" placeholder="Teléfono" required>
  </div>
  <div class="col-12 text-end mt-2">
    <button class="btn btn-success">Agregar Médico</button>
  </div>
</form>

</div>

<div class="card card-custom p-4 mt-4">
  <h4>📆 Todas las Reservas del Sistema</h4>
  <div id="tablaReservas">Cargando...</div>
  <hr>
<h5>➕ Crear Reserva Manual</h5>
<form id="formReservaManual" class="row g-2 mb-3">
  <div class="col-md-2"><input class="form-control" id="rutManual" placeholder="RUT" required></div>
  <div class="col-md-2"><input class="form-control" id="profManual" placeholder="Profesional" required></div>
  <div class="col-md-2"><input class="form-control" id="fechaManual" placeholder="Día (ej: VIERNES)" required></div>
  <div class="col-md-2"><input class="form-control" id="horaManual" placeholder="Hora (ej: 09:00)" required></div>
  <div class="col-md-2"><input class="form-control" id="prevManual" placeholder="Previsión (ej: Fonasa)"></div>
  <div class="col-md-2"><button class="btn btn-success w-100">Guardar</button></div>
</form>
</div>

`;

// Colores por día (opcional)
function diaAClase(diaTexto) {
  const d = diaTexto.toLowerCase();
  if (d.includes("lunes")) return "bg-light";
  if (d.includes("martes")) return "bg-light";
  if (d.includes("miércoles")) return "bg-light";
  if (d.includes("jueves")) return "bg-light";
  if (d.includes("viernes")) return "bg-light";
  if (d.includes("sábado")) return "bg-light";
  return "";
}
async function cargarTopMedicos() {
  const res = await fetch(`${API}/estadisticas/top-medicos`);
  const data = await res.json();

  if (!data.length) {
    document.getElementById("statsMedicos").innerHTML = "<p>No hay datos disponibles.</p>";
    return;
  }

  let html = "<ol class='list-group list-group-numbered'>";
  data.forEach(m => {
    html += `<li class="list-group-item d-flex justify-content-between align-items-center">
      <strong>${m._id}</strong>
      <span class="badge bg-primary rounded-pill">${m.total} reservas</span>
    </li>`;
  });
  html += "</ol>";

  document.getElementById("statsMedicos").innerHTML = html;
}

// =========================
// 📦 CRUD Boxes
// =========================

async function cargarBoxes() {
  const res = await fetch(`${API}/boxes`);
  const boxes = await res.json();

  let html = "<table class='table table-sm'>";
  html += "<thead><tr><th>ID</th><th>Piso</th><th>Tipo</th><th>Estado</th><th>ID Interno</th></tr></thead><tbody>";
  boxes.forEach(b => {
    html += `<tr>
      <td>${b.boxId}</td>
      <td><input value="${b.piso}" class="form-control form-control-sm" onchange="actualizarBox('${b._id}', 'piso', this.value)"></td>
      <td><input value="${b.tipo}" class="form-control form-control-sm" onchange="actualizarBox('${b._id}', 'tipo', this.value)"></td>
      <td><input value="${b.estado}" class="form-control form-control-sm" onchange="actualizarBox('${b._id}', 'estado', this.value)"></td>
      <td>${b._id}</td>
    </tr>`;
  });
  html += "</tbody></table>";
  document.getElementById("boxList").innerHTML = html;
}

async function actualizarBox(id, campo, valor) {
  await fetch(`${API}/boxes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ [campo]: valor })
  });
}

// =========================
// 👨‍⚕️ CRUD Médicos
// =========================

async function cargarMedicos() {
  const res = await fetch(`${API}/usuarios/medicos`);
  const medicos = await res.json();

  let html = "<ul class='list-group'>";
medicos.forEach(m => {
  const estado = m.activo ? "🟢 Conectado" : "🔴 Desconectado";
  html += `<li class="list-group-item d-flex justify-content-between align-items-center">
    <div>
      <strong>${m.nombre}</strong> (${m.rut}) — ${estado}
    </div>
    <button class="btn btn-sm btn-danger" onclick="eliminarMedico('${m.rut}')">Eliminar</button>
  </li>`;
});
  html += "</ul>";
  document.getElementById("doctorList").innerHTML = html;
}

async function eliminarMedico(rut) {
  if (confirm("¿Eliminar este médico?")) {
    await fetch(`${API}/usuarios/${rut}`, { method: "DELETE" });
    cargarMedicos();
  }
}
//AGREGACION DE FFORMULARIO
document.getElementById("formDoctor").onsubmit = async (e) => {
  e.preventDefault();

  const rut = document.getElementById("rutMed").value.trim();
  const nombre = document.getElementById("nombreMed").value.trim();
  const password = document.getElementById("passMed").value.trim();
  const especialidad = document.getElementById("especialidadMed").value.trim();
  const correo = document.getElementById("correoMed").value.trim();
  const telefono = document.getElementById("telefonoMed").value.trim();

  if (!rut || !nombre || !password || !especialidad || !correo || !telefono) {
    alert("⚠️ Completa todos los campos.");
    return;
  }

  try {
    const res = await fetch(`${API}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rut, nombre, password, rol: "medico", especialidad, correo, telefono })
    });

    if (res.status === 409) {
      alert("⚠️ Ya existe un médico con ese RUT.");
      return;
    }

    alert("✅ Médico agregado correctamente");
    e.target.reset();
    cargarMedicos();
  } catch (err) {
    console.error(err);
    alert("❌ Error al agregar médico");
  }
};


// =========================
// 📋 Visualizar Reservas
// =========================

async function cargarReservas() {
  const res = await fetch(`${API}/reservas`);
  const reservas = await res.json();

  if (!reservas.length) {
    document.getElementById("tablaReservas").innerHTML = "<p>⚠️ No hay reservas registradas.</p>";
    return;
  }

  let html = `<table class="table table-bordered table-sm"><thead><tr>
    <th>Paciente</th><th>Profesional</th><th>Previsión</th><th>Fecha</th><th>Hora</th><th>Acciones</th>
  </tr></thead><tbody>`;

  reservas.forEach(r => {
    html += `<tr>
      <td><input class="form-control form-control-sm" value="${r.rut || ''}" id="rut-${r._id}"></td>
      <td><input class="form-control form-control-sm" value="${r.profesional}" id="prof-${r._id}"></td>
      <td><input class="form-control form-control-sm" value="${r.prevision || ''}" id="prev-${r._id}"></td>
      <td><input class="form-control form-control-sm" value="${r.fecha}" id="fecha-${r._id}"></td>
      <td><input class="form-control form-control-sm" value="${r.hora}" id="hora-${r._id}"></td>
      <td>
        <button class="btn btn-sm btn-success me-1" onclick="editarReserva('${r._id}')">💾</button>
        <button class="btn btn-sm btn-danger" onclick="eliminarReserva('${r._id}')">🗑</button>
      </td>
    </tr>`;
  });

  html += "</tbody></table>";
  document.getElementById("tablaReservas").innerHTML = html;
}

document.getElementById("formReservaManual").onsubmit = async (e) => {
  e.preventDefault();

  const data = {
    rut: document.getElementById("rutManual").value.trim(),
    profesional: document.getElementById("profManual").value.trim(),
    fecha: document.getElementById("fechaManual").value.trim().toUpperCase(),
    hora: document.getElementById("horaManual").value.trim(),
    prevision: document.getElementById("prevManual").value.trim() || "Fonasa"
  };

  await fetch(`${API}/reservas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  alert("✅ Reserva creada");
  e.target.reset();
  cargarReservas();
};

async function eliminarReserva(id) {
  if (!confirm("¿Eliminar esta reserva?")) return;
  await fetch(`${API}/reservas/${id}`, { method: "DELETE" });
  alert("✅ Eliminada");
  cargarReservas();
}

async function editarReserva(id) {
  const rut = document.getElementById(`rut-${id}`).value.trim();
  const profesional = document.getElementById(`prof-${id}`).value.trim();
  const prevision = document.getElementById(`prev-${id}`).value.trim();
  const fecha = document.getElementById(`fecha-${id}`).value.trim().toUpperCase();
  const hora = document.getElementById(`hora-${id}`).value.trim();

  await fetch(`${API}/reservas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rut, profesional, prevision, fecha, hora })
  });

  alert("✅ Reserva actualizada");
  cargarReservas();
}



// =========================
// Inicializar Panel
// =========================

cargarBoxes();
cargarMedicos();
cargarReservas();


cargarTopMedicos();
