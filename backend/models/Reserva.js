const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema({
  rut: String,
  prevision: String,
  fecha: String,
  hora: String,
  profesional: String,
});

module.exports = mongoose.model("Reserva", reservaSchema);
