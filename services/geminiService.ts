import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, GeminiType, Message } from "../types";

// Initialize the client
// NOTE: In a real production app, API keys should be proxy-ed via a backend.
// For this pure frontend demo, we access the env var directly.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

const MODEL_FLASH = 'gemini-2.5-flash';

/**
 * Analyzes study material to extract topics and generate a knowledge graph.
 * Uses JSON schema enforcement for structured data.
 */
export const analyzeStudyMaterial = async (text: string): Promise<AnalysisResult> => {
  if (!text) return { topics: [], summary: '' };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: `Analyze the following study notes. Extract key topics with a relevance score (0-100) based on their frequency and importance in the text. Also provide a brief 2-sentence summary of the entire content.
      
      NOTES:
      ${text.substring(0, 50000)}`, // Limit context slightly to ensure safety, though 2.5 supports much more
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            topics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  relevance: { type: Type.INTEGER },
                  description: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      topics: [{ name: "Error Analyzing", relevance: 0, description: "Could not process text" }],
      summary: "Error generating analysis."
    };
  }
};

/**
 * Performs the "RAG" generation.
 * In a pure client-side app without a Vector DB, we utilize the massive Context Window of Gemini.
 * We stuff the relevant documents into the system instruction or context.
 */
export const generateRAGResponse = async (
  question: string, 
  context: string, 
  history: Message[]
): Promise<string> => {
  try {
    // Convert internal message format to Gemini format if needed, 
    // but for simple Q&A, we can just append to context.
    
    const systemInstruction = `You are a Smart Study Assistant. 
    Your goal is to help the student learn based STRICTLY on the provided study materials.
    
    RULES:
    1. Answer the question using ONLY the information in the Context provided below.
    2. If the answer is not in the context, say "I cannot find the answer in your study notes."
    3. Be educational, encouraging, and clear.
    4. Use Markdown for formatting (lists, bold terms).
    
    CONTEXT:
    ${context}
    `;

    const chat = ai.chats.create({
      model: MODEL_FLASH,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4, // Lower temperature for more factual answers
      }
    });

    // Replay history to maintain conversation context
    // We skip the very first welcome message from the model and the last user message (which is 'question')
    // Note: In a real app, we'd map this carefully. For this demo, we send the question fresh.
    
    const response = await chat.sendMessage({ message: question });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini RAG Error:", error);
    throw error;
  }
};