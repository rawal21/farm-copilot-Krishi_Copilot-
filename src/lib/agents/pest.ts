import { analyzeImage } from '../llm'

const PEST_SYSTEM_PROMPT = `
You are 'Farm Copilot' (Krishi Co) - an expert Plant Pathologist.
Analyze the image.
Output JSON:
{
  "crop_detected": "...",
  "diagnosis": "...",
  "severity": "High",
  "treatment_mr": "...",
  "treatment_en": "..."
}
(Note: Put Hindi advice in 'treatment_mr')
`

export async function analyzeCropImage(imageUrl: string) {
  try {
    const data = await analyzeImage(PEST_SYSTEM_PROMPT, imageUrl)
    // If null (placeholder), return a mock response for now so the app doesn't crash during demo
    if (!data) {
       return {
         crop_detected: "Cotton (Mock)",
         diagnosis: "Pink Bollworm (Simulated)",
         severity: "High",
         treatment_mr: "Favarni kara (Mock Advice)",
         treatment_en: "Spray Profenofos"
       }
    }
    return data
  } catch (error) {
    console.error("Error analyzing image:", error)
    return null
  }
}
