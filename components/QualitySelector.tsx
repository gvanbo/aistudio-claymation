import React from 'react';
import { QualityPreset } from '../types.enhanced';

interface QualitySelectorProps {
  selectedPreset: string;
  onPresetChange: (presetName: string) => void;
  presets: QualityPreset[];
}

const QualitySelector = ({ selectedPreset, onPresetChange, presets }: QualitySelectorProps): React.ReactNode => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Quality Preset
      </label>
      <div className="grid grid-cols-1 gap-2">
        {presets.map((preset) => (
          <label key={preset.name} className="flex items-start cursor-pointer">
            <input
              type="radio"
              name="qualityPreset"
              value={preset.name}
              checked={selectedPreset === preset.name}
              onChange={(e) => onPresetChange(e.target.value)}
              className="mr-3 mt-1 text-primary-600 focus:ring-primary-500"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {preset.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {preset.description}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {preset.config.outputFormat.toUpperCase()} • {preset.config.backgroundOption} • {preset.config.qualityLevel}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QualitySelector;
