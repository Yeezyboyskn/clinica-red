const mongoose = require("mongoose");
const Usuario = require("./backend/models/Usuario");

mongoose.connect("mongodb+srv://oscaralejandro39:Goliat01$@clinica.8peosoz.mongodb.net/clinica");

(async () => {
  await Usuario.deleteOne({ rut: "DR001" }); // elimina si existe duplicado

  await Usuario.create({
    rut: "DR001",
    nombre: "Aguilera Gonzalez Luis",
    password: "123",
    rol: "medico"
  });

  console.log("✅ Doctor DR001 creado correctamente");
  mongoose.disconnect();
})();
