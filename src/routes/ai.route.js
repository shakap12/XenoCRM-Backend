const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/message-suggestions', async (req, res) => {
    const { campaignObjective } = req.body;

    try {
        const response = await axios.post(
            'https://api.cohere.ai/v1/generate',
            {
                model: 'command', // or 'command' depending on your access
                prompt: `Generate 3 short, friendly marketing message variants for the campaign objective: "${campaignObjective}"`,
                max_tokens: 150,
                temperature: 0.7,
                stop_sequences: ["--"],
                return_likelihoods: 'NONE'
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const raw = response.data.generations[0].text;
        const suggestions = raw
            .split('\n')
            .map(line => line.trim())
            .filter(line => line && /^[\d\-•"]/.test(line)) // starts with number, bullet, or quote
            .map(line => line.replace(/^[\d\.\-\•\s"]+/, '').trim()) // remove leading bullet/number/quote
            .filter(Boolean);

        res.json({ suggestions });
    } catch (error) {
        console.error("AI Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to generate suggestions" });
    }
});

module.exports = router;
