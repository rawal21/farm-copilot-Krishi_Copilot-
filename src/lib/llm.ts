
import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set.")
}

const genAI = new GoogleGenerativeAI(apiKey || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function generateText(systemPrompt: string, userMessage: string) {
  try {
    const result = await model.generateContent({
        contents: [
            { role: "user", parts: [{ text: systemPrompt + "\n\nUser: " + userMessage }] }
        ]
    });
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
}

export async function generateJSON(systemPrompt: string, data: any) {
  try {
    const jsonModel = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash", 
        generationConfig: { responseMimeType: "application/json" } 
    });
    
    const result = await jsonModel.generateContent({
        contents: [
            { role: "user", parts: [{ text: systemPrompt + "\n\nData: " + JSON.stringify(data) }] }
        ]
    });
    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini JSON Error:", error);
    return null;
  }
}

// Vision Helper
export async function analyzeImage(systemPrompt: string, imageUrl: string) {
    // Note: For real vision, we need to fetch the image bytes. 
    // This is a simplified placeholder if we can't fetch easily server-side.
    // Ideally we pass base64.
    return null; 
}
