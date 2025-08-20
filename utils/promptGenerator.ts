// Enhanced prompt generation utilities combining best practices from both applications

import { Character, EnhancedCharacter, GenerationConfig, PromptGenerationOptions } from '../types.enhanced';

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
 * Generate height relationships for multi-character scenes (from aistudio-claymation)
 */
export function calculateHeightRelationships(characters: EnhancedCharacter[]): string {
    type HeightCategory = 'short' | 'medium' | 'tall';
    
    const getHeightCategory = (char: EnhancedCharacter): HeightCategory => {
        if (char.character_short_description.includes('grade 1')) return 'short';
        if (char.character_short_description.includes('grade 6')) return 'medium';
        if (char.character_short_description.includes('teacher')) return 'tall';
        return 'medium'; // Fallback
    };

    const characterHeights = characters.map(char => ({
        name: char.character_name,
        category: getHeightCategory(char)
    }));
    
    const heightOrder: HeightCategory[] = ['short', 'medium', 'tall'];
    characterHeights.sort((a, b) => heightOrder.indexOf(a.category) - heightOrder.indexOf(b.category));
    
    let heightDescriptions = '';
    for (let i = 1; i < characterHeights.length; i++) {
        const shorterChar = characterHeights[i-1];
        const tallerChar = characterHeights[i];
        if (shorterChar.category !== tallerChar.category) {
            heightDescriptions += `${tallerChar.name} is taller than ${shorterChar.name}. `;
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
            return 'The image must have a transparent background.';
        case 'illustrated':
            return `The character is in a scene with a full illustrated background. The background is described as: "${config.customBackground || "a simple, aesthetically pleasing background that complements the character's pose"}". The art style should apply to the character and the background.`;
        case 'solid_white':
            return 'The image has a solid white background, perfect for educational materials and print use.';
        default:
            return 'The image must have a transparent background.';
    }
}

/**
 * Generate quality specifications based on configuration
 */
export function generateQualitySpecs(config: GenerationConfig): string {
    const specs = [];
    
    switch (config.qualityLevel) {
        case 'high_res':
            specs.push('ultra-high resolution');
            specs.push('professional quality');
            specs.push('suitable for large format printing');
            break;
        case 'print':
            specs.push('high resolution');
            specs.push('print-ready quality');
            specs.push('crisp details');
            break;
        case 'web':
            specs.push('web-optimized resolution');
            specs.push('balanced quality and file size');
            break;
    }
    
    if (config.outputFormat === 'png') {
        specs.push('PNG format with transparency support');
    } else {
        specs.push('JPEG format optimized for file size');
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
    if (options.useStructuredFormat) {
        // Use cartoon-character-generator's structured format
        return `Generate a single full-body character image.

**CRITICAL INSTRUCTIONS:**
1. The final image must contain ONLY ONE character.
2. Do not include multiple versions or poses of the character.
3. Do not generate any text, letters, or numbers in the image.
4. ${qualitySpecs}.

**SCENE DESCRIPTION:**
- ${backgroundInstruction}

**CHARACTER DETAILS:**
- **Appearance:** ${character.appearance || character.base_description}.
- **Pose & Expression:** ${pose}.

**ART STYLE:** ${character.style_prefix} ${character.style_suffix}`;
    } else {
        // Use original aistudio-claymation format
        return `${character.style_prefix}, ${character.base_description}, ${pose}${character.style_suffix}`;
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
        return `**CHARACTER ${index + 1}: ${char.character_name}**
- **Appearance:** ${char.appearance || char.base_description}.
- **Pose & Expression:** ${pose}.`;
    }).join('\n');
    
    let heightInstruction = '';
    if (options.includeHeightCalculations) {
        const heightRelationships = calculateHeightRelationships(characters);
        if (heightRelationships) {
            heightInstruction = ` For realistic scale, remember that ${heightRelationships}`;
        }
    }
    
    if (options.useStructuredFormat) {
        return `Generate a single image with ${characters.length} characters interacting.

**CRITICAL INSTRUCTIONS:**
1. The final image must contain EXACTLY ${characters.length} characters as described.
2. All characters must be visible and interacting as described.
3. The art style must be consistent for all characters.
4. Do not generate any text, letters, or numbers in the image.
5. ${qualitySpecs}.

**CHARACTERS & POSES:**
${characterDetails}

**SCENE & INTERACTION:**
- **Interaction Description:** ${interactionPrompt || 'The characters are positioned near each other.'}
- **Background:** ${backgroundInstruction}${heightInstruction}
- **Overall Art Style:** ${characters[0].style_prefix} ${characters[0].style_suffix}`;
    } else {
        // Fallback to enhanced aistudio-claymation format
        const characterDefinitions = characters
            .map(char => `${char.character_name} is ${char.base_description}`)
            .join('. ');
            
        return `${characters[0].style_prefix}, ${interactionPrompt}. The scene features: ${characterDefinitions}.${heightInstruction} ${characters[0].style_suffix}`;
    }
}
