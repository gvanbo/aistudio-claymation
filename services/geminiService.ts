import { GoogleGenAI } from "@google/genai";

// Prefer GEMINI_API_KEY (explicit) fallback to generic API_KEY for backwards compatibility
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY (or legacy API_KEY) environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey });

export async function generateImage(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return base64ImageBytes;
        } else {
            throw new Error("Image generation failed: No images were returned.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        // Re-throw a more user-friendly error
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unexpected error occurred while generating the image.");
    }
}