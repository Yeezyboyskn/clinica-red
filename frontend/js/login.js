const API = "https://clinica-red-production.up.railway.app/api";

// =============== LOGIN ====================
async function login(e) {
  e.preventDefault();
  const rut = document.getElementById("rut").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rut, password })
  });

  if (res.ok) {
    const user = await res.json();
    localStorage.setItem("usuario", JSON.stringify(user));
    location.href = "dashboard.html";
  } else {
    document.getElementById("error").innerText = "❌ Credenciales inválidas.";
  }
}

// =============== REGISTRO PACIENTE ====================
async function registrarPaciente(e) {
  e.preventDefault();
  const rut = document.getElementById("rutRegistro").value.trim();
  const nombre = document.getElementById("nombreRegistro").value.trim();
  const prevision = document.getElementById("previsionRegistro").value.trim();
  const password = document.getElementById("passwordRegistro").value.trim();

  // Validación de formato de RUT (solo pacientes)
  if (!/^\d{7,8}-[\dkK]$/.test(rut)) {
    document.getElementById("registroError").innerText = "❌ El RUT debe tener el formato 12345678-9";
    return;
  }

  try {
    const res = await fetch(`${API}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rut,
        nombre,
        password,
        rol: "paciente",
        prevision
      })
    });

    if (res.ok) {
      document.getElementById("registroOk").innerText = "✅ Cuenta creada correctamente. Ya puedes iniciar sesión.";
      document.getElementById("registroError").innerText = "";
      e.target.reset();
    } else {
      const data = await res.json();
      document.getElementById("registroError").innerText = `❌ ${data.error || "Error al registrar paciente"}`;
      document.getElementById("registroOk").innerText = "";
    }
  } catch (err) {
    console.error("Error al registrar paciente:", err);
    document.getElementById("registroError").innerText = "❌ Error de conexión con el servidor";
  }
}
