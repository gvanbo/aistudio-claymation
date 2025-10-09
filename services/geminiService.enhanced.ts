import { GenerationConfig } from '../types.enhanced';

// --- Configuration for Local Environment/Vite Injection ---
// To use a local .env file (as commonly done in development with Vite), 
// we read the API key directly from the environment variables exposed by Vite's define block.
// Note: In a secure deployment environment like Canvas, this value is usually injected or provided 
// as an empty string to be handled by the runtime system.
const apiKey = process.env.GEMINI_API_KEY || ""; 

const MODEL_NAME = 'gemini-2.5-flash-image-preview'; 
const API_URL_BASE = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

/**
 * Utility function for exponential backoff retry logic.
 */
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) {
                return response;
            }
            // Retry on specific server errors or rate limiting (429)
            if (response.status === 429 || response.status >= 500) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response; // Return for 4xx errors that shouldn't be retried
        } catch (error) {
            if (i < maxRetries - 1) {
                // Exponential backoff with jitter: 1-2s, 2-3s, 4-5s
                const baseDelay = 2 ** i * 1000; 
                const jitter = Math.random() * 1000; // Add up to 1s of randomness
                const delay = baseDelay + jitter;
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }
    throw new Error('Fetch failed after maximum retries.');
}

/**
 * Enhanced image generation with configurable output options using the gemini-2.5-flash-image-preview model.
 */
export async function generateImage(prompt: string, config?: Partial<GenerationConfig>): Promise<string> {
    const finalConfig = {
        outputFormat: config?.outputFormat || 'png',
        qualityLevel: config?.qualityLevel || 'print',
        aspectRatio: config?.aspectRatio || '1:1',
    };
    
    // The nano model uses the generateContent endpoint with specific generationConfig
    // Note: The apiKey is only added here if it's explicitly set (e.g., in a local .env file). 
    // If running in an environment that handles injection (and apiKey is an empty string), 
    // the query parameter will simply be empty, allowing the runtime to handle authorization.
    const apiKeyParam = apiKey ? `?key=${apiKey}` : '';
    const apiUrl = `${API_URL_BASE}${apiKeyParam}`;

    const payload = {
        contents: [{
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            // Mandate both TEXT and IMAGE modalities for image generation
            responseModalities: ['TEXT', 'IMAGE'], 
        },
    };

    try {
        const response = await fetchWithRetry(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        const candidate = result.candidates?.[0];

        if (candidate) {
            // Extract the base64 image data from inlineData part
            const base64Data = candidate.content?.parts?.find((p: any) => p.inlineData)?.inlineData?.data;

            if (base64Data) {
                return base64Data;
            }
            
            // Handle generation failure or safety block with error message
            const textOutput = candidate.content?.parts?.find((p: any) => p.text)?.text;
            
            if (result.promptFeedback?.blockReason || textOutput) {
                 throw new Error(textOutput || `Image generation failed. This might be due to safety filters or an empty response.`);
            }
        }
        
        throw new Error("Image generation failed: No image data returned from the API.");

    } catch (error) {
        console.error("Error generating image:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unexpected error occurred while generating the image.");
    }
}

/**
 * Legacy compatibility function - maintains original aistudio-claymation API
 */
export async function generateImageLegacy(prompt: string): Promise<string> {
    return generateImage(prompt, { outputFormat: 'jpeg' });
}

/**
 * Educational-optimized generation presets
 */
export async function generateEducationalImage(
    prompt: string, 
    useCase: 'print' | 'web' | 'interactive'
): Promise<string> {
    const configs = {
        print: {
            outputFormat: 'png' as const,
            qualityLevel: 'high_res' as const,
            aspectRatio: '1:1' as const
        },
        web: {
            outputFormat: 'jpeg' as const,
            qualityLevel: 'web' as const,
            aspectRatio: '1:1' as const
        },
        interactive: {
            outputFormat: 'png' as const,
            qualityLevel: 'print' as const,
            aspectRatio: '1:1' as const
        }
    };
    
    return generateImage(prompt, configs[useCase]);
}

/**
 * Batch generation for multiple characters or poses
 */
export async function generateImageBatch(
    prompts: Array<{ prompt: string; config?: Partial<GenerationConfig>; id: string }>,
    onProgress?: (completed: number, total: number, currentId: string) => void
): Promise<Array<{ id: string; imageData: string; error?: string }>> {
    const results = [];
    
    for (let i = 0; i < prompts.length; i++) {
        const { prompt, config, id } = prompts[i];
        
        try {
            if (onProgress) {
                onProgress(i, prompts.length, id);
            }
            
            // Note: The nano model will handle the prompt as input to generate the image
            const imageData = await generateImage(prompt, config);
            results.push({ id, imageData });
            
            // Increased delay to avoid rate limiting, especially for larger batches.
            if (i < prompts.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000)); // Increased from 1s to 2s
            }
        } catch (error) {
            console.error(`Failed to generate image for ${id}:`, error);
            results.push({ 
                id, 
                imageData: '', 
                error: error instanceof Error ? error.message : 'Unknown error' 
            });
        }
    }
    
    if (onProgress) {
        onProgress(prompts.length, prompts.length, 'completed');
    }
    
    return results;
}
