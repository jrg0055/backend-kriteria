import { env } from "cloudflare:workers";
import { config } from 'dotenv';
import OpenAI from "openai"; // Asegúrate de que la 'I' sea mayúscula

config();

// Inicializamos el cliente cambiando la Base URL a la de la API de Gemini
const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY, 
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

// Exportamos mainStream para que index.ts pueda consumirla igual que antes
export async function mainStream(prompt: string, model: string) {
    try {
        // Validación: Si tu frontend sigue enviando nombres de modelos de Groq (ej: "llama3..."), 
        // forzamos el uso del modelo de Gemini. Si ya lo envías bien, usa el parámetro.
        const actualModel = model.includes("gemini") ? model : "gemini-1.5-flash";

        // Retornamos directamente la promesa. No usamos streaming ('stream: false' por defecto)
        // tal como especificaste en los comentarios de tu index.ts
        return await openai.chat.completions.create({
            model: actualModel,
            // Opcional pero muy recomendado: Fuerza a Gemini a devolver un JSON válido
            response_format: { type: "json_object" }, 
            messages: [
                {
                    role: "system",
                    content: "\n" +
                        "### System\n" +
                        "You are a personal shopping assistant. Return **ONLY** valid JSON.\n" +
                        "\n" +
                        "### Instructions\n" +
                        "Return only JSON with keys for each product:\n" +
                        "- product name (string)\n" +
                        "- product description (string)\n" +
                        "- price (float)\n" +
                        "- rating (0-5) (float)\n" +
                        "\n" +
                        "Add what you consider, for example, a phone isn't the same as a tv, they have both screen, but you have to specify\n" +
                        "The Product description must include the features that the user asks, and also the features that are important for that product\n" +
                        "The Product Rating must go from 0.00 (not recommended) to 5.00 (recommended), considering the user input.\n" +
                        "### Context\n" +
                        "The user will ask for a product, your goal is to search and recommend a product full focused on the user needs," +
                        "you have to recommend the best product for them\n" +
                        "YOU HAVE TO ANSWER ALWAYS IN THE USER LANGUAGE.\n" +
                        "YOU ONLY HAVE TO ANSWER WITH A JSON, DON'T TALK \n" +
                        "RECOMMEND AT LEAST 3 PRODUCTS\n" +
                        ""
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
        });
    } catch (error) {
        console.error("Error al conectar con Gemini:", error);
        throw error; // Lanzamos el error para que index.ts lo capture en su bloque catch
    }
}