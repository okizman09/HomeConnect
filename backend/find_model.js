const { GoogleGenerativeAI } = require("@google/generative-ai");

// Use the key provided by the user
const API_KEY = "AIzaSyBLWhntOAeGhigoKr45alzTjC7jFjIxztM";
const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
    try {
        // There isn't a direct listModels on the genAI instance in some versions?
        // Let's try to just use 'gemini-1.0-pro' which is often the stable alias if 'gemini-pro' fails.
        // Or I can try to access the model list if I had the admin SDK, but here client SDK might differ.
        // Let's brute force try a few common ones.

        const candidates = ["gemini-1.0-pro", "gemini-pro-vision", "gemini-1.5-pro-latest"];

        for (const m of candidates) {
            try {
                console.log(`Testing ${m}...`);
                const model = genAI.getGenerativeModel({ model: m });
                const result = await model.generateContent("Hi");
                console.log(`SUCCESS with ${m}`);
                process.exit(0);
            } catch (e) {
                console.log(`Failed ${m}: ${e.message.split(':')[0]}`);
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

run();
