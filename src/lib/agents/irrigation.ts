import { getWeatherForecast, generateWeatherSummary } from './weather'
import { generateJSON } from '../llm'

const IRRIGATION_SYSTEM_PROMPT = `
You are 'Farm Copilot' (Krishi Co).
Analyze the weather and crop stage to give irrigation advice in Marathi.

Output JSON Format:
{
  "advice_mr": "...",
  "advice_en": "...",
  "action": "IRRIGATE" | "WAIT"
}
`

export async function getIrrigationAdvice(farmDetails: any, pincode: string) {
  // 1. Get Live Weather
  const weather = await getWeatherForecast(pincode)
  const weatherSummary = generateWeatherSummary(weather)

  // 2. Ask LLM
  try {
    const data = await generateJSON(
        IRRIGATION_SYSTEM_PROMPT, 
        { farm: farmDetails, weather: weatherSummary }
    )
    return data || {}
  } catch (error) {
    console.error("Irrigation Agent Error:", error)
    return null
  }
}
