# 🚜 Krishi Co (Farm Copilot)

> **AI-Powered "Digital Twin" for 100M+ Indian Farmers**  
> *Vernacular, Voice-First, and Vision-Enabled Agricultural Advisory.*

![Krishi Co Banner](/path/to/banner.png)

## 🌟 Overview(Portfolio)

**Krishi Co** is a Multi-Agent AI System designed to democratize high-quality agricultural advice. Unlike generic Chatbots, Krishi Co creates a **Digital Twin** of every farm (soil, crop, geolocation) and provides proactive, hyper-personalized advice via **WhatsApp** in the farmer's local language (Marathi/Hindi).

Built with **Next.js**, **Supabase**, and **Google Gemini 2.0 Flash**, it solves the "last-mile" problem in agritech.

## 🚀 Key Features

*   **🗣️ Vernacular Onboarding**: Conversational AI on WhatsApp collects farm details (Acres, Soil, Budget) in native languages.
*   **🌿 Personalized Crop Plans**: Generates Plan A (High Yield) vs. Plan B (Low Risk) based on soil health and budget.
*   **💧 Intelligent Irrigation**: Combines real-time Hyperlocal Weather (OpenWeather) + Soil Moisture estimates to advise "Irrigate" or "Wait".
*   **🦠 Pest Diagnosis (Vision AI)**: Farmers send a photo of a leaf; the AI identifies the pest (e.g., Pink Bollworm) and recommends safe chemicals.
*   **📉 Market & Policy**: RAG-based search for Government Schemes (MahaDBT) and real-time Mandi Prices.
*   **⏰ Proactive Scheduler**: Automated Cron jobs send daily alerts without the farmer needing to ask.

## 🛠️ Tech Stack

*   **Framework**: Next.js 14 (App Router)
*   **Language**: TypeScript
*   **AI Model**: Google Gemini 2.0 Flash (Native SDK)
*   **Database**: Supabase (PostgreSQL + pgvector)
*   **Messaging**: WhatsApp Business API (Meta)
*   **Styling**: Tailwind CSS
*   **Deployment**: Vercel

---

## 👨‍💻 Getting Started (For Developers)

### Prerequisites
*   Node.js v18+
*   Supabase Account
*   Google AI Studio Key (Free)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/krishi-co.git
cd krishi-co
```

### 2. Environment Setup
Rename `.env.example` to `.env.local` and add your keys:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
GEMINI_API_KEY=your_google_gemini_key
WHATSAPP_ACCESS_TOKEN=your_meta_token
WHATSAPP_PHONE_NUMBER_ID=your_id
OPENWEATHER_API_KEY=your_key
CRON_SECRET=custom_secret
```

### 3. Database Migration
Run the SQL script found in `schema.sql` inside your Supabase SQL Editor to create tables (`farmers`, `farms`, `crop_plans`).

### 4. Run Locally
```bash
npm install
npm run dev
```
Visit `http://localhost:3000`.

### 5. Simulate WhatsApp (No Phone Needed)
We have a built-in simulation mode.
*   **Method A**: Use the "Try Demo" button on the localhost landing page.
*   **Method B**: Run the terminal script:
    ```bash
    sh test_simulation.sh
    ```

---

## 🤝 Contributing

We welcome contributions! specifically in:
1.  **New Agents**: Adding a "Veterinary Agent" for cattle.
2.  **Languages**: Adding support for Telugu or Kannada.
3.  **UI**: Improving the Farmer Dashboard.

**Steps:**
1.  Fork the repo.
2.  Create a branch (`git checkout -b feature/AmazingFeature`).
3.  Commit changes (`git commit -m 'Add AmazingFeature'`).
4.  Push (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ for Indian Farmers.**
