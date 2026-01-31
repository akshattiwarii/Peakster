const { GoogleGenerativeAI } = require("@google/generative-ai");

async function main() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Testing gemini-1.5-flash...");
        // We can't list models easily with the basic client in a simple way without using the model directly usually,
        // actually checking the docs, genAI instance doesn't have listModels directly exposed in clean way in some versions,
        // but usually it is purely model based. 
        // Wait, the error message said "Call ListModels to see the list".
        // Does the SDK support it? 
        // No, the node SDK doesn't expose listModels on the top level easily in all versions.
        // Let's try to just run a simple generateContent with a fallback list of models to try.

        const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro"];

        for (const m of modelsToTry) {
            try {
                console.log(`Trying model: ${m}`);
                const modelInstance = genAI.getGenerativeModel({ model: m });
                const result = await modelInstance.generateContent("Hello");
                console.log(`SUCCESS with ${m}`);
                return;
            } catch (e) {
                console.log(`FAILED ${m}: ${e.message.split('\n')[0]}`);
            }
        }
    } catch (error) {
        console.error(error);
    }
}

main();
