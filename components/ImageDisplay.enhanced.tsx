import React, { useState } from 'react';
import Spinner from './Spinner';
import DownloadModal from './DownloadModal';
import Button from './Button';
import { GenerationConfig } from '../types.enhanced';

interface ImageDisplayProps {
  image: string | null;
  isLoading: boolean;
  error: string | null;
  config?: GenerationConfig;
}

const Placeholder = () => (
    <div className="text-center text-gray-400 dark:text-gray-500">
         <svg className="mx-auto h-20 w-20 text-gray-300 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        <p className="mt-2 text-lg font-semibold">Your educational character image will appear here.</p>
        <p className="text-sm">Select characters, choose quality settings, and generate.</p>
    </div>
);

const ConfigurationDisplay = ({ config }: { config: GenerationConfig }) => (
  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Generation Settings</h4>
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div>
        <span className="text-gray-500 dark:text-gray-400">Format:</span>
        <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">{config.outputFormat.toUpperCase()}</span>
      </div>
      <div>
        <span className="text-gray-500 dark:text-gray-400">Quality:</span>
        <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">{config.qualityLevel}</span>
      </div>
      <div>
        <span className="text-gray-500 dark:text-gray-400">Background:</span>
        <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">{config.backgroundOption}</span>
      </div>
      <div>
        <span className="text-gray-500 dark:text-gray-400">Aspect:</span>
        <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">{config.aspectRatio}</span>
      </div>
    </div>
    {config.customBackground && (
      <div className="mt-2">
        <span className="text-gray-500 dark:text-gray-400 text-xs">Custom Background:</span>
        <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">{config.customBackground}</p>
      </div>
    )}
  </div>
);

const ImageDisplay = ({ image, isLoading, error, config }: ImageDisplayProps): React.ReactNode => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="text-center">
        <Spinner />
        {config && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Generating {config.outputFormat.toUpperCase()} • {config.qualityLevel} quality
            </p>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <h3 className="font-bold">Generation Failed</h3>
        <p className="text-sm">{error}</p>
        {config && <ConfigurationDisplay config={config} />}
      </div>
    );
  }

  if (image) {
    const mimeType = config?.outputFormat === 'png' ? 'image/png' : 'image/jpeg';
    
    return (
      <div className="text-center space-y-4">
        <img
          src={`data:${mimeType};base64,${image}`}
          alt="Generated educational character"
          className="max-w-full max-h-[512px] object-contain rounded-lg shadow-lg mx-auto"
        />
        
        <div className="flex flex-col space-y-2">
          <Button
            onClick={() => setIsDownloadModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-medium w-auto mx-auto"
          >
            📥 Download Educational Image
          </Button>
          
          {/* Usage Guidelines */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {config?.outputFormat === 'png' && config?.backgroundOption === 'transparent' && (
              <p>✨ Transparent PNG - Perfect for overlaying in presentations and documents</p>
            )}
            {config?.qualityLevel === 'high_res' && (
              <p>🖨️ High resolution - Suitable for printing and large displays</p>
            )}
            {config?.outputFormat === 'jpeg' && config?.qualityLevel === 'web' && (
              <p>🌐 Web optimized - Fast loading for online educational platforms</p>
            )}
          </div>
        </div>

        {config && <ConfigurationDisplay config={config} />}
        
        <DownloadModal
          isOpen={isDownloadModalOpen}
          onClose={() => setIsDownloadModalOpen(false)}
          imageData={image}
        />
      </div>
    );
  }

  return <Placeholder />;
};

export default ImageDisplay;
