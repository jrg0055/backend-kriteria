import { env } from "cloudflare:workers";
import { httpServerHandler } from "cloudflare:node";
import express, {Request, Response} from "express";
import cors from "cors";
import * as groq from "./services/recommendationService";
const app = express();
app.use(cors({
    origin: ["https://kriteria.pages.dev", "http://localhost:5173"], // Añade tu URL de Pages y la de local
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

import auth from "./middlewares/auth";
import {connectDB} from "./config/db";
import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv";
dotenv.config();




// Middlewares
app.use(express.json());
// Rutas
app.use("/users", userRoutes);
app.use("/api/auth", auth);


const PORT = process.env.PORT || 3000;

async function startServer() {

    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });

}

startServer();



// Middleware to parse JSON bodies

// Health check endpoint
// Ruta principal (hecha async para await)
app.get("/", async (req: Request, res: Response) => {
    try {
        await connectDB();
        res.status(200).json({
            success: true,
            message: "Conexión a MongoDB verificada con éxito."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al verificar la conexión con la base de datos."
        });
    }
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
        const MODELO = "openai/gpt-oss-120b"; // Cambia según tus necesidades

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