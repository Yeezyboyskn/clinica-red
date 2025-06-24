const mongoose = require("mongoose");
const xlsx = require("xlsx");
const Box = require("./backend/models/Box");

mongoose.connect("mongodb+srv://oscaralejandro39:Goliat01$@clinica.8peosoz.mongodb.net/clinica");

const workbook = xlsx.readFile("RedSalud - Distribucion de Box 2025.xlsx");
const sheet = workbook.Sheets["Cantidad de box"];
const data = xlsx.utils.sheet_to_json(sheet);

async function importar() {
  let inserts = [];
  data.forEach((fila) => {
    const piso = fila["Piso"];
    const cantidad = parseInt(fila["Box de consultas"]);
    if (!isNaN(piso) && !isNaN(cantidad)) {
      for (let i = 1; i <= cantidad; i++) {
        inserts.push({
          boxId: `piso-${piso}-box-${i}`,
          piso: piso,
          tipo: "consulta",
          estado: "disponible"
        });
      }
    }
  });

  await Box.insertMany(inserts);
  console.log("✅ Boxes cargados:", inserts.length);
  mongoose.disconnect();
}

importar();
