import { GoogleGenerativeAI } from "@google/generative-ai";
import { Transaction, Goal } from "../types";

// Acceso directo a variables de entorno de Vite
// Importante: No usar (import.meta as any).env si no es necesario.
// Usar import.meta.env directamente es lo estándar en Vite.
const getAI = () => {
  // @ts-ignore
  const env = import.meta.env;
  // @ts-ignore
  const apiKey = (env.VITE_API_KEY || env.API_KEY || "").trim();

  if (!apiKey || apiKey === "undefined") {
    console.warn("DEBUG: No API Key found");
    return null;
  }

  try {
    // Usamos el SDK correcto para cliente (navegador)
    return new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.error("DEBUG - Error al instanciar GoogleGenerativeAI:", err);
    return null;
  }
};

export const generateFinancialAdvice = async (
  query: string,
  transactions: Transaction[],
  goals: Goal[]
): Promise<string> => {
  const financialContext = `
    Datos actuales del usuario:
    Transacciones: ${JSON.stringify(transactions.slice(0, 20))}
    Metas: ${JSON.stringify(goals)}
  `;

  const systemInstruction = `
    Eres un Asesor Financiero Senior experto para una familia.
    Responde SIEMPRE en ESPAÑOL.
    Proporciona consejos prácticos basados en sus transacciones y metas.
  `;

  try {
    const genAI = getAI();
    if (!genAI) {
      return "Error: No se encontró la clave API (VITE_API_KEY) en el archivo .env. Asegúrate de que el archivo .env existe y tiene la clave correcta.";
    }

    // Lista FINAL basada en los modelos que SÍ tienes disponibles
    // Priorizamos versiones "Lite" para evitar error 429 (Cuota) y "Latest" para estabilidad
    const modelsToTry = [
      "gemini-2.0-flash-lite-001", // Lite: Probablemente menos saturado
      "gemini-flash-latest",       // Alias estable oficial
      "gemini-2.5-flash",          // Versión muy nueva
      "gemini-pro-latest",         // Pro estable
      "gemma-3-27b-it"             // Alternativa potente de Gemma
    ];

    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        const fullPrompt = `${systemInstruction}\n\nContexto: ${financialContext}\n\nConsulta del Usuario: ${query}`;

        const response = await model.generateContent(fullPrompt);
        const result = await response.response;
        const text = result.text();

        if (text) return text;

      } catch (error: any) {
        lastError = error;

        // Si es un error de cuota (429), esperamos un poco antes del siguiente intento
        if (error.message?.includes('429')) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    // Si llegamos aquí, todos fallaron
    console.error("DEBUG - Todos los modelos fallaron. Último error:", lastError);
    throw lastError || new Error("Todos los modelos de IA fallaron. Intenta más tarde.");

  } catch (error: any) {
    console.error("Gemini API Error:", error.message);
    return `Lo siento, hubo un problema técnico al consultar la IA (${error.message}). Por favor intenta de nuevo.`;
  }
};

export const autoCategorizeTransaction = async (description: string): Promise<string> => {
  try {
    const genAI = getAI();
    if (!genAI) return "Sin Categoría";

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const response = await model.generateContent(`Categoriza en una sola palabra: "${description}"`);
    const result = await response.response;
    return result.text()?.trim() || "Sin Categoría";
  } catch (e) {
    return "Sin Categoría";
  }
};