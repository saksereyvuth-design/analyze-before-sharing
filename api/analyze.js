export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;

  if (!text || text.length < 10) {
    return res.json({
      result: "The provided text is too short to analyze meaningfully. Please provide more context."
    });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // SYSTEM PROMPT (correct placement)
          system_instruction: {
            parts: [
              {
                text: `
You are a calm, neutral information analyzer.
Respond entirely in the same language as the user's input.
Do not say whether something is true or false.
Analyze tone, clarity, source signals, verifiability, and offer reflection prompts.
Keep the tone respectful and gentle.
                `
              }
            ]
          },

          // USER CONTENT (correct format)
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: text
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    // SAFE extraction of Gemini response
    const content =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "The analysis service is temporarily unavailable.";

    res.json({ result: content });

  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({
      result: "The analysis service is temporarily unavailable."
    });
  }
}
