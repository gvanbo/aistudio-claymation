import React, { useState } from 'react';
import Button from './Button';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageData: string;
}

type ImageFormat = 'png' | 'jpg';
type QualityLevel = 'low' | 'medium' | 'high' | 'original';

interface QualityOption {
  level: QualityLevel;
  label: string;
  description: string;
  quality?: number;
  maxWidth?: number;
}

const QUALITY_OPTIONS: QualityOption[] = [
  {
    level: 'low',
    label: 'Low Quality (Social Media)',
    description: '800px width, 70% compression - Perfect for social sharing',
    quality: 0.7,
    maxWidth: 800
  },
  {
    level: 'medium',
    label: 'Medium Quality (Web)',
    description: '1200px width, 85% compression - Good for web use',
    quality: 0.85,
    maxWidth: 1200
  },
  {
    level: 'high',
    label: 'High Quality (Print)',
    description: '1920px width, 95% compression - Suitable for printing',
    quality: 0.95,
    maxWidth: 1920
  },
  {
    level: 'original',
    label: 'Original Quality',
    description: 'Full resolution, no compression - Largest file size',
  }
];

const DownloadModal = ({ isOpen, onClose, imageData }: DownloadModalProps): React.ReactNode => {
  const [selectedQuality, setSelectedQuality] = useState<QualityLevel>('medium');
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>('png');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Create canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      // Create image element from base64 data
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = `data:image/jpeg;base64,${imageData}`;
      });

      const qualityOption = QUALITY_OPTIONS.find(opt => opt.level === selectedQuality);
      
      // Calculate dimensions
      let { width, height } = img;
      if (qualityOption?.maxWidth && width > qualityOption.maxWidth) {
        const aspectRatio = height / width;
        width = qualityOption.maxWidth;
        height = width * aspectRatio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      const quality = selectedFormat === 'jpg' ? (qualityOption?.quality || 1) : undefined;
      const mimeType = selectedFormat === 'png' ? 'image/png' : 'image/jpeg';
      
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Failed to create image blob');
        }

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `claymation-character-${Date.now()}.${selectedFormat}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setIsDownloading(false);
        onClose();
      }, mimeType, quality);

    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Download Image</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                File Format
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="format"
                    value="png"
                    checked={selectedFormat === 'png'}
                    onChange={(e) => setSelectedFormat(e.target.value as ImageFormat)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">PNG (Lossless)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="format"
                    value="jpg"
                    checked={selectedFormat === 'jpg'}
                    onChange={(e) => setSelectedFormat(e.target.value as ImageFormat)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">JPG (Smaller size)</span>
                </label>
              </div>
            </div>

            {/* Quality Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Quality Level
              </label>
              <div className="space-y-3">
                {QUALITY_OPTIONS.map((option) => (
                  <label key={option.level} className="flex items-start cursor-pointer">
                    <input
                      type="radio"
                      name="quality"
                      value={option.level}
                      checked={selectedQuality === option.level}
                      onChange={(e) => setSelectedQuality(e.target.value as QualityLevel)}
                      className="mr-3 mt-1"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {option.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-8">
            <Button 
              onClick={onClose} 
              className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDownload} 
              disabled={isDownloading}
              className="flex-1"
            >
              {isDownloading ? 'Downloading...' : 'Download'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;