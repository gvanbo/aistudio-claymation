
import React, { useState, useMemo } from 'react';
import { Character } from './types';
import { CHARACTERS_DATA } from './constants/characters';
import { generateImage as generateImageFromApi } from './services/geminiService';
import Header from './components/Header';
import CharacterSelector from './components/CharacterSelector';
import ImageDisplay from './components/ImageDisplay';
import Button from './components/Button';
import CustomPromptInput from './components/CustomPromptInput';
import PoseReferenceLibrary from './components/PoseReferenceLibrary';

export default function App(): React.ReactNode {
  const [selectedCharacterKeys, setSelectedCharacterKeys] = useState<string[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('');

  const characters = CHARACTERS_DATA.characters;
  
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
    setCustomPrompt(''); // Reset prompt on any character selection change for simplicity
  };
  
  const handleGenerateImage = async (): Promise<void> => {
    if (selectedCharacterKeys.length === 0) {
      setError("Please select at least one character first.");
      return;
    }
    
    if (!customPrompt.trim()) {
       setError(selectedCharacterKeys.length > 1 
        ? "Please describe the scene in the text box." 
        : "Please describe a pose in the text box."
      );
      return;
    }
    
    setIsLoading(true);
    setGeneratedImage(null);
    setError(null);
    
    try {
      const firstCharacter = selectedCharacters[0];
      let prompt: string;

      if (selectedCharacters.length > 1) {
          const characterDefinitions = selectedCharacters
              .map(char => `${char.character_name} is ${char.base_description}`)
              .join('. ');
          
          type HeightCategory = 'short' | 'medium' | 'tall';
          const getHeightCategory = (char: Character): HeightCategory => {
              if (char.character_short_description.includes('grade 1')) return 'short';
              if (char.character_short_description.includes('grade 6')) return 'medium';
              if (char.character_short_description.includes('teacher')) return 'tall';
              return 'medium'; // Fallback
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
          // Keep original, well-tuned prompt for single characters
          prompt = `${firstCharacter.style_prefix}, ${firstCharacter.base_description}, ${customPrompt}${firstCharacter.style_suffix}`;
      }

      const imageB64 = await generateImageFromApi(prompt);
      setGeneratedImage(imageB64);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during image generation.");
    } finally {
      setIsLoading(false);
    }
  };

  const isGenerationDisabled = selectedCharacterKeys.length === 0 || !customPrompt.trim() || isLoading;
  const isMultiSelect = selectedCharacterKeys.length > 1;
  const singleSelectedCharacter = selectedCharacterKeys.length === 1 ? selectedCharacters[0] : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col space-y-6 h-full border border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Create Your Character Scene</h2>
              <p className="text-gray-500 dark:text-gray-400">Select characters and describe a pose or a scene to bring them to life.</p>
            </div>
            <CharacterSelector
              characters={characters}
              selectedCharacterKeys={selectedCharacterKeys}
              onSelect={handleCharacterSelect}
            />

            {selectedCharacterKeys.length > 0 && (
              <div className="space-y-6">
                <CustomPromptInput 
                    prompt={customPrompt}
                    onPromptChange={setCustomPrompt}
                    disabled={isLoading}
                    label={isMultiSelect ? '2. Describe the Scene' : '2. Describe the Pose'}
                    placeholder={isMultiSelect ? 'e.g., Marcus and Priya studying together at a library desk with books.' : 'e.g., jumping in the air with excitement'}
                    description={isMultiSelect ? "Describe how the characters interact with each other and their environment." : "This will be combined with the character's base description to create the final image prompt."}
                />
                {singleSelectedCharacter && (
                    <PoseReferenceLibrary 
                        character={singleSelectedCharacter}
                        onPoseSelect={setCustomPrompt}
                    />
                )}
              </div>
            )}
            
            <div className="mt-auto pt-4">
              <Button onClick={handleGenerateImage} disabled={isGenerationDisabled}>
                {isLoading ? 'Generating...' : 'Generate Image'}
              </Button>
            </div>
          </div>

          {/* Image Display Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex items-center justify-center min-h-[400px] lg:min-h-full border border-gray-200 dark:border-gray-700">
            <ImageDisplay 
              image={generatedImage}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
