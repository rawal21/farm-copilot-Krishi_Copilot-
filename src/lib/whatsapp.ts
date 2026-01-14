
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID // Add to env

export async function sendWhatsAppMessage(to: string, text: string) {
  if (!ACCESS_TOKEN || !PHONE_NUMBER_ID) {
    console.log(`[SIMULATION MODE] WhatsApp message to ${to}: ${text}`)
    return { success: true, simulated: true }
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          text: { body: text },
        }),
      }
    )

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error sending WhatsApp message:", error)
  }
}
