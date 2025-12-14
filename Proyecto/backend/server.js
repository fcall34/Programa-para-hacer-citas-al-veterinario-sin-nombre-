import dotenv from "dotenv";
dotenv.config();

import path from 'path'
import { fileURLToPath } from 'url';
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import userRoutes from './routes/user.routes.js'
import cookieParser from 'cookie-parser';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, ".env"),
});


const app = express();
const PORT = 3000;

// Middlewares
app.use(cors({
  origin: "http://localhost:3001",
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
