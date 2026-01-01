
import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.API_KEY directly as per guidelines
export const summarizeContent = async (text: string): Promise<string> => {
  // Rely on process.env.API_KEY directly
  if (!process.env.API_KEY) return "AI API Key missing.";
  
  try {
    // Initialize GoogleGenAI instance inside the function to use the environment variable directly
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `قم بتلخيص هذا النص بشكل موجز ومنظم باللغة العربية:\n\n${text}`,
    });
    // Use .text property directly instead of text() method
    return response.text || "لم أتمكن من استخلاص ملخص.";
  } catch (error) {
    console.error("AI Error:", error);
    return "خطأ في معالجة الذكاء الاصطناعي.";
  }
};

export const suggestTags = async (content: string): Promise<string[]> => {
  // Rely on process.env.API_KEY directly
  if (!process.env.API_KEY) return [];
  
  try {
    // Initialize GoogleGenAI instance inside the function to use the environment variable directly
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `استخرج الكلمات المفتاحية (Tags) لهذا المحتوى كقائمة JSON باللغة العربية:\n\n${content}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    // Use .text property directly instead of text() method
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("AI Tags Error:", error);
    return [];
  }
};
