import { generateJSON } from '../llm'

const SCHEMES_SYSTEM_PROMPT = `
You are 'Farm Copilot' (Krishi Co).
Match farmer profile to schemes.
Output JSON with 'eligible_schemes' and 'message_mr'.
`

export async function getSchemeRecommendations(farmerProfile: any) {
  try {
    const data = await generateJSON(SCHEMES_SYSTEM_PROMPT, farmerProfile)
    return data || {}
  } catch (error) {
    console.error("Error fetching schemes:", error)
    return null
  }
}
