
import { HfInference } from "@huggingface/inference"

const apiKey = process.env.HUGGINGFACE_API_KEY

if (!apiKey) {
  console.warn("HUGGINGFACE_API_KEY is not set.")
}

const hf = new HfInference(apiKey);
const MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.2";

export async function generateText(systemPrompt: string, userMessage: string) {
  try {
    const prompt = `<s>[INST] ${systemPrompt}\n\nUser: ${userMessage} [/INST]`;
    
    const result = await hf.textGeneration({
      model: MODEL_NAME,
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        return_full_text: false,
      }
    });

    return result.generated_text.trim();
  } catch (error) {
    console.error("HuggingFace Error:", error);
    return null;
  }
}

export async function generateJSON(systemPrompt: string, data: any) {
  try {
    // Explicitly ask for JSON in the prompt to ensure the model complies
    const jsonPrompt = `
    ${systemPrompt}
    
    IMPORTANT: Data to process: ${JSON.stringify(data)}
    
    OUTPUT RULE: Return VALID JSON ONLY. No markdown, no explanation, no backticks.
    `;
    
    const prompt = `<s>[INST] ${jsonPrompt} [/INST]`;

    const result = await hf.textGeneration({
        model: MODEL_NAME,
        inputs: prompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.3, // Lower temp for consistency
          return_full_text: false,
        }
    });

    let text = result.generated_text.trim();
    
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
