
// Real implementation would scrape Agmarknet or use an API
// This mock simulates the data structure.

interface MarketData {
  mandi: string
  price: number
  distance_km: number
  trend: "RISING" | "FALLING" | "STABLE"
}

export async function getMarketPrices(pincode: string, crop: string): Promise<MarketData[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // Mock Logic based on Crop
  if (crop.toLowerCase().includes("cotton")) {
    return [
      { mandi: "Akola Mandi", price: 7200, distance_km: 15, trend: "STABLE" },
      { mandi: "Khamgaon Mandi", price: 7350, distance_km: 40, trend: "RISING" }
    ]
  } else if (crop.toLowerCase().includes("soybean")) {
    return [
      { mandi: "Latur Mandi", price: 4800, distance_km: 120, trend: "FALLING" },
      { mandi: "Local APC", price: 4650, distance_km: 5, trend: "STABLE" }
    ]
  }

  return []
}

import { generateJSON } from '../llm'

export async function getMarketAdvice(marketData: MarketData[]) {
  const prompt = `
    Analyze these market prices. Should the farmer sell now or wait?
    Trend RISING = Wait. Trend FALLING = Sell.
    Output JSON: { "advice_mr": "...", "action": "SELL" | "HOLD" }
  `
  
  try {
    const data = await generateJSON(prompt, marketData)
    return data || {}
  } catch (e) {
    return null
  }
}
