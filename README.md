# 🏥 Clínica Red – Sistema de Gestión Médica

Proyecto completo de una clínica médica con gestión de pacientes, doctores y administrador. Permite reservar horas médicas, gestionar boxes, visualizar estadísticas y trabajar con roles diferenciados (admin, médico, paciente).

> 🔗 Frontend: [GitHub Pages](https://tusuario.github.io/clinica-red/)  
> 🔗 Backend: [Railway Deployment](https://clinica-red-production.up.railway.app/)  
> 🔗 Base de datos: MongoDB Atlas

---

## 🚀 Funcionalidades por Rol

### 👨‍⚕️ Médico
- Ver sus horarios y reservas.
- Conectarse/desconectarse.
- Crear reservas manualmente.
- Ver estadísticas personales (total de reservas por día).

### 👤 Paciente
- Crear cuenta y loguearse.
- Reservar una hora médica según especialidad.
- Ver confirmación de reserva.

### 🧑‍💼 Administrador
- Crear, editar y eliminar médicos.
- Editar boxes (ID, piso, tipo, estado).
- Modificar reservas.
- Editar horarios de cualquier médico.
- Ver estadísticas generales:
  - Top médicos más solicitados.
  - Uso de boxes.

---

## 🧰 Tecnologías Utilizadas

| Área        | Herramientas                         |
|-------------|--------------------------------------|
| **Frontend**| HTML, CSS, Bootstrap, JS Vanilla     |
| **Backend** | Node.js, Express.js                  |
| **Base Datos** | MongoDB Atlas + Mongoose          |
| **Hosting** | GitHub Pages (frontend) + Railway (backend) |
| **Extras**  | XLSX para importar datos desde Excel |

---

## 📁 Estructura del Proyecto

clinica-red/
├── backend/
│ ├── server.js
│ ├── db.js
│ └── models/
│ ├── Usuario.js
│ ├── Reserva.js
│ ├── Horario.js
│ └── Box.js
├── frontend/
│ ├── index.html
│ ├── dashboard.html
│ ├── js/
│ │ ├── login.js
│ │ ├── admin.js
│ │ ├── paciente.js
│ │ └── medico.js
│ └── css/
│ ├── style.css
│ └── bootstrap.min.css
└── docs/ ← frontend para GitHub Pages

---

## 🔌 Instalación Local (Opcional)

```bash
git clone https://github.com/tusuario/clinica-red.git
cd clinica-red
npm install
node backend/server.js

GitHub Pages	Frontend	Carpeta /docs publicada
Railway	Backend/API	node backend/server.js
MongoDB Atlas	DB	Clúster conectado desde db.js

📦 Scripts útiles
importar-doctores.js: carga doctores desde Excel.

crear-reserva-falsa.js: genera reservas de prueba.

crear-horarios.js: genera horarios por especialidad.

🔐 Seguridad
RUT validado para pacientes (formato: 12345678-9).

Sesión persistente con localStorage.

Control de vistas por rol.

Estadísticas
Dashboard Admin: Top médicos y uso de boxes.

Dashboard Médico: Total de reservas por día.

Desarrollado por
oscar farias
cristopher muñoz
nicolas cuevas
diego carvajal