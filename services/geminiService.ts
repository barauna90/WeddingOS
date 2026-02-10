
import { GoogleGenAI, Type } from "@google/genai";
import { WeddingData, Task, Priority, TaskStatus } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateInitialChecklist = async (wedding: WeddingData): Promise<Partial<Task>[]> => {
  const prompt = `Com base na data do casamento (${wedding.date}), orçamento (R$ ${wedding.budget}), número de convidados (${wedding.guestsEstimate}) e estilo do evento (${wedding.style}), crie um checklist completo de casamento. 
  Considere que hoje é ${new Date().toISOString().split('T')[0]}.
  Gere tarefas com prazos realistas, categorias e prioridades.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            priority: { type: Type.STRING, enum: ['critica', 'alta', 'media', 'baixa'] },
            deadline: { type: Type.STRING, description: "YYYY-MM-DD format" },
          },
          required: ["title", "description", "category", "priority", "deadline"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
};

export const getSmartRecommendations = async (wedding: WeddingData, tasks: Task[], transactions: any[]): Promise<string> => {
  const prompt = `Atue como um cerimonialista expert. 
  Casamento: ${wedding.name} em ${wedding.date}. Orçamento: R$ ${wedding.budget}.
  Status das tarefas: ${tasks.filter(t => t.status === TaskStatus.CONCLUIDA).length}/${tasks.length} concluídas.
  Status financeiro: ${transactions.length} lançamentos.
  Gere uma análise de 3 parágrafos curtos sobre a saúde do planejamento, destacando 3 riscos imediatos e 3 sugestões de economia.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });

  return response.text || "Não foi possível gerar recomendações no momento.";
};
