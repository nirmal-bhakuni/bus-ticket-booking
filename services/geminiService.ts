import { GoogleGenAI } from "@google/genai";

export async function getRouteSuggestion(prompt: string, location: GeolocationPosition | null) {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const toolConfig = location ? {
        retrievalConfig: {
            latLng: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            }
        },
    } : undefined;

    // Fix: The `toolConfig` property must be nested inside the `config` object.
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{ googleMaps: {} }],
            toolConfig: toolConfig,
        },
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, groundingChunks };
}
