import { GoogleGenAI } from "@google/genai";
import { BIRTH_DATE } from "../constants";
import { CalendarEvent, Note, WeightRecord } from "../types";

export const askGeminiVet = async (userQuestion: string, events: CalendarEvent[], notes: Note[], weightHistory: WeightRecord[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Пожалуйста, настройте API_KEY для использования AI ассистента.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const sortedWeights = [...weightHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latestWeight = sortedWeights.length > 0 ? sortedWeights[sortedWeights.length - 1] : null;
  
  const context = `
    Ты дружелюбный и квалифицированный ветеринарный ассистент.
    
    Данные пациента:
    - Имя: Финик
    - Вид: Кот (Котенок)
    - Дата рождения: ${BIRTH_DATE}
    - Последний вес: ${latestWeight ? `${latestWeight.weight}г (${latestWeight.date})` : 'Нет данных'}
    - История веса: ${JSON.stringify(sortedWeights)}
    - Календарь событий и медкарты: ${JSON.stringify(events)}
    - Заметки владельца: ${JSON.stringify(notes)}
    
    Вопрос пользователя: "${userQuestion}"
    
    Пожалуйста, дай краткий и полезный ответ на русском языке. 
    Если набор веса выглядит хорошим, отметь это. 
    Тон общения теплый и успокаивающий.
    Если это серьезная медицинская проблема, посоветуй обратиться к врачу очно.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
    });
    return response.text || "Не удалось получить ответ прямо сейчас.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Извините, возникла проблема с подключением к AI сервису.";
  }
};