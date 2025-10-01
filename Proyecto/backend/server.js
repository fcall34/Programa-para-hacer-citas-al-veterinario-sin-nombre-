const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.routes');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// API usuarios
app.use('/api', userRoutes);

// Servir React
const frontendPath = path.join(__dirname, '../frontend/build'); // <-- aquí
app.use(express.static(frontendPath));
app.get(/.*/, (req, res) => {
  res.sendFile('index.html', { root: frontendPath });
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
