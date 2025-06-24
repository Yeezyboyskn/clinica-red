const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  activo: { type: Boolean, default: false }, // para saber si el médico está disponible
  rut: String,
  nombre: String,
  password: String,
  rol: String, // paciente, medico, admin
  especialidad: String, // solo para médicos
  correo: String,
  telefono: String,
  prevision: String // ✅ agregar esto
});

module.exports = mongoose.model("Usuario", usuarioSchema);
