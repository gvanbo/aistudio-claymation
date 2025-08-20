// Test file for prompt generation logic
// Following test-driven development approach

import { describe, it, expect } from '@jest/globals';
import { mockCharacters, mockGenerationConfig } from './setup';
import { transformCharacterData, validateConfig, generatePrompt, calculateHeightRelationships } from '../utils/promptGenerator';

describe('Prompt Generation Tests', () => {
    
    describe('Character Data Transformation', () => {
        it('should transform aistudio-claymation character to enhanced format', () => {
            const originalCharacter = mockCharacters.alex;
            const result = transformCharacterData('alex', originalCharacter);
            
            // Should preserve all original properties
            expect(result.character_name).toBe(originalCharacter.character_name);
            expect(result.base_description).toBe(originalCharacter.base_description);
            expect(result.poses).toEqual(originalCharacter.poses);
            
            // Should add enhanced properties
            expect(result.id).toBe('alex');
            expect(result.appearance).toBe(originalCharacter.base_description);
            expect(result.placeholderImage).toBe('/models/alex.png');
        });
        
        it('should preserve all original character properties', () => {
            const originalCharacter = mockCharacters.alex;
            const result = transformCharacterData('alex', originalCharacter);
            
            // Ensure we don't lose any existing functionality
            expect(result.poses.waving_happy).toBeDefined();
            expect(result.style_prefix).toBeDefined();
            expect(result.style_suffix).toBeDefined();
        });
    });
    
    describe('Configuration Validation', () => {
        it('should apply default values for missing config options', () => {
            const partialConfig = { outputFormat: 'jpeg' as const };
            const result = validateConfig(partialConfig);
            
            expect(result.outputFormat).toBe('jpeg');
            expect(result.backgroundOption).toBe('transparent'); // default
            expect(result.qualityLevel).toBe('print'); // default
            expect(result.aspectRatio).toBe('1:1'); // default
        });
        
        it('should preserve provided config values', () => {
            const fullConfig = {
                outputFormat: 'png' as const,
                backgroundOption: 'illustrated' as const,
                qualityLevel: 'high_res' as const,
                aspectRatio: '16:9' as const,
                customBackground: 'classroom'
            };
            
            const result = validateConfig(fullConfig);
            expect(result).toEqual(fullConfig);
        });
    });
    
    describe('Height Calculation Logic', () => {
        it('should calculate height relationships correctly', () => {
            const grade1Char = transformCharacterData('alex', mockCharacters.alex);
            const teacherChar = transformCharacterData('teacher', {
                character_name: 'Ms. Test',
                character_short_description: 'female teacher',
                base_description: 'teacher description',
                style_prefix: 'test',
                style_suffix: 'test',
                poses: {}
            });
            
            const result = calculateHeightRelationships([grade1Char, teacherChar]);
            expect(result).toContain('Ms. Test is taller than Alex');
        });
        
        it('should handle characters of same height category', () => {
            const char1 = transformCharacterData('alex', mockCharacters.alex);
            const char2 = transformCharacterData('zoe', {
                character_name: 'Zoe',
                character_short_description: 'grade 1 girl',
                base_description: 'test',
                style_prefix: 'test',
                style_suffix: 'test',
                poses: {}
            });
            
            const result = calculateHeightRelationships([char1, char2]);
            expect(result).toBe(''); // No height differences for same category
        });
    });
    
    describe('Structured Prompt Generation', () => {
        it('should generate structured prompt for single character', () => {
            const character = transformCharacterData('alex', mockCharacters.alex);
            const pose = "jumping with excitement";
            const config = mockGenerationConfig;
            const options = {
                useStructuredFormat: true,
                includeHeightCalculations: false,
                educationalOptimization: true
            };
            
            const prompt = generatePrompt([character], { alex: pose }, '', config, options);
            
            // Should contain structured format elements
            expect(prompt).toContain('**CRITICAL INSTRUCTIONS:**');
            expect(prompt).toContain('**CHARACTER DETAILS:**');
            expect(prompt).toContain('**ART STYLE:**');
            expect(prompt).toContain(pose);
        });
        
        it('should handle background options correctly', () => {
            const character = transformCharacterData('alex', mockCharacters.alex);
            const pose = "waving hello";
            
            // Test transparent background
            const transparentConfig = { ...mockGenerationConfig, backgroundOption: 'transparent' as const };
            const options = { useStructuredFormat: true, includeHeightCalculations: false, educationalOptimization: true };
            
            const transparentPrompt = generatePrompt([character], { alex: pose }, '', transparentConfig, options);
            expect(transparentPrompt).toContain('transparent background');
            
            // Test illustrated background
            const illustratedConfig = { 
                ...mockGenerationConfig, 
                backgroundOption: 'illustrated' as const,
                customBackground: 'classroom setting'
            };
            
            const illustratedPrompt = generatePrompt([character], { alex: pose }, '', illustratedConfig, options);
            expect(illustratedPrompt).toContain('illustrated background');
            expect(illustratedPrompt).toContain('classroom setting');
        });
    });
    
    describe('Multi-Character Scene Generation', () => {
        it('should generate prompts with height calculations', () => {
            const grade1Char = transformCharacterData('alex', mockCharacters.alex);
            const teacherChar = transformCharacterData('teacher', {
                character_name: 'Ms. Rodriguez',
                character_short_description: 'female teacher',
                base_description: 'teacher description',
                style_prefix: 'test',
                style_suffix: 'test',
                poses: {}
            });
            
            const characterPrompts = {
                alex: 'waving',
                teacher: 'encouraging'
            };
            
            const config = mockGenerationConfig;
            const options = {
                useStructuredFormat: true,
                includeHeightCalculations: true,
                educationalOptimization: true
            };
            
            const prompt = generatePrompt([grade1Char, teacherChar], characterPrompts, 'teaching scene', config, options);
            
            expect(prompt).toContain('Ms. Rodriguez is taller than Alex');
            expect(prompt).toContain('teaching scene');
            expect(prompt).toContain('EXACTLY 2 characters');
        });
    });
});
