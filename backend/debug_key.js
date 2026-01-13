const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyBLWhntOAeGhigoKr45alzTjC7jFjIxztM";
const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hi");
        console.log("SUCCESS");
    } catch (error) {
        console.error("FULL ERROR:", JSON.stringify(error, null, 2));
        console.error("MSG:", error.message);
    }
}
run();
