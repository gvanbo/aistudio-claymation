// Enhanced types that combine both applications' best features

export interface Pose {
    [key: string]: string;
}

export type HeightCategory = 'short_child' | 'medium_child' | 'teenager' | 'adult';
export type OutputFormat = 'png' | 'jpeg';
export type BackgroundOption = 'transparent' | 'illustrated' | 'solid_white';
export type QualityLevel = 'web' | 'print' | 'high_res';
export type AspectRatio = '1:1' | '16:9' | '4:3';


// Original aistudio-claymation character structure (modified for efficiency)
export interface Character {
    character_name: string;
    character_short_description: string;
    base_description: string;
    // Removed style_prefix and style_suffix from the object for token efficiency. 
    // They are now global constants (see characters.ts).
    poses: Pose;
    // New explicit height category for consistent scaling
    height_category: HeightCategory;
}

// Enhanced character interface that adds cartoon-character-generator features
export interface EnhancedCharacter extends Character {
    id: string; // From cartoon-character-generator
    appearance: string; // Simplified description for prompts
    placeholderImage?: string; // Optional for future UI enhancements
}

export interface CharacterData {
    characters: {
        [key: string]: Character;
    };
}

// New configuration types for enhanced functionality
export interface GenerationConfig {
    outputFormat: OutputFormat;
    backgroundOption: BackgroundOption;
    qualityLevel: QualityLevel;
    aspectRatio: AspectRatio;
    customBackground?: string; // For illustrated backgrounds
}

export interface PromptGenerationOptions {
    useStructuredFormat: boolean; // Use cartoon-character-generator's markdown style
    includeHeightCalculations: boolean; // Use aistudio-claymation's height logic
    educationalOptimization: boolean; // Optimize for educational use
}

// Quality presets for different use cases
export interface QualityPreset {
    name: string;
    description: string;
    config: GenerationConfig;
    promptOptions: PromptGenerationOptions;
}

export const QUALITY_PRESETS: QualityPreset[] = [
    {
        name: 'Educational Print',
        description: 'High-resolution PNG for printing in educational materials',
        config: {
            outputFormat: 'png',
            backgroundOption: 'transparent',
            qualityLevel: 'high_res',
            aspectRatio: '1:1'
        },
        promptOptions: {
            useStructuredFormat: true,
            includeHeightCalculations: true,
            educationalOptimization: true
        }
    },
    {
        name: 'Online Learning',
        description: 'Optimized for web display and fast loading',
        config: {
            outputFormat: 'jpeg',
            backgroundOption: 'solid_white',
            qualityLevel: 'web',
            aspectRatio: '1:1'
        },
        promptOptions: {
            useStructuredFormat: true,
            includeHeightCalculations: false,
            educationalOptimization: true
        }
    },
    {
        name: 'Interactive Scenes',
        description: 'Transparent backgrounds for overlay in interactive content',
        config: {
            outputFormat: 'png',
            backgroundOption: 'transparent',
            qualityLevel: 'print',
            aspectRatio: '1:1'
        },
        promptOptions: {
            useStructuredFormat: true,
            includeHeightCalculations: true,
            educationalOptimization: true
        }
    }
];
