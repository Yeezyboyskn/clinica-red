const API = "http://localhost:3000/api";

// Verificar usuario y rol (user ya está disponible desde dashboard.html)
if (!user || user.rol !== "medico") {
  alert("Sesión inválida.");
  location.href = "index.html";
}

// Función para asegurar que el DOM esté listo
function inicializarPanel() {
  // Crear la interfaz del médico
  document.getElementById("contenido").innerHTML = `
    <div class="card card-custom p-4">
      <h4 class="mb-3">👨‍⚕️ Panel del Médico: ${user.nombre}</h4>

      <div class="mb-3">
        <button id="btnConectar" class="btn btn-outline-success me-2">🟢 Conectarse</button>
        <button id="btnDesconectar" class="btn btn-outline-danger">🔴 Desconectarse</button>
        <span id="estadoActual" class="ms-3"></span>
      </div>

      <hr>

      <h5>📅 Mis Reservas</h5>
      <div class="mb-3">
        <div class="row">
          <div class="col-md-8">
            <input type="text" id="filtroFecha" placeholder="Filtrar por día (ej: VIERNES)" class="form-control">
          </div>
          <div class="col-md-4">
            <button class="btn btn-primary w-100" onclick="cargarMisReservas()">Buscar</button>
          </div>
        </div>
      </div>
      <div id="misReservas">
        <div class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-2">Cargando reservas...</p>
        </div>
      </div>

      <hr>

      <h5>➕ Crear Reserva Manual</h5>
      <form id="formManual" class="row g-2">
        <div class="col-md-3">
          <input class="form-control" id="rutPaciente" placeholder="RUT Paciente" required>
        </div>
        <div class="col-md-3">
          <input class="form-control" id="fechaReserva" placeholder="Día (ej: VIERNES)" required>
        </div>
        <div class="col-md-3">
          <input class="form-control" id="horaReserva" placeholder="Hora (ej: 08:30)" required>
        </div>
        <div class="col-md-3">
          <button type="submit" class="btn btn-success w-100">Crear</button>
        </div>
      </form>
    </div>
  `;

  // Configurar event listeners después de crear la interfaz
  configurarEventListeners();
  
  // Cargar datos iniciales
  cargarMisReservas();
  actualizarEstado(false); // inicia desconectado por defecto
}

// Configurar todos los event listeners
function configurarEventListeners() {
  // Botones de conexión
  document.getElementById("btnConectar").onclick = () => actualizarEstado(true);
  document.getElementById("btnDesconectar").onclick = () => actualizarEstado(false);
  
  // Formulario de reserva manual
  document.getElementById("formManual").onsubmit = async (e) => {
    e.preventDefault();
    await crearReservaManual();
  };

  // Enter en el filtro de fecha
  document.getElementById("filtroFecha").onkeypress = (e) => {
    if (e.key === 'Enter') {
      cargarMisReservas();
    }
  };
}

// Colores por día
function diaAClase(diaTexto) {
  const d = diaTexto.toLowerCase();
  if (d.includes("lunes")) return "table-primary";
  if (d.includes("martes")) return "table-success";
  if (d.includes("miércoles")) return "table-warning";
  if (d.includes("jueves")) return "table-info";
  if (d.includes("viernes")) return "table-light";
  if (d.includes("sábado")) return "table-secondary";
  return "table-light";
}

// Función auxiliar para hacer peticiones
async function fetchJSON(url, opts = {}) {
  try {
    const res = await fetch(url, opts);
    if (!res.ok) {
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error en petición:', error);
    throw error;
  }
}

// ======================== ESTADO CONECTADO =======================
async function actualizarEstado(activo) {
  try {
    await fetch(`${API}/usuarios/${user.rut}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activo })
    });
    
    const estadoElement = document.getElementById("estadoActual");
    const btnConectar = document.getElementById("btnConectar");
    const btnDesconectar = document.getElementById("btnDesconectar");
    
    if (estadoElement && btnConectar && btnDesconectar) {
      estadoElement.innerHTML = activo 
        ? '<span class="badge bg-success">✅ Conectado</span>' 
        : '<span class="badge bg-danger">❌ Desconectado</span>';
      btnConectar.disabled = activo;
      btnDesconectar.disabled = !activo;
    }
  } catch (error) {
    console.error('Error actualizando estado:', error);
    alert('Error al actualizar el estado. Verifique la conexión.');
  }
}

//ESTADISTICA
async function cargarEstadisticasMedico() {
  const cont = document.getElementById("estadisticasMedico");
  try {
    const data = await fetchJSON(`${API}/estadisticas/medico/${encodeURIComponent(user.nombre)}`);
    if (!data || !data.total) {
      cont.innerHTML = "<p>No tienes reservas aún.</p>";
      return;
    }

    let html = `<p>Total de reservas: <strong>${data.total}</strong></p><ul class="list-group">`;
    data.dias.forEach(d => {
      html += `<li class="list-group-item d-flex justify-content-between align-items-center">
        ${d._id}
        <span class="badge bg-info">${d.total}</span>
      </li>`;
    });
    html += "</ul>";
    cont.innerHTML = html;
  } catch (error) {
    cont.innerHTML = "<p class='text-danger'>Error al cargar estadísticas.</p>";
  }
}


// ======================== RESERVAS =======================
async function cargarMisReservas() {
  const contenedor = document.getElementById("misReservas");
  if (!contenedor) return;

  try {
    // Mostrar indicador de carga
    contenedor.innerHTML = `
      <div class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-2">Cargando reservas...</p>
      </div>
    `;

    const filtro = document.getElementById("filtroFecha")?.value.trim() || '';
    const url = `${API}/reservas?profesional=${encodeURIComponent(user.nombre)}${filtro ? `&fecha=${encodeURIComponent(filtro)}` : ""}`;
    
    const reservas = await fetchJSON(url);

    if (!reservas || reservas.length === 0) {
      contenedor.innerHTML = `
        <div class="alert alert-info">
          <i class="bi bi-info-circle"></i> No hay reservas registradas.
        </div>
      `;
      return;
    }

    let html = `
      <div class="table-responsive">
        <table class="table table-hover table-bordered">
          <thead class="table-dark">
            <tr>
              <th>Paciente</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Previsión</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    reservas.forEach(r => {
      html += `
        <tr class="${diaAClase(r.fecha)}">
          <td><strong>${r.rut}</strong></td>
          <td>${r.fecha}</td>
          <td>${r.hora}</td>
          <td><span class="badge bg-secondary">${r.prevision || 'N/A'}</span></td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="eliminarReserva('${r._id}')">
              🗑️ Eliminar
            </button>
          </td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
      </div>
      <small class="text-muted">Total de reservas: ${reservas.length}</small>
    `;
    
    contenedor.innerHTML = html;
  } catch (error) {
    console.error('Error cargando reservas:', error);
    contenedor.innerHTML = `
      <div class="alert alert-danger">
        <strong>Error:</strong> No se pudieron cargar las reservas. 
        <button class="btn btn-sm btn-outline-danger ms-2" onclick="cargarMisReservas()">
          Reintentar
        </button>
      </div>
    `;
  }
}

async function eliminarReserva(id) {
  if (!confirm("¿Está seguro de que desea eliminar esta reserva?")) return;
  
  try {
    await fetch(`${API}/reservas/${id}`, { method: "DELETE" });
    alert("✅ Reserva eliminada correctamente");
    cargarMisReservas();
  } catch (error) {
    console.error('Error eliminando reserva:', error);
    alert("❌ Error al eliminar la reserva");
  }
}

// ======================== RESERVA MANUAL =======================
async function crearReservaManual() {
  const rut = document.getElementById("rutPaciente")?.value.trim();
  const fecha = document.getElementById("fechaReserva")?.value.trim().toUpperCase();
  const hora = document.getElementById("horaReserva")?.value.trim();

  if (!rut || !fecha || !hora) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  // Validación básica de RUT (formato chileno)
  if (!/^\d{7,8}-[\dkK]$/.test(rut)) {
    alert("Formato de RUT inválido. Use formato: 12345678-9");
    return;
  }

  // Validación básica de hora
  if (!/^\d{1,2}:\d{2}$/.test(hora)) {
    alert("Formato de hora inválido. Use formato: HH:MM (ej: 08:30)");
    return;
  }

  try {
    const response = await fetch(`${API}/reservas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rut,
        prevision: "Fonasa", // valor por defecto
        fecha,
        hora,
        profesional: user.nombre
      })
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    alert("✅ Reserva creada exitosamente");
    document.getElementById("formManual").reset();
    cargarMisReservas();
  } catch (error) {
    console.error('Error creando reserva:', error);
    alert("❌ Error al crear la reserva. Verifique los datos e intente nuevamente.");
  }
}

// ======================== INICIALIZACIÓN =======================
// Asegurar que el DOM esté completamente cargado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarPanel);
} else {
  // Si ya está cargado, ejecutar inmediatamente
  inicializarPanel();
  cargarEstadisticasMedico();

}