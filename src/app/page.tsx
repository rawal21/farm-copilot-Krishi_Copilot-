
"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, MessageCircle, Sprout, CloudRain, ShieldCheck, Activity } from "lucide-react"

export default function LandingPage() {
  const [demoStatus, setDemoStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const triggerDemo = async () => {
    setLoading(true)
    setDemoStatus("Sending 'Namaskar' to AI Agent...")

    try {
      // Simulate the webhook payload
      const payload = {
        object: "whatsapp_business_account",
        entry: [{
          id: "12345",
          changes: [{
            value: {
              messaging_product: "whatsapp",
              metadata: { display_phone_number: "1234567890", phone_number_id: "1234567890" },
              contacts: [{ profile: { name: "Web Visitor" }, wa_id: "919876543000" }],
              messages: [{
                from: "919876543000",
                id: "wamid.WEB_DEMO",
                timestamp: Date.now().toString(),
                text: { body: "Namaskar" },
                type: "text"
              }]
            },
            field: "messages"
          }]
        }]
      }

      await fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      setDemoStatus("✅ Message sent! Check your Server Terminal for the AI response.")
    } catch (e) {
      setDemoStatus("❌ Error sending message.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 p-4 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl text-green-700">
            <Sprout className="w-6 h-6" />
            <span>Krishi Co</span>
          </div>
          <div className="flex gap-4">
            <Link href="/admin" className="text-gray-600 hover:text-green-700 font-medium">Admin</Link>
            <Link href="https://github.com/yourusername/krishi-co" className="text-gray-600 hover:text-green-700 font-medium">GitHub</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live on Gemini 2.0 Flash
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
            The AI <span className="text-green-600">Copilot</span> for <br />
            Next-Gen Farming.
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            A Multi-Agent System that acts as a "Digital Twin" for your farm.
            Personalized advice on crops, pests, and weather — delivered simply via WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={triggerDemo}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-green-200 hover:-translate-y-1"
            >
              {loading ? "Sending..." : "Tap to Simulate 'Namaskar'"} <MessageCircle className="w-5 h-5" />
            </button>
            <Link href="/admin" className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all">
              View Admin Dashboard
            </Link>
          </div>

          {demoStatus && (
            <div className={`mt-6 p-4 rounded-lg max-w-md mx-auto text-sm font-medium ${demoStatus.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-700'}`}>
              {demoStatus}
            </div>
          )}
        </div>

        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-[20%] right-[10%] w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-[20%] w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Powered by 6 Specialized Agents</h2>
            <p className="text-gray-500 mt-2">The system orchestrates multiple AI agents to solve complex problems.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Onboarding Agent", icon: <Activity className="text-blue-500" />, desc: "Conversational intake of farm details in local vernacular." },
              { title: "Irrigation Agent", icon: <CloudRain className="text-cyan-500" />, desc: "Combines weather forecasts with soil data to save water." },
              { title: "Pest Vision Agent", icon: <ShieldCheck className="text-red-500" />, desc: "Diagnoses crop diseases from photos using Computer Vision." },
              { title: "Crop Planning", icon: <Sprout className="text-green-500" />, desc: "ROI-optimized planting schedules (Plan A vs Plan B)." },
              { title: "Market Intelligence", icon: <ArrowRight className="text-purple-500" />, desc: "Real-time mandi prices and sell/hold advice." },
              { title: "Policy & Schemes", icon: <MessageCircle className="text-orange-500" />, desc: "RAG-based government scheme eligibility check." },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>© 2026 Krishi Co. Open Source Project.</p>
        </div>
      </footer>
    </div>
  )
}
