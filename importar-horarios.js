const mongoose = require("mongoose");
const xlsx = require("xlsx");
const Horario = require("./backend/models/Horario");

mongoose.connect("mongodb+srv://oscaralejandro39:Goliat01$@clinica.8peosoz.mongodb.net/clinica");

const workbook = xlsx.readFile("RedSalud - Distribucion de Box 2025.xlsx");
const sheet = workbook.Sheets["Ofertas Vigente"];
const data = xlsx.utils.sheet_to_json(sheet);

const diasSemana = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];

async function importarHorarios() {
  const horarios = [];

  data.forEach((fila) => {
    const profesional = fila["Nombre"];
    const especialidad = fila["Especialidad"];
    const piso = parseInt(fila["Piso atencion"]);
    if (!profesional || !especialidad || isNaN(piso)) return;

    const dias = {};

    diasSemana.forEach(dia => {
      const valor = fila[dia];
      if (typeof valor === "string") {
        const horarioLimpio = valor.split("(")[0].trim();
        dias[dia] = [horarioLimpio];
      } else {
        dias[dia] = [];
      }
    });

    horarios.push({
      profesional,
      especialidad,
      region: "RM",
      comuna: "Santiago",
      piso,
      dias
    });
  });

  await Horario.insertMany(horarios);
  console.log("✅ Horarios cargados:", horarios.length);
  mongoose.disconnect();
}

importarHorarios();
