// Test file for prompt generation logic
// Following test-driven development approach

import { describe, it, expect } from '@jest/globals';
import { mockCharacters, mockGenerationConfig } from './setup';
import { transformCharacterData, validateConfig, generatePrompt, calculateHeightRelationships } from '../utils/promptGenerator';

describe('Prompt Generation Tests', () => {
    
    describe('Character Data Transformation', () => {
        it('should transform aistudio-claymation character to enhanced format', () => {
            // Remove deprecated style fields and include required height category
            const { style_prefix: _sp1, style_suffix: _ss1, ...baseAlex } = mockCharacters.alex as any;
            const originalCharacter = { ...baseAlex, height_category: 'short_child' as const };
            const result = transformCharacterData('alex', originalCharacter as any);
            
            // Should preserve all original properties
            expect(result.character_name).toBe(originalCharacter.character_name);
            expect(result.base_description).toBe(originalCharacter.base_description);
            expect(result.poses).toEqual(originalCharacter.poses);
            
            // Should add enhanced properties
            expect(result.id).toBe('alex');
            expect(result.appearance).toBe(originalCharacter.base_description);
            expect(result.placeholderImage).toBe('/models/alex.png');
            expect(result.height_category).toBe('short_child');
        });
        
        it('should preserve all original character properties', () => {
            const { style_prefix: _sp2, style_suffix: _ss2, ...baseAlex } = mockCharacters.alex as any;
            const originalCharacter = { ...baseAlex, height_category: 'short_child' as const };
            const result = transformCharacterData('alex', originalCharacter as any);
            
            // Ensure we don't lose any existing functionality
            expect(result.poses.waving_happy).toBeDefined();
            expect(result.height_category).toBe('short_child');
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
            const { style_prefix: _sp3, style_suffix: _ss3, ...baseAlex } = mockCharacters.alex as any;
            const grade1Char = transformCharacterData('alex', { ...baseAlex, height_category: 'short_child' as const } as any);
            const teacherChar = transformCharacterData('teacher', {
                character_name: 'Ms. Test',
                character_short_description: 'female teacher',
                base_description: 'teacher description',
                poses: {},
                height_category: 'adult' as const
            } as any);
            
            const result = calculateHeightRelationships([grade1Char, teacherChar]);
            // New logic uses explicit height categories and a more instructive message
            expect(result).toContain('Ms. Test');
            expect(result).toContain('significantly taller than Alex');
        });
        
        it('should handle characters of same height category', () => {
            const { style_prefix: _sp4, style_suffix: _ss4, ...baseAlex } = mockCharacters.alex as any;
            const char1 = transformCharacterData('alex', { ...baseAlex, height_category: 'short_child' as const } as any);
            const char2 = transformCharacterData('zoe', {
                character_name: 'Zoe',
                character_short_description: 'grade 1 girl',
                base_description: 'test',
                poses: {},
                height_category: 'short_child' as const
            } as any);
            
            const result = calculateHeightRelationships([char1, char2]);
            expect(result).toBe(''); // No height differences for same category
        });
    });
    
    describe('Structured Prompt Generation', () => {
        it('should generate structured prompt for single character', () => {
            const { style_prefix: _sp5, style_suffix: _ss5, ...baseAlex } = mockCharacters.alex as any;
            const character = transformCharacterData('alex', { ...baseAlex, height_category: 'short_child' as const } as any);
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
            const { style_prefix: _sp6, style_suffix: _ss6, ...baseAlex } = mockCharacters.alex as any;
            const character = transformCharacterData('alex', { ...baseAlex, height_category: 'short_child' as const } as any);
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
            const { style_prefix: _sp7, style_suffix: _ss7, ...baseAlex } = mockCharacters.alex as any;
            const grade1Char = transformCharacterData('alex', { ...baseAlex, height_category: 'short_child' as const } as any);
            const teacherChar = transformCharacterData('teacher', {
                character_name: 'Ms. Rodriguez',
                character_short_description: 'female teacher',
                base_description: 'teacher description',
                poses: {},
                height_category: 'adult' as const
            } as any);
            
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
            
            // New height instruction phrasing
            expect(prompt).toContain('Ms. Rodriguez');
            expect(prompt).toContain('significantly taller than Alex');
            expect(prompt).toContain('teaching scene');
            expect(prompt).toContain('EXACTLY 2 characters');
        });
    });
});
