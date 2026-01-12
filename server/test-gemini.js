const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Use the key explicitly provided by the user if .env fails, or just rely on dotenv
const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBEO2sQ2boY28SoqA_cxhH-kcoak-tijGg";

const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
  try {
    console.log("Testing Gemini API with Key:", API_KEY ? "Present" : "Missing");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Getting response...");
    const result = await model.generateContent("Hello, are you working?");
    const response = await result.response;
    const text = response.text();
    console.log("Success! Response:", text);
  } catch (error) {
    console.error("Gemini Verification Error:", error);
  }
}

run();
