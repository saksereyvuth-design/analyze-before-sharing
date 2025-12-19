export default async function handler(req, res) {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [
              {
                text: `
Write a short, calm introduction (2–3 sentences) for a public tool that encourages people to reflect before sharing information.
Respond in the same language as the user's input.
Keep the tone gentle, neutral, and non-political.
                `
              }
            ]
          },

          contents: [
            {
              role: "user",
              parts: [
                {
                  text: "Please generate the introduction."
                }
              ]
            }
          ],

          generationConfig: {
            temperature: 0.4
          }
        })
      }
    );

    const data = await response.json();

    const intro = 
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "This tool encourages calm reflection before sharing information.";

    res.json({ intro });

  } catch (error) {
    console.error("Intro API error:", error);
    res.status(500).json({
      intro: "The introduction service is temporarily unavailable."
    });
  }
}
