const router = require("express").Router();
const { GoogleGenAI } = require("@google/genai");
const { env } = require("../config/env");

const apiKey = env.geminiApiKey;
const ai = new GoogleGenAI({ apiKey });

router.post("/analyze", async (req, res) => {
  try {
    const { question, variables, hypothesis } = req.body;
    
    const prompt = `
You are an expert Biotech Engineering AI assistant.
A user is investigating a biotechnology/bioprocess problem.

Problem/Question:
${question}

User's Input Variables / Context:
${variables || "None provided"}

User's Hypothesis:
${hypothesis || "None provided"}

Please formulate your answer strictly using the following two frameworks:
1. "5 Whys": Root cause analysis breaking down the problem step-by-step.
2. "Hypothesis Validation Matrix": Evaluate the user's hypothesis based on the provided variables and established biotech engineering principles (True/False/Plausible with explanation).

Keep the response professional, highly technical, and directly focused on bioprocess engineering. Output in Markdown format.
`;

    const response = await ai.models.generateContentStream({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of response) {
      if (chunk.text) {
        res.write(chunk.text);
      }
    }
    res.end();
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate analysis" });
  }
});

module.exports = router;
