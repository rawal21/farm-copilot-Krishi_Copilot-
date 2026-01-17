import { HfInference } from "@huggingface/inference";
import fs from "fs";
import path from "path";

// Manually parse .env.local to avoid 'dotenv' dependency
const envPath = path.resolve(process.cwd(), ".env.local");
let apiKey = process.env.HUGGINGFACE_API_KEY;

if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  for (const line of envConfig.split("\n")) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^['"](.*)['"]$/, "$1"); // Remove quotes
      if (key === "HUGGINGFACE_API_KEY") {
        apiKey = value;
      }
    }
  }
}

if (!apiKey) {
  console.error("❌ HUGGINGFACE_API_KEY is missing in .env.local");
  process.exit(1);
}

console.log("🔑 Found API Key:", apiKey.substring(0, 8) + "...");
const hf = new HfInference(apiKey);

const modelsToTest = [
  "meta-llama/Llama-3.2-3B-Instruct",
  "Qwen/Qwen2.5-7B-Instruct",
  "microsoft/Phi-3.5-mini-instruct",
  "google/gemma-2-9b-it"
];

async function testModel(modelName) {
  console.log(`\n⏳ Testing model: ${modelName}...`);
  try {
    const response = await hf.chatCompletion({
      model: modelName,
      messages: [{ role: "user", content: "Say hello!" }],
      max_tokens: 50,
    });
    console.log(`✅ SUCCESS! ${modelName} works.`);
    console.log(`   Response: ${response.choices[0].message.content}`);
    return true;
  } catch (error) {
    console.error(`❌ FAILED ${modelName}:`);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Body:`, await error.response.text());
    } else {
      console.error(`   Message: ${error.message}`);
    }
    return false;
  }
}

async function runTests() {
  for (const model of modelsToTest) {
    const success = await testModel(model);
    if (success) {
      console.log(`\n🎉 RECOMMENDED MODEL: ${model}`);
      console.log(`👉 Please update src/lib/llm.ts with this model name.`);
      process.exit(0);
    }
  }
  console.error("\n❌ All models failed. Check your API Key permissions (Fine-grained > Inference).");
  process.exit(1);
}

runTests();
