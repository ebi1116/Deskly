
import { GoogleGenAI, Type } from "@google/genai";
import { Task } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const breakdownTask = async (taskTitle: string, taskDescription: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a productivity expert. Break down the following task into a list of 4-6 small, actionable sub-tasks:
      
      Task Title: ${taskTitle}
      Description: ${taskDescription}
      
      Respond only with the JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const jsonStr = response.text?.trim() || "[]";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini breakdown error:", error);
    return ["Research requirements", "Define scope", "Execution", "Review"];
  }
};

export const getSmartProductivityAdvice = async (tasks: Task[]): Promise<string> => {
  try {
    const tasksSummary = tasks.map(t => `${t.title} (${t.status}, ${t.priority})`).join(', ');
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Given these office tasks: ${tasksSummary}. 
      Provide 3 concise, highly actionable productivity tips to help the user finish their work efficiently today. 
      Use professional yet encouraging tone. Format as bullet points.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Keep moving forward! Focus on your high-priority tasks first.";
  } catch (error) {
    console.error("Gemini advice error:", error);
    return "Focus on completing your high-priority tasks first to maximize impact.";
  }
};
