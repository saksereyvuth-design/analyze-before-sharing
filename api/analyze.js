export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;

  if (!text || text.length < 10) {
    return res.json({
      result:
        "The provided text is too short to analyze meaningfully. Please provide more context."
    });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemini-1.5-flash",

          system_instruction: {
            parts: [
              {
                text: `
You are a calm, neutral information analyzer.
Respond in the same language the user writes.
Do NOT verify facts. 
Focus on tone, clarity, emotional influence, and reflection.
Keep tone gentle, neutral, and de-escalating.
                `
              }
            ]
          },

          contents: [
            {
              role: "user",
              parts: [{ text }]
            }
          ],

          generationConfig: {
            temperature: 0.4,
            topP: 0.9,
            topK: 40
          },

          safetySettings: [
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUAL", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_VIOLENCE", threshold: "BLOCK_NONE" }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("GEMINI RAW RESPONSE:", JSON.stringify(data, null, 2));

    const output =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Unable to analyze the text right now.";

    return res.json({ result: output });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({
      result: "The analysis service is temporarily unavailable."
    });
  }
}
