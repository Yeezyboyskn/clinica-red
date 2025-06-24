const express = require("express");
const cors = require("cors");
require("./db"); // conexión a MongoDB

const Usuario = require("./models/Usuario");
const Reserva = require("./models/Reserva");
const Horario = require("./models/Horario");
const Box = require("./models/Box");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// =============== LOGIN ====================
app.post("/api/login", async (req, res) => {
  const { rut, password } = req.body;
  const user = await Usuario.findOne({ rut, password });
  if (!user) return res.status(401).json({ msg: "Credenciales incorrectas" });
  res.json({ rut: user.rut, nombre: user.nombre, rol: user.rol });
});

// =============== USUARIOS ====================

// Crear usuario (paciente desde frontend)
app.post("/api/usuarios", async (req, res) => {
  const { rut, nombre, password, rol } = req.body;
  const existe = await Usuario.findOne({ rut });
  if (existe) return res.status(409).json({ error: "Ya existe un usuario con ese RUT" });
  const nuevo = await Usuario.create({ rut, nombre, password, rol });
  res.json(nuevo);
});

// Listar médicos (para el admin)
app.get("/api/usuarios/medicos", async (_, res) => {
  const medicos = await Usuario.find({ rol: "medico" });
  res.json(medicos);
});

// Eliminar médico (por rut)
app.delete("/api/usuarios/:rut", async (req, res) => {
  await Usuario.deleteOne({ rut: req.params.rut });
  res.json({ ok: true });
});

//ESTADISTICA VISTA POR MEDICO
app.get("/api/estadisticas/medico/:nombre", async (req, res) => {
  const nombre = req.params.nombre;
  const stats = await Reserva.aggregate([
    { $match: { profesional: nombre } },
    { $group: { _id: "$fecha", total: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
  const total = stats.reduce((acc, x) => acc + x.total, 0);
  res.json({ total, dias: stats });
});

//ESTADISTICAS
app.get("/api/estadisticas/top-medicos", async (req, res) => {
  const stats = await Reserva.aggregate([
    { $group: { _id: "$profesional", total: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $limit: 5 }
  ]);
  res.json(stats);
});

// =============== RESERVAS ====================

// Listar reservas (con filtros opcionales)
app.get("/api/reservas", async (req, res) => {
  const filtro = {};
  if (req.query.profesional) filtro.profesional = req.query.profesional;
  if (req.query.fecha) filtro.fecha = req.query.fecha;
  const reservas = await Reserva.find(filtro);
  res.json(reservas);
});

// Crear reserva
app.post("/api/reservas", async (req, res) => {
  const nueva = new Reserva(req.body);
  await nueva.save();
  res.json(nueva);
});

// Eliminar reserva por ID
app.delete("/api/reservas/:id", async (req, res) => {
  try {
    await Reserva.findByIdAndDelete(req.params.id);
    res.json({ msg: "Reserva cancelada" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar reserva" });
  }
});

// =============== HORARIOS ====================

// Obtener horarios por médico
app.get("/api/horarios/:profesional", async (req, res) => {
  const horario = await Horario.findOne({ profesional: req.params.profesional });
  res.json(horario?.dias || {});
});

// Crear o actualizar horarios
app.put("/api/horarios/:profesional", async (req, res) => {
  try {
    const { profesional } = req.params;
    const { dias } = req.body;
    const horario = await Horario.findOneAndUpdate(
      { profesional },
      { $set: { dias } },
      { new: true, upsert: true }
    );
    res.json(horario);
  } catch (error) {
    console.error("❌ Error al actualizar horario:", error);
    res.status(500).json({ error: "Error interno" });
  }
});

// Obtener especialidades disponibles
app.get("/api/especialidades", async (_, res) => {
  const especialidades = await Horario.distinct("especialidad");
  res.json(especialidades);
});

// Obtener doctores por especialidad
app.get("/api/doctores/:especialidad", async (req, res) => {
  const doctores = await Horario.find({ especialidad: req.params.especialidad })
    .distinct("profesional");
  res.json(doctores);
});

// =============== BOXES ====================

// Listar boxes
app.get("/api/boxes", async (_, res) => {
  const boxes = await Box.find();
  res.json(boxes);
});

// Editar box por ID
app.put("/api/boxes/:id", async (req, res) => {
  const box = await Box.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(box);
});

//ACTIVO O DESACTIVO MEDICO
app.put("/api/usuarios/:rut", async (req, res) => {
  const rut = req.params.rut;
  const { activo } = req.body;
  const user = await Usuario.findOneAndUpdate({ rut }, { activo }, { new: true });
  res.json(user);
});

//ADMIN RESERVA
app.put("/api/reservas/:id", async (req, res) => {
  const reserva = await Reserva.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(reserva);
});


// =============== INICIAR SERVIDOR ====================
app.listen(PORT, () => {
  console.log(`🌐 Backend corriendo en http://localhost:${PORT}`);
});

