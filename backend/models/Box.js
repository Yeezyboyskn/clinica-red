const mongoose = require("mongoose");

const boxSchema = new mongoose.Schema({
  boxId: String,
  piso: Number,
  tipo: String,
  estado: String,
});

module.exports = mongoose.model("Box", boxSchema);
