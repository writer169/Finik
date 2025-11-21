import { GoogleGenAI } from "@google/genai";
import { WEIGHT_DATA, BIRTH_DATE } from "../constants";
import { CalendarEvent, Note } from "../types";

export const askGeminiVet = async (userQuestion: string, events: CalendarEvent[], notes: Note[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Пожалуйста, настройте API_KEY для использования AI ассистента.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const latestWeight = WEIGHT_DATA[WEIGHT_DATA.length - 1];
  
  const context = `
    Ты дружелюбный и квалифицированный ветеринарный ассистент.
    
    Данные пациента:
    - Имя: Финик
    - Вид: Кот (Котенок)
    - Дата рождения: ${BIRTH_DATE}
    - Последний вес: ${latestWeight.weight}г записан ${latestWeight.date}
    - История веса: ${JSON.stringify(WEIGHT_DATA)}
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