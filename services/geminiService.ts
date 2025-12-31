import { GoogleGenAI } from "@google/genai";
import { Transaction, Goal } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateFinancialAdvice = async (
  query: string,
  transactions: Transaction[],
  goals: Goal[]
): Promise<string> => {
  const ai = createClient();
  if (!ai) return "Servicio de IA no disponible: Falta la API Key.";

  // Prepare context
  const financialContext = `
    Datos actuales del usuario:
    Transacciones: ${JSON.stringify(transactions.slice(0, 20))}... (truncado por brevedad)
    Metas: ${JSON.stringify(goals)}
  `;

  const systemInstruction = `
    Eres un Asesor Financiero Senior experto para una familia.
    Tu tono es profesional, alentador y conciso.
    Responde SIEMPRE en ESPAÑOL.
    Tienes acceso a las transacciones recientes y metas de ahorro del usuario.
    
    Si te preguntan sobre la "regla 50/30/20", explica cómo sus gastos actuales encajan en ese modelo.
    Fijos/Necesidades (Needs): Renta/Hipoteca, Seguros, Servicios Públicos.
    Deseos (Wants): Cenas fuera, Entretenimiento, Ocio.
    Ahorros/Deuda (Savings): Inversiones, Fondo de Emergencia.

    Proporciona consejos prácticos. Si el usuario pide categorización, sugiere categorías basadas en los nombres de los comercios.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Contexto: ${financialContext}\n\nConsulta del Usuario: ${query}`,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text || "No pude generar una respuesta en este momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Tengo problemas para conectar con el cerebro financiero en este momento. Por favor, inténtalo más tarde.";
  }
};

export const autoCategorizeTransaction = async (description: string): Promise<string> => {
    const ai = createClient();
    if (!ai) return "Sin Categoría";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Categoriza esta descripción de transacción en una sola palabra en ESPAÑOL (ej. Supermercado, Servicios, Entretenimiento, Renta, Salario, Transporte): "${description}"`,
        });
        return response.text?.trim() || "Sin Categoría";
    } catch (e) {
        return "Sin Categoría";
    }
}