export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Write a short, calm introduction (2–3 sentences) for a public tool that encourages people to reflect before sharing information. Respond in the same language as user input. Keep it neutral and gentle."
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();
    const intro = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      "This tool encourages calm reflection before sharing information.";

    res.json({ intro });

  } catch (error) {
    res.status(500).json({
      intro: "The introduction service is temporarily unavailable."
    });
  }
}
