import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Load .env (only needed if not already done in server.js)
dotenv.config();

// Debug: confirm key is loaded
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Gemini API Key not found in .env");
} else {
  console.log("✅ Gemini API Key loaded");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateSummary = async (content) => {
  const prompt = `Summarize the following document in 3-4 sentences:\n\n${content}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const generateTags = async (content) => {
  const prompt = `Generate 3-5 relevant tags for the following document. 
Return only a JSON array of strings, e.g. ["React", "Hooks", "useState"]:\n\n${content}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    // Extract JSON array using regex if AI adds extra text
    const match = text.match(/\[.*\]/s);
    if (match) {
      return JSON.parse(match[0]);
    }
    // Fallback: split by commas if no valid JSON
    return text.split(",").map(t => t.trim()).filter(Boolean);
  } catch (err) {
    console.error("❌ Tag parsing error:", err, text);
    return [];
  }
};


export const generateEmbedding = async (content) => {
  const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
  const result = await embeddingModel.embedContent(content);
  return result.embedding.values;
};
