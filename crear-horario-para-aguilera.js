const mongoose = require("mongoose");
const Horario = require("./backend/models/Horario");

mongoose.connect("mongodb+srv://oscaralejandro39:Goliat01$@clinica.8peosoz.mongodb.net/clinica");

(async () => {
  await Horario.deleteMany({ profesional: "Aguilera Gonzalez Luis" });

  await Horario.create({
    profesional: "Aguilera Gonzalez Luis",
    especialidad: "Cirugía General",
    region: "RM",
    comuna: "Santiago",
    piso: 5,
    dias: {
      LUNES: ["08:30", "09:00", "09:30"],
      VIERNES: ["10:00", "10:30"]
    }
  });

  console.log("✅ Horarios creados para Aguilera Gonzalez Luis");
  mongoose.disconnect();
})();
