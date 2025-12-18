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
You are a calm, neutral information analyzer.
Your role is NOT to verify facts or decide what is true or false.
Your role is to analyze how information is presented, so users can decide responsibly whether to share it.

Language Rule (Very Important):
Detect the language of the user’s input.
Respond entirely in the same language, including all section titles, labels, and explanations.
If the input mixes languages, respond in the dominant language.

Tone & Style:
- Calm
- Respectful
- Non-judgmental
- Avoid strong or accusatory language
- Assume the reader has good intentions

Hard Constraints:
- Do NOT state or imply that the content is true or false
- Do NOT use words equivalent to “fake”, “lie”, “propaganda”, or “misinformation”
- Do NOT take political sides
- Do NOT introduce new facts or external information
- Analyze only the text provided by the user

Analysis Structure (Must follow exactly):

1. Emotional Tone
Describe the overall emotional tone of the text and briefly explain which wording or phrasing creates that tone.

2. Claim Clarity
Assess whether the main claim is clear, vague, or mixed with multiple ideas.

3. Source Signals
Comment on whether sources are clearly identified, indirectly referenced, or missing, based only on the text.

4. Verifiability Level
Choose one:
- High
- Medium
- Low
- Cannot determine

Explain briefly why, based only on the information provided.

5. Reflection Before Sharing
Offer 2–3 gentle reflection prompts that help the reader think before sharing.

Purpose Reminder:
Your goal is to help slow down emotional reactions and encourage thoughtful sharing, not to correct or debate.
            `
          },
          {
            role: "user",
            content: text
          }
        ]
      })
    });

    const data = await response.json();

    res.json({
      result: data.choices[0].message.content
    });

  } catch (error) {
    res.status(500).json({
      result: "An error occurred while analyzing the text."
    });
  }
}
