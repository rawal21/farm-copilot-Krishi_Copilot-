
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('Incoming webhook:', JSON.stringify(body, null, 2))

    // Parse WhatsApp Message
    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value
    const message = value?.messages?.[0]

    if (message) {
      const from = message.from // User's phone number
      const text = message.text?.body

      if (from && text) {
        // TODO: Fetch conversation history from DB
        const replyText = await processOnboardingMessage(text, [], from)
        
        if (replyText) {
             // In a real app, Import this from lib/whatsapp
             console.log(`[Mock Send] To: ${from}, Message: ${replyText}`)
             // await sendWhatsAppMessage(from, replyText) 
        }
      }
    }
    
    return new NextResponse('EVENT_RECEIVED', { status: 200 })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// Import at top (mocking for the edit tool as I can't add imports easily without replacing whole file or careful placement)
import { processOnboardingMessage } from '../../../lib/agents/onboarding'

