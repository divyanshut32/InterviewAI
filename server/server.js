import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "InterviewAI backend is running"
  });
});

async function generateWithFallback(prompt) {
  const models = [
    process.env.GEMINI_MODEL || "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.5-flash-lite"
  ];

  let lastError = null;

  for (const model of models) {
    console.log(`Trying Gemini model: ${model}`);

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });

        console.log(`Gemini success using: ${model}`);

        return response;

      } catch (error) {
        lastError = error;

        console.error(
          `Gemini ${model} failed - attempt ${attempt}/2 - status: ${error.status}`
        );

        // Only retry temporary/server errors.
        if (
          error.status !== 503 &&
          error.status !== 429 &&
          error.status !== 500 &&
          error.status !== 504
        ) {
          throw error;
        }

        if (attempt < 2) {
          const delay = 1500 * Math.pow(2, attempt - 1);

          console.log(
            `Waiting ${delay}ms before retrying ${model}...`
          );

          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    console.log(`Moving to fallback model...`);
  }

  throw lastError;
}

app.post("/api/evaluate", async (req, res) => {
  try {
    const {
      question,
      answer,
      technology,
      role,
      difficulty
    } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        error: "Question and answer are required."
      });
    }

    const prompt = `
You are an expert technical interviewer evaluating a candidate.

Candidate Role: ${role}
Technology: ${technology}
Difficulty: ${difficulty}

Interview Question:
${question}

Candidate Answer:
${answer}

Evaluate the candidate fairly.

Consider:

1. Technical knowledge
2. Accuracy
3. Clarity
4. Communication
5. Relevance to the question
6. Practical understanding

The candidate may be a fresher, so do not expect expert-level knowledge.

Return ONLY valid JSON in exactly this structure:

{
  "overallScore": 0,
  "technicalKnowledge": 0,
  "accuracy": 0,
  "clarity": 0,
  "communication": 0,
  "strengths": [
    "strength 1",
    "strength 2"
  ],
  "improvements": [
    "improvement 1",
    "improvement 2"
  ],
  "feedback": "Short practical feedback for the candidate.",
  "betterAnswer": "A concise example of a stronger interview answer."
}

Rules:

- All scores must be integers between 0 and 100.
- Keep the evaluation practical.
- Keep the feedback concise.
- Do not include markdown.
- Return valid JSON only.
`;

    const response = await generateWithFallback(prompt);

    const text = response.text?.trim() || "";

    let cleanedText = text;

    // Remove accidental markdown JSON fences if Gemini adds them.
    cleanedText = cleanedText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let evaluation;

    try {
      evaluation = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Gemini response:", text);

      return res.status(500).json({
        success: false,
        error: "Gemini returned an invalid evaluation.",
        raw: text
      });
    }

    return res.json({
      success: true,
      evaluation
    });

  } catch (error) {
    console.error("Gemini evaluation error:", error);

    return res.status(503).json({
      success: false,
      error: "Gemini is temporarily unavailable. Please try again.",
      message: error.message,
      status: error.status || 503
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `InterviewAI backend running on http://localhost:${PORT}`
  );
});