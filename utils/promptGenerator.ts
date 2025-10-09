// Enhanced prompt generation utilities combining best practices from both applications

import { Character, EnhancedCharacter, GenerationConfig, PromptGenerationOptions, HeightCategory } from '../types.enhanced';
import { CLAYMATION_STYLE_PREFIX, CLAYMATION_STYLE_SUFFIX } from '../constants/characters'; // Import global styles

/**
 * Transform aistudio-claymation character to enhanced format
 * Preserves all original data while adding new capabilities
 */
export function transformCharacterData(key: string, character: Character): EnhancedCharacter {
    return {
        ...character,
        id: key,
        appearance: character.base_description, // Use detailed description as appearance
        placeholderImage: `/models/${key}.png` // Optional placeholder
    };
}

/**
 * Validate and normalize generation configuration
 */
export function validateConfig(config: Partial<GenerationConfig>): GenerationConfig {
    return {
        outputFormat: config.outputFormat || 'png',
        backgroundOption: config.backgroundOption || 'transparent',
        qualityLevel: config.qualityLevel || 'print',
        aspectRatio: config.aspectRatio || '1:1',
        customBackground: config.customBackground
    };
}

/**
 * Generate height relationships for multi-character scenes using explicit height categories.
 * This is more reliable and cleaner than string matching.
 */
export function calculateHeightRelationships(characters: EnhancedCharacter[]): string {
    const heightOrder: HeightCategory[] = ['short_child', 'medium_child', 'teenager', 'adult'];
    
    // 1. Map and sort characters by explicit height category
    const characterHeights = characters.map(char => ({
        name: char.character_name,
        category: char.height_category,
    }));
    
    characterHeights.sort((a, b) => heightOrder.indexOf(a.category) - heightOrder.indexOf(b.category));
    
    // 2. Generate height instructions
    let heightDescriptions = '';
    for (let i = 1; i < characterHeights.length; i++) {
        const shorterChar = characterHeights[i-1];
        const tallerChar = characterHeights[i];
        
        // Only generate comparison if categories are different
        if (shorterChar.category !== tallerChar.category) {
            // Use specific age comparison for better prompt grounding
            const isStudentTeacher = tallerChar.category === 'adult' && (shorterChar.category === 'short_child' || shorterChar.category === 'medium_child' || shorterChar.category === 'teenager');
            
            if (isStudentTeacher) {
                // Highly important for proportions: enforce adult size vs small child size
                heightDescriptions += `${tallerChar.name} must be rendered with full adult proportions and standing significantly taller than ${shorterChar.name} who must retain their correct child proportions. `;
            } else {
                 heightDescriptions += `${tallerChar.name} is visibly taller than ${shorterChar.name}. `;
            }
        }
    }
    
    return heightDescriptions.trim();
}

/**
 * Generate background instruction based on configuration
 */
export function generateBackgroundInstruction(config: GenerationConfig): string {
    switch (config.backgroundOption) {
        case 'transparent':
            return 'The final image must have a transparent background. DO NOT add any background color, elements, or scenery behind the character(s).';
        case 'illustrated':
            return `The character is in a scene with a full illustrated background. The background is described as: "${config.customBackground || "a simple, aesthetically pleasing educational background that complements the character(s)' pose"}". The art style should apply to the character and the background.`;
        case 'solid_white':
            return 'The image has a solid white, pure white background (#FFFFFF). DO NOT add any objects or scenery.';
        default:
            return 'The final image must have a transparent background. DO NOT add any background color, elements, or scenery behind the character(s).';
    }
}

/**
 * Generate quality specifications based on configuration
 */
export function generateQualitySpecs(config: GenerationConfig): string {
    const specs = [];
    
    // Token efficiency: use descriptive terms rather than long sentences
    switch (config.qualityLevel) {
        case 'high_res':
            specs.push('ultra-high resolution, professional quality, suitable for large format printing');
            break;
        case 'print':
            specs.push('high resolution, print-ready quality, crisp details');
            break;
        case 'web':
            specs.push('web-optimized resolution, balanced quality and file size');
            break;
    }
    
    if (config.outputFormat === 'png') {
        specs.push('PNG format, preserve transparency');
    } else {
        specs.push('JPEG format, file size optimized');
    }
    
    return specs.join(', ');
}

/**
 * Enhanced prompt generation combining both applications' strengths
 */
export function generatePrompt(
    characters: EnhancedCharacter[], 
    characterPrompts: Record<string, string>,
    interactionPrompt: string,
    config: GenerationConfig,
    options: PromptGenerationOptions
): string {
    if (characters.length === 0) {
        throw new Error('At least one character must be provided');
    }
    
    const backgroundInstruction = generateBackgroundInstruction(config);
    const qualitySpecs = generateQualitySpecs(config);
    
    if (characters.length === 1) {
        return generateSingleCharacterPrompt(characters[0], characterPrompts[characters[0].id], config, options, backgroundInstruction, qualitySpecs);
    } else {
        return generateMultiCharacterPrompt(characters, characterPrompts, interactionPrompt, config, options, backgroundInstruction, qualitySpecs);
    }
}

/**
 * Generate prompt for single character (enhanced version)
 */
function generateSingleCharacterPrompt(
    character: EnhancedCharacter,
    pose: string,
    config: GenerationConfig,
    options: PromptGenerationOptions,
    backgroundInstruction: string,
    qualitySpecs: string
): string {
    // Token Efficiency: Concatenate the global prefix/suffix only once.
    if (options.useStructuredFormat) {
        return `Generate a single full-body character image.

**CRITICAL INSTRUCTIONS:**
1. The final image must contain ONLY ONE character, which must be consistent with previous images of ${character.character_name}.
2. Do not include multiple versions or poses of the character.
3. Do not generate any text, letters, or numbers in the image.
4. ${qualitySpecs}.

**SCENE DESCRIPTION:**
- ${backgroundInstruction}

**CHARACTER DETAILS:**
- **Appearance:** ${character.appearance || character.base_description}.
- **Pose & Expression:** ${pose}.

**ART STYLE:** ${CLAYMATION_STYLE_PREFIX} ${CLAYMATION_STYLE_SUFFIX}`;
    } else {
        // Fallback to original aistudio-claymation format (now using global constants)
        return `${CLAYMATION_STYLE_PREFIX}, ${character.base_description}, ${pose}${CLAYMATION_STYLE_SUFFIX}`;
    }
}

/**
 * Generate prompt for multiple characters (enhanced version)
 */
function generateMultiCharacterPrompt(
    characters: EnhancedCharacter[],
    characterPrompts: Record<string, string>,
    interactionPrompt: string,
    config: GenerationConfig,
    options: PromptGenerationOptions,
    backgroundInstruction: string,
    qualitySpecs: string
): string {
    const characterDetails = characters.map((char, index) => {
        const pose = characterPrompts[char.id] || 'a neutral pose';
        return `**CHARACTER ${index + 1}: ${char.character_name}** (Must be consistent with prior generations)
- **Appearance:** ${char.appearance || char.base_description}.
- **Pose & Expression:** ${pose}.`;
    }).join('\n');
    
    let heightInstruction = '';
    if (options.includeHeightCalculations) {
        const heightRelationships = calculateHeightRelationships(characters);
        if (heightRelationships) {
            heightInstruction = ` **RELATIVE SCALE INSTRUCTION:** ${heightRelationships}`;
        }
    }
    
    if (options.useStructuredFormat) {
        return `Generate a single image with ${characters.length} characters interacting in a high-quality educational style.

**CRITICAL INSTRUCTIONS:**
1. The final image must contain EXACTLY ${characters.length} characters as described.
2. All characters must be visually consistent, visible, and interacting as described.
3. Do not generate any text, letters, or numbers in the image.
4. ${qualitySpecs}.

**CHARACTERS & POSES:**
${characterDetails}

**SCENE & INTERACTION:**
- **Interaction Description:** ${interactionPrompt || 'The characters are positioned near each other.'}
- **Background:** ${backgroundInstruction}${heightInstruction}

**ART STYLE:** ${CLAYMATION_STYLE_PREFIX} ${CLAYMATION_STYLE_SUFFIX}`;
    } else {
        // Fallback to enhanced aistudio-claymation format (now using global constants)
        const characterDefinitions = characters
            .map(char => `${char.character_name} is ${char.base_description} in the following pose: ${characterPrompts[char.id] || 'a neutral stance'}`)
            .join('. ');
            
        return `${CLAYMATION_STYLE_PREFIX}, ${interactionPrompt}. The scene features: ${characterDefinitions}.${heightInstruction} ${CLAYMATION_STYLE_SUFFIX}`;
    }
}
