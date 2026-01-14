
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY
const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast"

interface WeatherData {
  city: string
  list: Array<{
    dt_txt: string
    main: { temp: number; humidity: number }
    weather: Array<{ description: string; main: string }>
    rain?: { "3h": number }
  }>
}

export async function getWeatherForecast(pincode: string, countryCode = "IN") {
  if (!OPENWEATHER_API_KEY) {
    console.warn("OPENWEATHER_API_KEY is not set")
    return null
  }

  try {
    // 1. Get Lat/Lon from Geocoding (simplified using direct zip param in forecast if supported or separate call)
    // OpenWeather forecast supports zip={pincode},{countryCode} directly
    const url = `${BASE_URL}?zip=${pincode},${countryCode}&appid=${OPENWEATHER_API_KEY}&units=metric`
    
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Weather fetch failed: ${res.statusText}`)
    
    const data: WeatherData = await res.json()
    return data
  } catch (error) {
    console.error("Error fetching weather:", error)
    return null
  }
}

export function generateWeatherSummary(weatherData: WeatherData | null): string {
  if (!weatherData) return "Weather data unavailable."

  // Simple heuristic: Check next 3 days for rain
  let rainLikely = false
  let highTemp = 0

  const next3Days = weatherData.list.slice(0, 24) // Approx 3 days (8 segments per day)
  
  for (const segment of next3Days) {
    if (segment.weather[0].main === 'Rain' || (segment.rain && segment.rain["3h"] > 0)) {
      rainLikely = true
    }
    if (segment.main.temp > highTemp) highTemp = segment.main.temp
  }

  if (rainLikely) {
    return `Rain is expected in the next 3 days. Highs around ${Math.round(highTemp)}°C.`
  } else {
    return `No rain expected in the next 3 days. Clear skies. Highs around ${Math.round(highTemp)}°C.`
  }
}
