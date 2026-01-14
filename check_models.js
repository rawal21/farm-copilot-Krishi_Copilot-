
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Load env
try {
  const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf-8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
       process.env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  });
} catch (e) {}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function checkKeyAndListModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
      console.log("No API Key found.");
      return;
  }
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  console.log(`Checking API Key permissions via: ${url.replace(apiKey, "HIDDEN")} ...`);

  try {
      const response = await fetch(url);
      if (!response.ok) {
          console.log(`API Error: ${response.status} ${response.statusText}`);
          const text = await response.text();
          console.log("Details:", text);
          return;
      }
      
      const data = await response.json();
      console.log("✅ API Key is Valid! Available Models:");
      if (data.models) {
          data.models.forEach(m => {
              if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                  console.log(` - ${m.name.replace('models/', '')}`);
              }
          });
      } else {
          console.log("No models found?", data);
      }

  } catch (error) {
      console.error("Network Error:", error);
  }
}

checkKeyAndListModels();
