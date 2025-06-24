const express = require("express");
const cors = require("cors");
require("./db");

const Usuario = require("./models/Usuario");
const Reserva = require("./models/Reserva");
const Horario = require("./models/Horario");
const Box = require("./models/Box");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// LOGIN
app.post("/api/login", async (req, res) => {
  const { rut, password } = req.body;
  const user = await Usuario.findOne({ rut, password });
  if (!user) return res.status(401).json({ msg: "Credenciales incorrectas" });
  res.json({ rut: user.rut, nombre: user.nombre, rol: user.rol });
});

// USUARIOS
app.post("/api/usuarios", async (req, res) => {
  const { rut, nombre, password, rol, especialidad, correo, telefono } = req.body;
  const existe = await Usuario.findOne({ rut });
  if (existe) return res.status(409).json({ error: "Ya existe un usuario con ese RUT" });
  const nuevo = await Usuario.create({ rut, nombre, password, rol, especialidad, correo, telefono });
  res.json(nuevo);
});

app.get("/api/usuarios/medicos", async (_, res) => {
  const medicos = await Usuario.find({ rol: "medico" });
  res.json(medicos);
});

app.delete("/api/usuarios/:rut", async (req, res) => {
  await Usuario.deleteOne({ rut: req.params.rut });
  res.json({ ok: true });
});

app.put("/api/usuarios/:rut", async (req, res) => {
  const rut = req.params.rut;
  const user = await Usuario.findOneAndUpdate({ rut }, req.body, { new: true });
  res.json(user);
});

// HORARIOS
app.get("/api/horarios/:profesional", async (req, res) => {
  const horario = await Horario.findOne({ profesional: req.params.profesional });
  res.json(horario?.dias || {});
});

app.put("/api/horarios/:profesional", async (req, res) => {
  const { dias } = req.body;
  const horario = await Horario.findOneAndUpdate(
    { profesional: req.params.profesional },
    { $set: { dias } },
    { new: true, upsert: true }
  );
  res.json(horario);
});

app.get("/api/especialidades", async (_, res) => {
  const especialidades = await Horario.distinct("especialidad");
  res.json(especialidades);
});

app.get("/api/doctores/:especialidad", async (req, res) => {
  const doctores = await Horario.find({ especialidad: req.params.especialidad }).distinct("profesional");
  res.json(doctores);
});

// RESERVAS
app.get("/api/reservas", async (req, res) => {
  const filtro = {};
  if (req.query.profesional) filtro.profesional = req.query.profesional;
  if (req.query.fecha) filtro.fecha = req.query.fecha;
  const reservas = await Reserva.find(filtro);
  res.json(reservas);
});

app.post("/api/reservas", async (req, res) => {
  const nueva = new Reserva(req.body);
  await nueva.save();
  res.json(nueva);
});

app.put("/api/reservas/:id", async (req, res) => {
  const reserva = await Reserva.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(reserva);
});

app.delete("/api/reservas/:id", async (req, res) => {
  await Reserva.findByIdAndDelete(req.params.id);
  res.json({ msg: "Reserva eliminada" });
});

// BOXES
app.get("/api/boxes", async (_, res) => {
  const boxes = await Box.find();
  res.json(boxes);
});

app.put("/api/boxes/:id", async (req, res) => {
  const box = await Box.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(box);
});

// ESTADÍSTICAS
app.get("/api/estadisticas/top-medicos", async (_, res) => {
  const stats = await Reserva.aggregate([
    { $group: { _id: "$profesional", total: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $limit: 5 }
  ]);
  res.json(stats);
});

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

// ===================== DEPLOY INFO =====================
app.get("/", (_, res) => {
  res.send("✅ API Clínica Red operativa.");
});

app.listen(PORT, () => {
  console.log(`🌐 Backend corriendo en http://localhost:${PORT}`);
});
