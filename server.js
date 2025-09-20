const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.post('/api/chat', async (req, res) => {
    const { topic } = req.body;
    if(!topic) return res.status(400).json({ error: 'Topic required' });

    try {
        const prompt = `
You are Quark AI Study Helper. For topic "${topic}", provide:
- 2-line definition
- 4 key points
- 1 highlight bullet point
Format clearly with line breaks and bullets.
`;

        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: process.env.MODEL_NAME,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 400
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const answer = response.data?.choices?.[0]?.message?.content || 'No response';
        res.json({ response: answer });
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: 'AI API error', details: err.message });
    }
});

app.listen(PORT, () => console.log(`Quark backend running on port ${PORT}`));
