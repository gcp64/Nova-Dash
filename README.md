# Nova-Dash

Nova-Dash is a minimalist, autonomous intelligence dashboard for AI developers. It features a highly professional, monochrome (Black & White) user interface inspired by premium developer tools, complete with a live interactive terminal, real-time metrics, and seamless integration with any OpenAI-compatible API (DeepSeek, ChatGPT, Local LM Studio, etc.).

## 🌟 Features
- **Minimalist Monochrome UI**: A sleek, dark theme designed for professional developers.
- **Universal AI Support**: Connects to any AI provider that supports the OpenAI Chat Completions API format.
- **Streaming Terminal**: Watch the AI's thought process and responses stream in real-time.
- **RTL Arabic Support**: Full support for Right-To-Left layout and Arabic localization.

## 🛠️ Tech Stack
- **Frontend**: Vite + React + TypeScript + Tailwind CSS v3
- **Backend**: Node.js + Express
- **Icons**: Lucide React

## 🚀 Getting Started

### 1. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/yourusername/nova-dash.git
cd nova-dash
npm install
```

### 2. Environment Setup
Copy the example environment file and fill in your API credentials:
```bash
cp .env.example .env
```
Open `.env` and set your variables:
```env
API_KEY=your_api_key_here
BASE_URL=https://api.deepseek.com/v1 # Or any other OpenAI-compatible endpoint
MODEL_NAME=deepseek-chat
```

### 3. Run the Development Servers
You need to run both the frontend and the backend servers.

**Terminal 1 (Backend Server):**
```bash
node server.js
```

**Terminal 2 (Frontend Vite Server):**
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

## 📜 License
This project is licensed under the MIT License - Copyright (c) 2026 bob. All rights reserved.
