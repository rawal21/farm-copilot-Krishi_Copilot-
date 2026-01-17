
const TEST_PHONE = "919999999999";
const WEBHOOK_URL = "http://localhost:3000/api/webhook";

async function sendMsg(text) {
  console.log(`\n📤 Sending: "${text}"`);
  
  const payload = {
    object: "whatsapp_business_account",
    entry: [
      {
        changes: [
          {
            value: {
              messages: [
                {
                  from: TEST_PHONE,
                  id: "wamid.TEST_" + Date.now(),
                  timestamp: Date.now(),
                  text: { body: text },
                  type: "text"
                }
              ]
            }
          }
        ]
      }
    ]
  };

  try {
    await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    // Response is actually logged in the server terminal, not returned in the POST body usually
    // But since we are mocking sending, we can't easily capture the 'reply' unless we poll DB or rely on console.
    // Our sendWhatsAppMessage mock logs to console.
    
    // We will just wait.
  } catch(e) { console.error("Error sending:", e) }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTest() {
    console.log("🚀 Starting End-to-End Onboarding Test");
    console.log("👉 Watch your 'npm run dev' terminal for AI Responses!");

    // 1. Start
    await sendMsg("Namaskar");
    await sleep(8000); // Wait 8s for LLM

    // 2. Name
    await sendMsg("My name is Rahul");
    await sleep(8000);

    // 3. Village
    await sendMsg("I live in Punawale, 411033");
    await sleep(8000);

    // 4. Acres
    await sendMsg("I have 5 acres");
    await sleep(8000);

    // 5. Crop
    await sendMsg("I grow Cotton");
    await sleep(8000);

    // 6. Irrigation
    await sendMsg("I use Well water");
    await sleep(15000); // 15s for final Plan Generation

    console.log("\n✅ Test Sequence Sent. Check server logs for 'saved your farm details'.");
}

runTest();
