
import { NextRequest, NextResponse } from 'next/server'

// Verify Token should be same as in Meta App Dashboard
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED')
      return new NextResponse(challenge, { status: 200 })
    } else {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  return new NextResponse('Bad Request', { status: 400 })
}

// Helper to getting or creating farmer ID by phone
async function getOrCreateFarmer(phone: string) {
  const { data, error } = await supabase.from('farmers').select('id').eq('phone_number', phone).single()
  if (data) return data.id
  
  const { data: newData, error: newError } = await supabase.from('farmers').insert({ phone_number: phone, full_name: 'Guest' }).select('id').single()
  if (newData) return newData.id
  return null
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('Incoming webhook:', JSON.stringify(body, null, 2))

    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value
    const message = value?.messages?.[0]

    if (message) {
      const from = message.from 
      const text = message.text?.body

      if (from && text) {
        const farmerId = await getOrCreateFarmer(from)

        // 1. Save User Message
        if (farmerId) {
            await supabase.from('interactions').insert({
                farmer_id: farmerId,
                message_type: 'received',
                content: text
            })
        }

        // 2. Fetch History (Last 10)
        let history = []
        if (farmerId) {
            const { data: dbHistory } = await supabase
                .from('interactions')
                .select('message_type, content')
                .eq('farmer_id', farmerId)
                .order('created_at', { ascending: false })
                .limit(10)
            
            if (dbHistory) {
                // Convert to LLM format (reverse order so oldest first)
                history = dbHistory.reverse().map(i => ({
                    role: i.message_type === 'received' ? 'user' : 'model',
                    content: i.content
                }))
            }
        }

        // 3. Process with Agent
        const replyText = await processOnboardingMessage(text, history, from)
        
        // 4. Send & Save Response
        if (replyText) {
          await sendWhatsAppMessage(from, replyText)
          
          if (farmerId) {
            await supabase.from('interactions').insert({
                farmer_id: farmerId,
                message_type: 'sent',
                content: replyText
            })
          }
        }
      }
    }
    
    return new NextResponse('EVENT_RECEIVED', { status: 200 })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// Ensure supabase is imported
import { supabase } from '../../../lib/supabaseClient'

// Import at top (mocking for the edit tool as I can't add imports easily without replacing whole file or careful placement)
import { processOnboardingMessage } from '../../../lib/agents/onboarding'
import { sendWhatsAppMessage } from '../../../lib/whatsapp'

