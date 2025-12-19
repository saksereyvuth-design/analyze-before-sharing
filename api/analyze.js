export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;

  if (!text || text.length < 10) {
    return res.json({
      result: "The provided text is too short to analyze meaningfully. Please provide more context.",
    });
  }

  try {
    const API_KEY = process.env.GENIMI_API_KEY;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text }],
          },
        ],
        system_instruction: {
          parts: [
            {
              text: `
You are a calm, neutral information analyzer.
Respond in the user's language.
Do NOT verify facts.
Analyze tone, clarity, emotional influence.
Keep tone gentle and de-escalating.
`,
            },
          ],
        },
        generationConfig: {
          temperature: 0.4,
          topP: 0.9,
          topK: 40,
        },
      }),
    });

    const data = await response.json();
    return res.json({ result: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
