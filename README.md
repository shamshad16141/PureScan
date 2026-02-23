# PureScan - AI Ingredient Analysis 🧪🔍

**🚀 Live App:** [https://pure-scan-mu.vercel.app/](https://pure-scan-mu.vercel.app/)

An intelligent food ingredient scanner powered by Google's Gemini AI that analyzes product labels and provides health insights, safety warnings, and personalized recommendations.

## ✨ Features

- **📸 Smart Camera Scanning** - Capture ingredient lists with your camera
- **🤖 AI-Powered Analysis** - Google Gemini AI analyzes every ingredient
- **📊 Health Scoring** - Get health scores from 0-100  
- **⚠️ Safety Warnings** - Age-specific warnings and recommendations
- **🥗 Diet Compatibility** - Vegan, keto, diabetic, heart-safe indicators
- **📱 Responsive Design** - Works on desktop and mobile
- **📚 Scan History** - Track and review past analyses

## 🚀 Tech Stack

- **Frontend:** React 19, TypeScript, TailwindCSS
- **AI:** Google Gemini API
- **Animation:** Framer Motion  
- **Build:** Vite
- **Deployment:** Vercel
- **Icons:** Lucide React

## 🏃 Run Locally

**Prerequisites:**  Node.js

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shamshad16141/PureScan.git
   cd PureScan
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment:**
   ```bash
   cp .env.example .env.local
   ```
   Add your Gemini API key to `.env.local`:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```

4. **Run the app:**
   ```bash
   npm run dev
   ```

Visit http://localhost:3000 to view the app.

## 🔑 Getting a Gemini API Key

1. Go to [Google AI Studio](https://ai.studio/)
2. Sign in and create a new API key
3. Add it to your `.env.local` file

---

**Built with ❤️ using React + AI**
