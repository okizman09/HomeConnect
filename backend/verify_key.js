const { GoogleGenerativeAI } = require("@google/generative-ai");

// Use the key provided by the user
const API_KEY = "AIzaSyBLWhntOAeGhigoKr45alzTjC7jFjIxztM";
const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = "Hello, are you working?";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Success:", text);
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}

run();
