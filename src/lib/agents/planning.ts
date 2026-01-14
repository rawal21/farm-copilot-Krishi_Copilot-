import { generateJSON } from '../llm'

const PLANNING_SYSTEM_PROMPT = `
You are 'Farm Copilot' (Krishi Co).
Your task is to generate 2 detailed crop plans for a farmer in Maharashtra based on their details.
Output must be in JSON format.
(See schema below)
`

export async function generateCropPlans(farmDetails: any) {
  try {
    const data = await generateJSON(PLANNING_SYSTEM_PROMPT, farmDetails)
    return data || {}
  } catch (error) {
    console.error("Error generating crop plans:", error)
    return null
  }
}
