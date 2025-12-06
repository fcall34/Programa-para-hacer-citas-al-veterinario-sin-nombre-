const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.routes');
const cookieParser = require('cookie-parser');




const app = express();
const PORT = 3000;

// Middlewares
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization"
}));


app.use(bodyParser.json());
app.use(cookieParser());

// API usuarios
console.log("Contenido de userRoutes:", userRoutes);

app.use('/api', userRoutes);

// Servir React
const frontendPath = path.join(__dirname, '../frontend/build'); // <-- aquí
app.use(express.static(frontendPath));
app.get(/.*/, (req, res) => {
  res.sendFile('index.html', { root: frontendPath });
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
