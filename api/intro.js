export default async function handler(req, res) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: `
Write a short, calm introduction (2–3 sentences) for a public tool that helps people analyze how information is presented before sharing.
Emphasize reflection and calm thinking, not judgment.
State that it is a personal public project by a Cambodian creator.
Do not mention politics, conflicts, or take any sides.
Detect the user's language automatically and respond entirely in the same language.
            `
          }
        ]
      })
    });

    const data = await response.json();

    res.json({
      intro: data.choices[0].message.content
    });

  } catch (error) {
    res.status(500).json({
      intro: "This is a personal public project created to encourage calm reflection be
