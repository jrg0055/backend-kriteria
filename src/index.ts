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
        const { prompt, model } = req.body as SearchRequestBody;

        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({
                success: false,
                message: "El prompt es obligatorio y debe ser texto."
            });
        }

        // Llamar a Groq (sin streaming porque browser_search + gpt-oss no lo soporta)
        const result = await groq.mainStream(prompt, model);
        const content = result.choices[0]?.message?.content || '';

        // Parsear JSON de la respuesta
        let parsedResult;
        try {
            parsedResult = JSON.parse(content);
        } catch {
            return res.status(200).json({ success: true, raw: content });
        }

        res.status(200).json({ success: true, data: parsedResult });

    } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        console.error("Error en /search:", errMsg);
        res.status(500).json({ success: false, message: errMsg });
    }
});

// Al final de tu archivo
export default httpServerHandler(3000);