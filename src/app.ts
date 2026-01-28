import { config } from 'dotenv';
config();
import { httpServerHandler } from "cloudflare:node";
import express, { Request, Response } from "express";
import cors from "cors";
import * as groq from "./services/recommendationService";
const app = express();
const port = 5000;

// Middleware para JSON
app.use(express.json());

// Ruta de prueba
app.get("/api/hello", (req: Request, res: Response) => {
    res.json({ message: groq.main("Quiero un coche por menos de 5000€ que me sirva para ir por el pueblo, tiene muchas cuestas y me acabo de sacar el carnet, vamos a por uno de segunda mano", "openai/gpt-oss-120b") });
    //groq.main("Quiero un coche por menos de 5000€ que me sirva para ir por el pueblo, tiene muchas cuestas y me acabo de sacar el carnet, vamos a por uno de segunda mano", "openai/gpt-oss-120b")
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

app.use(cors({ origin: 'http://localhost:3000' }));  // Solo permite peticiones desde React en puerto 3000

app.post('/api/data', (req: Request, res: Response) => {
    const data = req.body;  // Recibe datos JSON del frontend
    res.json({ received: data, message: 'Datos recibidos correctamente' });
});

export default app;