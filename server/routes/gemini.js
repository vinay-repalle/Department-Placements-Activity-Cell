const express = require('express');
const axios = require('axios');
const router = express.Router();

require('dotenv').config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    console.log('Received Gemini chat request:', messages);
    // System prompt to restrict answers
    const systemPrompt = "You are a helpful assistant for the RGUKT Alumni Interactive Website. Only answer questions related to this website, its features, alumni, sessions, placements, and related topics. If a question is not about the website, politely refuse.";
    const fullMessages = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...messages.map(m => ({ role: 'user', parts: [{ text: m }] }))
    ];
    console.log('Gemini API payload:', JSON.stringify({ contents: fullMessages }, null, 2));
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      { contents: fullMessages }
    );
    console.log('Gemini API response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Gemini API error:', error.message);
    if (error.response) {
      console.error('Gemini API error response data:', error.response.data);
      console.error('Gemini API error response status:', error.response.status);
      console.error('Gemini API error response headers:', error.response.headers);
    }
    console.error('Full error object:', error);
    res.status(500).json({ error: error.message, details: error.response?.data });
  }
});

module.exports = router; 