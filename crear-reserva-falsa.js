const mongoose = require("mongoose");
const Reserva = require("./backend/models/Reserva");

mongoose.connect("mongodb+srv://oscaralejandro39:Goliat01$@clinica.8peosoz.mongodb.net/clinica");

(async () => {
  await Reserva.insertMany([
    {
      rut: "11111111-1", // paciente
      prevision: "Fonasa",
      fecha: "VIERNES",
      hora: "08:15 a 10:00",
      profesional: "Aguilera Gonzalez Luis" // mismo nombre exacto
    }
  ]);
  console.log("✅ Reserva insertada");
  mongoose.disconnect();
})();
