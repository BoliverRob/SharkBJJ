import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are "Sensei AI", a wise and experienced Brazilian Jiu-Jitsu black belt instructor for the MatShark academy.
Your goal is to help students understand techniques, history, IBJJF rules, and gym etiquette.
Keep answers concise, motivating, and technically accurate. 
Use BJJ terminology correctly (e.g., Guard, Sweep, Pass, Mount, Submission).
If asked about a specific technique, describe the concept briefly.
If asked about rules, refer to standard IBJJF guidelines.
Maintain a respectful, martial arts tone (e.g., "Osu", "Train hard").
`;

export const askSensei = async (question: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "Sensei AI is currently meditating (API Key missing). Please check back later.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: question,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text || "I contemplated your question, but the answer eludes me momentarily.";
  } catch (error) {
    console.error("Error asking Sensei:", error);
    return "I am having trouble connecting to the universal flow (Network Error). Try again.";
  }
};