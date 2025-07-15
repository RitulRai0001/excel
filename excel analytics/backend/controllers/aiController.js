const fetch = require('node-fetch');

// Replace with your Google API key
const GOOGLE_API_KEY = 'AIzaSyBC_Q25EPEHrXIQBkBIDf3W363x0qnx8o0';

exports.summary = async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) return res.status(400).json({ message: 'No data provided' });

    const prompt = `Summarize the following analysis data in plain English for a business user.\n\n${JSON.stringify(data)}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    const result = await response.json();
    console.log("Google API response:", result);

    const summary = result.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary generated.';
    res.json({ summary });

  } catch (err) {
    res.status(500).json({ message: 'AI summary error', error: err.message });
  }
};
