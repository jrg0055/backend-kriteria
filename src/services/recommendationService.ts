import { env } from "cloudflare:workers";
import { config } from 'dotenv';
import OpenAI from "openai";

config();

// Variable global para reutilizar el cliente y no saturar la memoria
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
    if (!openaiClient) {
        // En Cloudflare Workers leemos de 'env' exportado, con fallback a process.env para local
        const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error("La API Key de Gemini no está definida en las variables de entorno.");
        }

        openaiClient = new OpenAI({
            apiKey: apiKey,
            baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
        });
    }
    return openaiClient;
}

export async function mainStream(prompt: string, model: string) {
    try {
        const actualModel = model.includes("gemini") ? model : "gemini-3.1-flash-lite-preview";
        
        // Inicializamos el cliente de forma segura AHORA, no al principio del archivo
        const openai = getOpenAIClient();

        return await openai.chat.completions.create({
            model: actualModel,
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: "\n" +
                        "### System\n" +
                        "You are a personal shopping assistant. Return **ONLY** valid JSON.\n" +
                        "\n" +
                        "### Instructions\n" +
                        "Return only valid JSON with keys for each product:\n" +
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
        throw error;
    }
}