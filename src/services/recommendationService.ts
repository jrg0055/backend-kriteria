import { env } from "cloudflare:workers";
import { httpServerHandler } from "cloudflare:node";
import { config } from 'dotenv';
config();
import Groq from "groq-sdk";

const apiKey = env.GROQ_API_KEY;

if (!apiKey) {
    throw new Error("The GROQ_API_KEY environment variable is missing or empty.");
}

const groq = new Groq({ apiKey });



// BÚSQUEDA Y RECOMENDACIÓN DE PRODUCTO

export async function main(prompt: string, model: string): Promise<string> {
    const chatCompletion = await getGroqChatCompletion(prompt, model);
    // Print the completion returned by the LLM.
    return(chatCompletion.choices[0]?.message?.content || "");
}

export async function getGroqChatCompletion(prompt:string, model:string) {
    return groq.chat.completions.create({
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
                    ""
            },
            {
                role: "user",
                content: prompt     //VARIABLE QUE NOS TIENEN QUE PASAR DE FRONT
            }
        ],
        model: model,      //VARIABLE Q NOS PASAN ENTRE (gpt-oss-20b/gpt-oss-120b/gemini-3-flash)
        tools: [
            {
                "type": "browser_search"
            }
        ]
    });
}