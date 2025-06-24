const mongoose = require("mongoose");
const xlsx = require("xlsx");
const Usuario = require("./backend/models/Usuario");

mongoose.connect("mongodb+srv://oscaralejandro39:Goliat01$@clinica.8peosoz.mongodb.net/clinica", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const workbook = xlsx.readFile("RedSalud - Distribucion de Box 2025.xlsx");
const sheet = workbook.Sheets["Coord Especialidad"];
const data = xlsx.utils.sheet_to_json(sheet);

async function importarDoctores() {
  let inserts = [];
  let id = 1;

  data.forEach((fila) => {
    const nombre = fila["Jefe de Equipo"];
    const subesp = fila["Subespecialidad"];
    const correo = fila["Correo Electrónico"];
    const telefono = fila["Teléfono"];

    if (nombre && subesp) {
      inserts.push({
        rut: `DR${String(id).padStart(3, "3")}`, // DR001, DR002...
        nombre: nombre,
        password: "123", // puedes cambiar esto luego por seguridad
        rol: "medico",
        especialidad: subesp,
        correo: correo || "",
        telefono: telefono || ""
      });
      id++;
    }
  });

  if (inserts.length > 0) {
    await Usuario.insertMany(inserts);
    console.log("✅ Doctores cargados:", inserts.length);
  } else {
    console.log("⚠️ No se encontraron doctores para cargar.");
  }

  mongoose.disconnect();
}

importarDoctores();
