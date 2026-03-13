# Zerion: AI-based Meeting Action-Item Extraction

Zerion is a modern web application designed to help college students and professionals extract meaningful action items from meeting transcripts using AI.

## 🚀 Features
- **Modern UI**: Dark mode with glassmorphism and smooth animations.
- **AI Extraction**: Powered by Google Gemini (1.5 Flash) for fast and accurate task identification.
- **Structured Output**: Clear breakdown of tasks, owners, deadlines, and priorities.
- **JSON Export**: Export your results easily for integration with other tools.

## 🛠️ Tech Stack
- **Frontend**: React + Vite (TS)
- **Styling**: Vanilla CSS (Custom tokens)
- **Animations**: Framer Motion
- **AI**: Google Generative AI (@google/generative-ai)

## 🚦 Getting Started

### 1. Prerequisites
- Node.js (v20 or higher)
- npm

### 2. Installation
```powershell
npm install
```

### 3. Running the App
```powershell
npm run dev
```

### 4. Usage
1. Open the app in your browser (usually `http://localhost:5173`).
2. (Optional) Go to **Settings** and enter your **Gemini API Key**.
3. Paste a meeting transcript into the text area.
4. Click **Extract Action Items**.

## 📝 Example Transcript
> "Rahul, can you make sure to send the project proposal by next Tuesday? Also, Priya, please coordinate with the design team by March 5th."

## 🎓 College Project Context
This project was developed as part of a college assignment to demonstrate the practical application of LLMs in productivity tools.
