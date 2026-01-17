
import { HfInference } from "@huggingface/inference"

const apiKey = process.env.HUGGINGFACE_API_KEY

if (!apiKey) {
  console.warn("HUGGINGFACE_API_KEY is not set.")
}

const hf = new HfInference(apiKey);
const MODEL_NAME = "meta-llama/Llama-3.2-3B-Instruct";

export async function generateText(systemPrompt: string, userMessage: string) {
  try {
    const response = await hf.chatCompletion({
      model: MODEL_NAME,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content?.trim() || "";
  } catch (error) {
    console.error("HuggingFace Error:", error);
    return null;
  }
}

export async function generateJSON(systemPrompt: string, data: any) {
  try {
    const jsonPrompt = `
    ${systemPrompt}
    
    IMPORTANT: Data to process: ${JSON.stringify(data)}
    
    OUTPUT RULE: Return VALID JSON ONLY. No markdown, no explanation, no backticks.
    `;
    
    const response = await hf.chatCompletion({
        model: MODEL_NAME,
        messages: [
            { role: "user", content: jsonPrompt } // Mistral 0.2 sometimes prefers all in User if not purely chat
        ],
        max_tokens: 1000,
        temperature: 0.3, 
    });

    let text = response.choices[0].message.content?.trim() || "";
    
    // Clean up potential markdown formatting
    if (text.startsWith("```json")) text = text.replace(/^```json/, '').replace(/```$/, '');
    if (text.startsWith("```")) text = text.replace(/^```/, '').replace(/```$/, '');

    return JSON.parse(text);
  } catch (error) {
    console.error("HuggingFace JSON Error:", error);
    return null;
  }
}

// Vision Helper (Using a vision-capable HF model if needed, or placeholder)
export async function analyzeImage(systemPrompt: string, imageUrl: string) {
    // Basic HF inference doesn't support URL-based vision easily on free tier for all models
    // We will use a dedicated vision model like 'llava-hf/llava-1.5-7b-hf' if we were strictly implementing it.
    // For now, we'll keep the mock/placeholder or try to implement it if needed.
    return null; 
}
