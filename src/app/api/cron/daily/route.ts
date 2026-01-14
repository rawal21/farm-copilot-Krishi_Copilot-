
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { getIrrigationAdvice } from '@/lib/agents/irrigation'
// import { sendWhatsAppMessage } from '@/lib/whatsapp' // Mocked for now

export async function GET(req: NextRequest) {
  // Security: Check for a secret header to prevent unauthorized trigger
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // 1. Fetch active farms (Batch size: 10)
    const { data: farms, error } = await supabase
      .from('farms')
      .select('*, farmers(phone_number)')
      .limit(10)

    if (error) throw error
    if (!farms || farms.length === 0) return NextResponse.json({ message: "No farms found" })

    const results = []

    // 2. Process each farm
    for (const farm of farms) {
      if (!farm.location_pincode) continue

      // Check Irrigation Advice
      const advice = await getIrrigationAdvice(farm, farm.location_pincode)
      
      if (advice && advice.action === 'IRRIGATE') {
        const message = `🌾 *Farm Copilot Advice* 🌾\n\n${advice.advice_mr}\n\n(Irrigation recommended)`
        
        // Mock Send
        console.log(`Sending to ${farm.farmers?.phone_number}:`, message)
        // await sendWhatsAppMessage(farm.farmers?.phone_number, message)
        
        results.push({ farmId: farm.id, status: 'sent', type: 'irrigation' })
      } else {
        results.push({ farmId: farm.id, status: 'skipped', reason: 'no_action_needed' })
      }
    }

    return NextResponse.json({ success: true, processed: results.length, details: results })

  } catch (error: any) {
    console.error("Cron Error:", error)
    return new NextResponse(`Error: ${error.message}`, { status: 500 })
  }
}
