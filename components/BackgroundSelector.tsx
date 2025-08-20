import React from 'react';
import { BackgroundOption } from '../types.enhanced';

interface BackgroundSelectorProps {
  backgroundOption: BackgroundOption;
  customBackground: string;
  onBackgroundChange: (option: BackgroundOption) => void;
  onCustomBackgroundChange: (background: string) => void;
}

const BackgroundSelector = ({ 
  backgroundOption, 
  customBackground, 
  onBackgroundChange, 
  onCustomBackgroundChange 
}: BackgroundSelectorProps): React.ReactNode => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Background Style
      </label>
      
      <div className="space-y-3">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="background"
            value="transparent"
            checked={backgroundOption === 'transparent'}
            onChange={(e) => onBackgroundChange(e.target.value as BackgroundOption)}
            className="mr-2 text-primary-600 focus:ring-primary-500"
          />
          <div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Transparent</span>
            <p className="text-xs text-gray-500 dark:text-gray-400">Perfect for overlays and flexible use in educational materials</p>
          </div>
        </label>
        
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="background"
            value="solid_white"
            checked={backgroundOption === 'solid_white'}
            onChange={(e) => onBackgroundChange(e.target.value as BackgroundOption)}
            className="mr-2 text-primary-600 focus:ring-primary-500"
          />
          <div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Solid White</span>
            <p className="text-xs text-gray-500 dark:text-gray-400">Clean background ideal for print materials and presentations</p>
          </div>
        </label>
        
        <label className="flex items-start cursor-pointer">
          <input
            type="radio"
            name="background"
            value="illustrated"
            checked={backgroundOption === 'illustrated'}
            onChange={(e) => onBackgroundChange(e.target.value as BackgroundOption)}
            className="mr-2 mt-1 text-primary-600 focus:ring-primary-500"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-gray-900 dark:text-white">Illustrated Scene</span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Custom background scene</p>
            {backgroundOption === 'illustrated' && (
              <textarea
                value={customBackground}
                onChange={(e) => onCustomBackgroundChange(e.target.value)}
                placeholder="Describe the background scene (e.g., 'sunny classroom', 'playground', 'library')"
                className="w-full p-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 focus:border-primary-500"
                rows={2}
              />
            )}
          </div>
        </label>
      </div>
    </div>
  );
};

export default BackgroundSelector;
