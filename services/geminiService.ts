import { CalendarEvent, Note, WeightRecord } from "../types";
import { BIRTH_DATE } from "../constants";

export const askGeminiVet = async (userQuestion: string, events: CalendarEvent[], notes: Note[], weightHistory: WeightRecord[]): Promise<string> => {
  // Получаем ключ доступа из URL для авторизации запроса к нашему API
  const urlParams = new URLSearchParams(window.location.search);
  const accessKey = urlParams.get('key');

  if (!accessKey) return "Ошибка доступа: отсутствует ключ авторизации.";

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
    const response = await fetch(`/api/ai?key=${accessKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: context })
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error("AI API Error:", errData);
        if (response.status === 500 && errData.error?.includes('Missing API_KEY')) {
            return "Ошибка сервера: Не настроен API_KEY в переменных окружения Vercel.";
        }
        return "Извините, не удалось связаться с ассистентом.";
    }
    
    const data = await response.json();
    return data.text || "Не удалось получить ответ.";
  } catch (error) {
    console.error("Network Error:", error);
    return "Ошибка сети при обращении к AI сервису.";
  }
};