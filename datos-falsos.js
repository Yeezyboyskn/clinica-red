const mongoose = require("mongoose");
const Usuario = require("./backend/models/Usuario");
const Box = require("./backend/models/Box");
const Horario = require("./backend/models/Horario");

mongoose.connect("mongodb+srv://oscaralejandro39:Goliat01$@clinica.8peosoz.mongodb.net/clinica");

(async () => {
  await Usuario.insertMany([
    { rut: "11111111-1", nombre: "Paciente Uno", password: "123", rol: "paciente" },
    { rut: "22222222-2", nombre: "Doctor Dos", password: "123", rol: "medico" },
    { rut: "33333333-3", nombre: "Admin Tres", password: "123", rol: "admin" },
  ]);

  await Box.insertMany([
    { boxId: "bx-101", piso: 1, tipo: "consulta", estado: "disponible" },
    { boxId: "bx-202", piso: 2, tipo: "urgencia", estado: "ocupado" },
  ]);

  await Horario.insertMany([
    {
      region: "RM",
      comuna: "Santiago",
      especialidad: "Medicina General",
      profesional: "Doctor Dos",
      horas: ["09:00", "09:30", "10:00"]
    }
  ]);

  console.log("✅ Datos falsos cargados");
  mongoose.disconnect();
})();
