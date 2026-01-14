const fs = require('fs');
const path = require('path');

// Manually load .env.local
try {
  const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      if (key && !process.env[key]) {
        process.env[key] = value;
      }
    }
  });
} catch (e) {
  console.log("Could not load .env.local");
}

console.log("Testing Raw Fetch to Gemini...");

const apiKey = process.env.GEMINI_API_KEY;

async function testRaw() {
  const url = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
  const models = ["gpt-3.5-turbo", "gemini-1.5-flash"];

  for (const model of models) {
    console.log(`\nTesting Model: ${model}`);
    try {
        const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: model,
            messages: [{ role: "user", content: "Hi" }]
        })
        });

        if (!response.ok) {
            console.log("Status:", response.status);
            // const text = await response.text(); 
            // console.log("Body:", text.substring(0, 200)); 
        } else {
            const data = await response.json();
            console.log("SUCCESS! Model found:", model);
            console.log("Content:", data.choices[0].message.content);
            return; 
        }
    } catch (e) {
        console.error("Fetch error:", e.message);
    }
  }
}

testRaw();

