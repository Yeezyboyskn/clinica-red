const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://oscaralejandro39:Goliat01$@clinica.8peosoz.mongodb.net/clinica", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Conectado a MongoDB"))
.catch(err => console.error("❌ Error en conexión MongoDB:", err));
