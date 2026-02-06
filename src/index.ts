import { env } from "cloudflare:workers";
import { httpServerHandler } from "cloudflare:node";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import * as groq from "./services/recommendationService";
const app = express();

const allowedOrigins = ["https://kriteria.pages.dev", "http://localhost:5173"];

// CORS middleware con credenciales y headers explícitos
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}) as unknown as express.RequestHandler);
// Fallback manual de CORS headers para asegurar compatibilidad con Cloudflare Workers
app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.get("origin");
    if (origin && allowedOrigins.includes(origin)) {
        res.set("Access-Control-Allow-Origin", origin);
        res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.set("Access-Control-Allow-Credentials", "true");
    }
    // Responder inmediatamente a preflight OPTIONS
    if (req.method === "OPTIONS") {
        return res.status(204).send();
    }
    next();
});

app.use(express.json());

import auth from "./middlewares/auth";
import { connectDB } from "./config/db";
import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv";
dotenv.config();

// Middleware de conexión a MongoDB - solo para rutas que lo necesitan
const dbMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Error de conexión a MongoDB:", error);
        res.status(500).json({ error: "Error de conexión a la base de datos" });
    }
};

// Rutas que requieren base de datos
app.use("/users", dbMiddleware, userRoutes);
app.use("/auth", dbMiddleware, userRoutes);

// httpServerHandler requiere que Express escuche en el mismo puerto
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});



// Middleware to parse JSON bodies

// Health check endpoint
// Ruta principal (hecha async para await)
app.get("/", async (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: "KriterIA API Online" });
});
app.get("", async (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: "KriterIA API Online" });
});

// Búsqueda por IA
interface SearchRequestBody {
    prompt: string;
    model: string;
}

app.post("/search", async (req: Request, res: Response) => {

    try {
        // 1. DESESTRUCTURACIÓN Y TIPADO
        // Extraemos 'prompt' del cuerpo de la petición (req.body)
        const { prompt } = req.body as SearchRequestBody;
        const { model } = req.body as SearchRequestBody;

        // 2. VALIDACIÓN
        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({
                success: false,
                message: "El prompt es obligatorio y debe ser texto."
            });
        }
        // 3. CONFIGURACIÓN DEL MODELO
        // Groq usa modelos como 'mixtral-8x7b-32768' o 'llama2-70b-4096'.
        // 'mixtral' es excelente para seguir instrucciones JSON.
        const MODELO = model; // Cambia según tus necesidades

        // 4. LLAMADA AL SERVICIO
        // Pasamos el prompt extraído y el modelo definido
        const resultString = await groq.main(prompt, MODELO);

        // 5. PARSEO Y RESPUESTA
        // Intentamos convertir el string de la IA a objeto JSON real
        let parsedResult;
        try {
            parsedResult = JSON.parse(resultString);
        } catch (parseError) {
            // Si la IA devuelve texto antes del JSON, esto fallará.
            // Aquí podrías implementar una limpieza del string si fuera necesario.
            console.error("Error parseando JSON de la IA:", resultString);
            return res.status(500).json({
                success: false,
                message: "La IA no devolvió un formato válido.",
                raw: resultString // Opcional: para depurar
            });
        }

        // Enviamos la respuesta exitosa al frontend
        res.status(200).json({
            success: true,
            data: parsedResult
        });

    } catch (error) {
        console.error("Error en el endpoint /search:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor."
        });
    }



});

// Al final de tu archivo
export default httpServerHandler(3000);