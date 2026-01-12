const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.models) {
        const textModels = data.models.filter(m => 
            m.supportedGenerationMethods && 
            m.supportedGenerationMethods.includes("generateContent")
        );
        console.log("Generative Models:");
        textModels.forEach(m => console.log(`- ${m.name} (${m.displayName})`));
    } else {
        console.log("No models found or error:", data);
    }
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listModels();
