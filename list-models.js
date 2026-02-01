const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: '.env.local' });

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // The SDK doesn't expose listModels directly on genAI instance in some versions?
        // Actually it sits on the model manager usually or we can check via a simple fetch if SDK fails.
        // Let's try standard SDK way first.
        // Wait, the SDK creates a GenerativeModel, it's not a client client.
        // We might need to use the REST API manually to be sure, or check if the SDK has a listModels method.
        // Checking docs... genAI.getGenerativeModel is the main entry.
        // There is no listModels on the main class in typical usage, but we can try a direct fetch to the API endpoint to be sure what's available.

        const apiKey = process.env.GEMINI_API_KEY;
        console.log("Using API Key (last 4):", apiKey.slice(-4));

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error);
        } else {
            console.log("Available Models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name} (DisplayName: ${m.displayName})`);
                }
            });
        }

    } catch (error) {
        console.error("Script Error:", error);
    }
}

listModels();
