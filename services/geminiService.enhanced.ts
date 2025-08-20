// Enhanced Gemini service combining best practices from both applications

import { GoogleGenAI } from "@google/genai";
import { GenerationConfig } from '../types.enhanced';

// Prefer GEMINI_API_KEY (explicit) fallback to generic API_KEY for backwards compatibility
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY (or legacy API_KEY) environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey });

/**
 * Enhanced image generation with configurable output options
 * Combines aistudio-claymation's robust error handling with cartoon-character-generator's format control
 */
export async function generateImage(prompt: string, config?: Partial<GenerationConfig>): Promise<string> {
    const finalConfig = {
        outputFormat: config?.outputFormat || 'png',
        qualityLevel: config?.qualityLevel || 'print',
        aspectRatio: config?.aspectRatio || '1:1'
    };
    
    // Determine output MIME type based on format and use case
    const outputMimeType = finalConfig.outputFormat === 'png' ? 'image/png' : 'image/jpeg';
    
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: outputMimeType,
                aspectRatio: finalConfig.aspectRatio,
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
        // Enhanced error handling from aistudio-claymation
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
 * Useful for creating educational resource sets
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
            
            const imageData = await generateImage(prompt, config);
            results.push({ id, imageData });
            
            // Small delay to avoid rate limiting
            if (i < prompts.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
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
