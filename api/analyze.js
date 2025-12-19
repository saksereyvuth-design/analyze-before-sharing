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
    const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID; gen-lang-client-0130748957
    const API_KEY = process.env.GEMINI_API_KEY;

    const endpoint = `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text }]
          }
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
              `
            }
          ]
        },
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
    });

    const data = await response.json();
    console.log("GEMINI RAW:", JSON.stringify(data, null, 2));

    const output =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Unable to analyze the text right now.";

    res.json({ result: output });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      result: "The analysis service is temporarily unavailable."
    });
  }
}
