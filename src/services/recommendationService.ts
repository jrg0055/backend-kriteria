import { env } from "cloudflare:workers";
import { config } from 'dotenv';
config();
import Groq from "groq-sdk";

// Lazy initialization - se crea el cliente solo cuando se necesita
let groqClient: Groq | null = null;

function getGroqClient(): Groq {
    if (!groqClient) {
        const apiKey = env.GROQ_API_KEY;
        if (!apiKey) {
            throw new Error("The GROQ_API_KEY environment variable is missing or empty.");
        }
        groqClient = new Groq({ apiKey });
    }
    return groqClient;
}



// BÚSQUEDA Y RECOMENDACIÓN DE PRODUCTO (con streaming)

// Nueva función para streaming - evita timeout en Cloudflare
export async function mainStream(prompt: string, model: string) {
    return getGroqChatCompletionStream(prompt, model);
}

export async function getGroqChatCompletionStream(prompt: string, model: string) {
    return getGroqClient().chat.completions.create({
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
        model: model,
        // stream: true NO COMPATIBLE con browser_search + gpt-oss
        tools: [
            {
                "type": "browser_search"
            }
        ]
    });
}