// Enhanced App component combining best practices from both applications
// Maintains backward compatibility while adding new features

import React, { useState, useMemo } from 'react';
import { Character, EnhancedCharacter, GenerationConfig, PromptGenerationOptions, QUALITY_PRESETS } from './types.enhanced';
import { CHARACTERS_DATA } from './constants/characters';
import { generateImage } from './services/geminiService.enhanced';
import { transformCharacterData, generatePrompt } from './utils/promptGenerator';
import Header from './components/Header';
import CharacterSelector from './components/CharacterSelector';
import ImageDisplay from './components/ImageDisplay.enhanced';
import Button from './components/Button';
import CustomPromptInput from './components/CustomPromptInput';
import PoseReferenceLibrary from './components/PoseReferenceLibrary';

// New components for enhanced functionality
import QualitySelector from './components/QualitySelector';
import BackgroundSelector from './components/BackgroundSelector';

export default function App(): React.ReactNode {
  // Preserve original state structure for backward compatibility
  const [selectedCharacterKeys, setSelectedCharacterKeys] = useState<string[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('');

  // Enhanced state for new features
  const [selectedQualityPreset, setSelectedQualityPreset] = useState<string>('Educational Print');
  const [generationConfig, setGenerationConfig] = useState<GenerationConfig>({
    outputFormat: 'png',
    backgroundOption: 'transparent',
    qualityLevel: 'print',
    aspectRatio: '1:1'
  });
  const [promptOptions, setPromptOptions] = useState<PromptGenerationOptions>({
    useStructuredFormat: true,
    includeHeightCalculations: true,
    educationalOptimization: true
  });
  const [characterPrompts, setCharacterPrompts] = useState<Record<string, string>>({});
  const [interactionPrompt, setInteractionPrompt] = useState<string>('');
  const [customBackground, setCustomBackground] = useState<string>('');

  const characters = CHARACTERS_DATA.characters;
  
  // Transform characters to enhanced format
  const enhancedCharacters = useMemo<EnhancedCharacter[]>(() => {
    return selectedCharacterKeys.map(key => transformCharacterData(key, characters[key]));
  }, [selectedCharacterKeys, characters]);

  // Original character selection logic (preserved)
  const selectedCharacters = useMemo<Character[]>(() => {
    return selectedCharacterKeys.map(key => characters[key]);
  }, [selectedCharacterKeys, characters]);

  const handleCharacterSelect = (characterKey: string): void => {
    setSelectedCharacterKeys(prevKeys => {
      const newKeys = prevKeys.includes(characterKey)
        ? prevKeys.filter(k => k !== characterKey)
        : [...prevKeys, characterKey];
      return newKeys.sort();
    });
    setGeneratedImage(null);
    setError(null);
    
    // Enhanced: Don't reset prompts automatically to preserve user input
    if (!selectedCharacterKeys.includes(characterKey)) {
      // Only reset if deselecting a character
      setCharacterPrompts(prev => {
        const newPrompts = { ...prev };
        delete newPrompts[characterKey];
        return newPrompts;
      });
    }
  };

  const handleQualityPresetChange = (presetName: string): void => {
    const preset = QUALITY_PRESETS.find(p => p.name === presetName);
    if (preset) {
      setSelectedQualityPreset(presetName);
      setGenerationConfig(preset.config);
      setPromptOptions(preset.promptOptions);
    }
  };

  const handleCharacterPromptChange = (characterKey: string, prompt: string): void => {
    setCharacterPrompts(prev => ({ ...prev, [characterKey]: prompt }));
  };

  const isGenerationDisabled = useMemo(() => {
    if (selectedCharacterKeys.length === 0 || isLoading) return true;
    
    // Enhanced validation: check if using individual character prompts or global prompt
    if (promptOptions.useStructuredFormat && selectedCharacterKeys.length > 1) {
      // For structured format with multiple characters, require individual prompts
      return !selectedCharacterKeys.every(key => characterPrompts[key]?.trim());
    } else {
      // For single character or legacy format, use global prompt
      return !customPrompt.trim() && !Object.values(characterPrompts).some(p => p?.trim());
    }
  }, [selectedCharacterKeys, isLoading, customPrompt, characterPrompts, promptOptions.useStructuredFormat]);
  
  const handleGenerateImage = async (): Promise<void> => {
    if (selectedCharacterKeys.length === 0) {
      setError("Please select at least one character first.");
      return;
    }
    
    setIsLoading(true);
    setGeneratedImage(null);
    setError(null);
    
    try {
      let prompt: string;
      const configWithBackground = {
        ...generationConfig,
        customBackground: customBackground || undefined
      };

      if (promptOptions.useStructuredFormat) {
        // Use enhanced structured prompt generation
        const finalCharacterPrompts = selectedCharacterKeys.reduce((acc, key) => {
          acc[key] = characterPrompts[key] || customPrompt;
          return acc;
        }, {} as Record<string, string>);

        prompt = generatePrompt(
          enhancedCharacters,
          finalCharacterPrompts,
          interactionPrompt,
          configWithBackground,
          promptOptions
        );
      } else {
        // Fallback to original aistudio-claymation logic for backward compatibility
        const firstCharacter = selectedCharacters[0];
        
        if (selectedCharacters.length > 1) {
          const characterDefinitions = selectedCharacters
            .map(char => `${char.character_name} is ${char.base_description}`)
            .join('. ');
          
          // Preserve height calculation logic
          type HeightCategory = 'short' | 'medium' | 'tall';
          const getHeightCategory = (char: Character): HeightCategory => {
            if (char.character_short_description.includes('grade 1')) return 'short';
            if (char.character_short_description.includes('grade 6')) return 'medium';
            if (char.character_short_description.includes('teacher')) return 'tall';
            return 'medium';
          };

          const characterHeights = selectedCharacters.map(char => ({
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

          let fullPrompt = `${firstCharacter.style_prefix}, ${customPrompt}. The scene features: ${characterDefinitions}.`;
          if (heightDescriptions) {
            fullPrompt += ` For realistic scale, remember that ${heightDescriptions.trim()}`;
          }
          fullPrompt += ` ${firstCharacter.style_suffix}`;
          prompt = fullPrompt;
        } else {
          prompt = `${firstCharacter.style_prefix}, ${firstCharacter.base_description}, ${customPrompt}${firstCharacter.style_suffix}`;
        }
      }

      const imageB64 = await generateImage(prompt, configWithBackground);
      setGeneratedImage(imageB64);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during image generation.");
    } finally {
      setIsLoading(false);
    }
  };

  const isMultiSelect = selectedCharacterKeys.length > 1;
  const singleSelectedCharacter = selectedCharacterKeys.length === 1 ? selectedCharacters[0] : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Controls Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col space-y-6 h-full border border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Create Educational Character Images</h2>
              <p className="text-gray-500 dark:text-gray-400">Generate high-quality characters optimized for educational resources.</p>
            </div>

            {/* Quality Preset Selector - New Feature */}
            <QualitySelector
              selectedPreset={selectedQualityPreset}
              onPresetChange={handleQualityPresetChange}
              presets={QUALITY_PRESETS}
            />

            {/* Character Selection - Enhanced */}
            <CharacterSelector
              characters={characters}
              selectedCharacterKeys={selectedCharacterKeys}
              onSelect={handleCharacterSelect}
            />

            {selectedCharacterKeys.length > 0 && (
              <div className="space-y-6">
                {/* Background Options - New Feature */}
                <BackgroundSelector
                  backgroundOption={generationConfig.backgroundOption}
                  customBackground={customBackground}
                  onBackgroundChange={(option) => setGenerationConfig(prev => ({ ...prev, backgroundOption: option }))}
                  onCustomBackgroundChange={setCustomBackground}
                />

                {/* Enhanced Prompt Input */}
                {promptOptions.useStructuredFormat && isMultiSelect ? (
                  // Individual character prompts (from cartoon-character-generator)
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Individual Character Poses</h3>
                    {selectedCharacterKeys.map(key => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {characters[key].character_name}
                        </label>
                        <CustomPromptInput
                          prompt={characterPrompts[key] || ''}
                          onPromptChange={(value) => handleCharacterPromptChange(key, value)}
                          disabled={isLoading}
                          label=""
                          placeholder={`Describe ${characters[key].character_name}'s pose...`}
                          description=""
                        />
                      </div>
                    ))}
                    {isMultiSelect && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Scene Interaction
                        </label>
                        <CustomPromptInput
                          prompt={interactionPrompt}
                          onPromptChange={setInteractionPrompt}
                          disabled={isLoading}
                          label=""
                          placeholder="Describe how the characters interact..."
                          description="How do the characters relate to each other in the scene?"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  // Global prompt input (original aistudio-claymation style)
                  <CustomPromptInput 
                    prompt={customPrompt}
                    onPromptChange={setCustomPrompt}
                    disabled={isLoading}
                    label={isMultiSelect ? 'Describe the Scene' : 'Describe the Pose'}
                    placeholder={isMultiSelect ? 'e.g., Marcus and Priya studying together at a library desk with books.' : 'e.g., jumping in the air with excitement'}
                    description={isMultiSelect ? "Describe how the characters interact with each other and their environment." : "This will be combined with the character's base description to create the final image prompt."}
                  />
                )}

                {/* Pose Reference Library - Preserved */}
                {singleSelectedCharacter && (
                  <PoseReferenceLibrary 
                    character={singleSelectedCharacter}
                    onPoseSelect={(pose) => {
                      if (promptOptions.useStructuredFormat) {
                        handleCharacterPromptChange(selectedCharacterKeys[0], pose);
                      } else {
                        setCustomPrompt(pose);
                      }
                    }}
                  />
                )}
              </div>
            )}
            
            <div className="mt-auto pt-4">
              <Button onClick={handleGenerateImage} disabled={isGenerationDisabled}>
                {isLoading ? 'Generating...' : 'Generate Educational Image'}
              </Button>
            </div>
          </div>

          {/* Enhanced Image Display Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex items-center justify-center min-h-[400px] lg:min-h-full border border-gray-200 dark:border-gray-700">
            <ImageDisplay 
              image={generatedImage}
              isLoading={isLoading}
              error={error}
              config={generationConfig}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

