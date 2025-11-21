import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { key } = req.query;

  // 1. Проверка ключа доступа к приложению
  if (key !== process.env.ACCESS_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 2. Проверка наличия ключа Gemini (на сервере он должен быть)
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing in server environment variables");
    return res.status(500).json({ error: 'Server configuration error: Missing API_KEY' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return res.status(200).json({ text: response.text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: 'AI Service Error' });
  }
}