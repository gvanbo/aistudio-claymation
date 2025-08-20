import React from 'react';
import { Character } from '../types';

interface PoseReferenceLibraryProps {
  character: Character;
  onPoseSelect: (poseDescription: string) => void;
}

const formatPoseName = (key: string): string => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const PoseReferenceLibrary = ({ character, onPoseSelect }: PoseReferenceLibraryProps): React.ReactNode => {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Pose Reference Library (click to use an example)
      </h3>
      <div className="flex flex-wrap gap-2">
        {Object.entries(character.poses).map(([key, description]) => (
          <button
            key={key}
            onClick={() => onPoseSelect(description)}
            className="px-3 py-1.5 text-xs font-medium text-primary-800 bg-primary-100 dark:bg-primary-900/40 dark:text-primary-300 rounded-full hover:bg-primary-200 dark:hover:bg-primary-900/60 transition-colors duration-150 ease-in-out"
            title={`Use pose: ${formatPoseName(key)}`}
          >
            {formatPoseName(key)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PoseReferenceLibrary;