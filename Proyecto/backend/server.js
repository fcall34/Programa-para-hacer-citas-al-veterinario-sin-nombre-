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

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3001"
];

// Middlewares
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization"
}));


app.use(bodyParser.json());
app.use(cookieParser());


app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use('/api', userRoutes);


app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

