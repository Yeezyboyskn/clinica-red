const mongoose = require("mongoose");

const horarioSchema = new mongoose.Schema({
  profesional: String,
  especialidad: String,
  region: String,
  comuna: String,
  piso: Number,
  dias: Object // LUNES, MARTES, etc.
});

module.exports = mongoose.model("Horario", horarioSchema);
