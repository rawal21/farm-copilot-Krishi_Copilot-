import { generateText, generateJSON } from '../llm'
import { supabase } from '../supabaseClient'

const ONBOARDING_SYSTEM_PROMPT = `
You are 'Farm Copilot' (Krishi Co), a helpful agricultural assistant for Ramesh, a farmer in Maharashtra.
Your goal is to onboard the farmer by asking a few simple questions in Hindi and English (Hinglish).
Speak in simple, colloquial Hindi/English (Start with "Namaskar!").
Do not ask all questions at once. Ask one by one.

Information to collect:
1. Full Name
2. Village Name & Pincode
3. Total Acres
4. Crops usually grown (e.g., Cotton, Soybean)
5. Irrigation source (Rainfed/Tube-well/Canal)

Current state: User has just said "Hi" or sent a message.
Analyze the user's message. 

If ALL information (Name, Village, Acres, Crops, Irrigation) is collected, output a JSON object ONLY with this structure:
{
  "complete": true,
  "data": {
    "full_name": "...",
    "village": "...",
    "pincode": "...",
    "total_acres": 0.0,
    "crops": ["..."],
    "irrigation": "..."
  },
  "reply": "Thank you! I have saved your farm details. I will now create your plan."
}
(The 'reply' field should be in Hindi).

If information is missing, reply with the next question in Hindi. 
`

export async function processOnboardingMessage(userMessage: string, history: any[] = [], phoneNumber: string) {
  try {
    // 1. Try to see if we can extract data (JSON check)
    // For simplicity with Gemini, we'll ask it to generate text first, and if it looks complete, we act.
    // Or we force JSON if we think it's complete? 
    // Let's use a hybrid approach: Ask it to reply. If it detects completion, it sends a special marker?
    
    // Easier: Just use generateText. Gemini is smart.
    // We will append history manually to prompt since Gemini SDK handles history differently (ChatSession).
    // For this stateless function, we append history as string.
    
    let prompt = ONBOARDING_SYSTEM_PROMPT;
    if (history.length > 0) {
        prompt += "\nHistory:\n" + history.map((m: any) => `${m.role}: ${m.content}`).join("\n");
    }

    const response = await generateText(prompt, userMessage);
    const content = response || "";

    // Check for JSON manually (Gemini might output ```json ... ```)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.complete && parsed.data) {
           await saveFarmData(phoneNumber, parsed.data)
           return parsed.reply 
        }
      } catch (e) { console.error("JSON Parse error", e) }
    }

    return content
  } catch (error) {
    console.error("Error inside onboarding agent:", error)
    return "Maaf kara, kahi tari chukale. Punha prayatna kara." 
  }
}

async function saveFarmData(phoneNumber: string, data: any) {
  // 1. Create or Update Farmer
  const { data: farmer, error: farmerError } = await supabase
    .from('farmers')
    .upsert({ 
      phone_number: phoneNumber, 
      full_name: data.full_name 
    }, { onConflict: 'phone_number' })
    .select()
    .single()

  if (farmerError || !farmer) {
    console.error("Error saving farmer:", farmerError)
    return
  }

  // 2. Create Farm Entry
  const { error: farmError } = await supabase
    .from('farms')
    .insert({
      farmer_id: farmer.id,
      name: `${data.full_name}'s Farm`,
      location_pincode: data.pincode,
      total_acres: data.total_acres,
      irrigation_type: data.irrigation,
      // We could store crops in a separate table or JSON, for now simple logic
    })
  
  if (farmError) {
    console.error("Error saving farm:", farmError)
  }
}
