require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(express.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

// API: POST /ask
app.post('/ask', async (req, res) => {
  const question = req.body.question;
  if (!question) return res.status(400).json({ error: 'Missing question' });

  try {
    // 1. Gọi Tavily Search
    const tavilyResp = await axios.post(
      'https://api.tavily.com/search',
      {
        query: question,
        search_depth: 'basic',
        include_answer: true,
        include_raw_content: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const webContext = tavilyResp.data.answer;

    // 2. Gọi GPT với context từ Tavily
    const completion = await openai.createChatCompletion({
      model: 'gpt-4', // hoặc gpt-3.5-turbo nếu muốn nhanh hơn
      messages: [
        { role: 'system', content: 'Bạn là trợ lý AI thông minh, luôn cung cấp thông tin chính xác.' },
        { role: 'user', content: question },
        { role: 'system', content: `Dưới đây là thông tin từ web:\n${webContext}` },
      ],
      temperature: 0.7,
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ answer: reply });
  } catch (error) {
    console.error(error?.response?.data || error);
    res.status(500).json({ error: 'Lỗi xử lý yêu cầu' });
  }
});

app.listen(3000, () => console.log('Assistant API chạy tại http://localhost:3000'));