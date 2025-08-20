import React from 'react';
import { Character } from '../types';

interface CharacterSelectorProps {
  characters: { [key: string]: Character };
  selectedCharacterKeys: string[];
  onSelect: (characterKey: string) => void;
}

interface CharacterCardProps {
  character: Character;
  characterKey: string;
  isSelected: boolean;
  onSelect: (characterKey: string) => void;
}

const CharacterCard = ({ character, characterKey, isSelected, onSelect }: CharacterCardProps) => {
    const ringClass = isSelected ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-800' : 'ring-1 ring-gray-300 dark:ring-gray-600';
    const bgClass = isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600';
    
    return (
        <div
            onClick={() => onSelect(characterKey)}
            className={`cursor-pointer p-4 rounded-lg transition-all duration-200 ${bgClass} ${ringClass} character-card-educational ${isSelected ? 'selected' : ''}`}
            role="checkbox"
            aria-checked={isSelected}
            tabIndex={0}
            onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && onSelect(characterKey)}
        >
            <h4 className="font-bold text-lg text-gray-800 dark:text-white">{character.character_name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{character.character_short_description}</p>
        </div>
    );
};

const CharacterSelector = ({ characters, selectedCharacterKeys, onSelect }: CharacterSelectorProps): React.ReactNode => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        1. Choose Character(s)
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Object.entries(characters).map(([key, character]) => (
          <CharacterCard 
            key={key}
            character={character}
            characterKey={key}
            isSelected={selectedCharacterKeys.includes(key)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default CharacterSelector;