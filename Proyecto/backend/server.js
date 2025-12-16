import "./Config/env.js"

import path from 'path'
import { fileURLToPath } from 'url';
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser';
import userRoutes from './routes/user.routes.js'
import cookieParser from 'cookie-parser';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization"
}));


app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api', userRoutes);

// Servir React
const frontendPath = path.join(__dirname, '../frontend/build'); // <-- aquí
app.use(express.static(frontendPath));
app.get(/.*/, (req, res) => {
  res.sendFile('index.html', { root: frontendPath });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

