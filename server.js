import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY || '';
const BASE_URL = process.env.BASE_URL || 'https://api.openai.com/v1';
const MODEL_NAME = process.env.MODEL_NAME || 'gpt-3.5-turbo';

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!API_KEY) {
      throw new Error("API Key is missing. Please check your .env file.");
    }

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [{ role: 'user', content: prompt }],
        stream: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} ${errorText}`);
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    if (!response.body) {
      throw new Error("No response body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        if (line === 'data: [DONE]') {
            res.end();
            return;
        }
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.substring(6));
            if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
              res.write(data.choices[0].delta.content);
            }
          } catch (e) {}
        }
      }
    }
    
    res.end();
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
  console.log(`Connected to API Base URL: ${BASE_URL}`);
  console.log(`Using Model: ${MODEL_NAME}`);
});
