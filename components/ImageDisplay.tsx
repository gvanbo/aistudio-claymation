
import React from 'react';
import Spinner from './Spinner';

interface ImageDisplayProps {
  image: string | null;
  isLoading: boolean;
  error: string | null;
}

const Placeholder = () => (
    <div className="text-center text-gray-400 dark:text-gray-500">
         <svg className="mx-auto h-20 w-20 text-gray-300 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        <p className="mt-2 text-lg font-semibold">Your generated image will appear here.</p>
        <p className="text-sm">Select a character and pose, then click "Generate".</p>
    </div>
);

const ImageDisplay = ({ image, isLoading, error }: ImageDisplayProps): React.ReactNode => {
  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <h3 className="font-bold">Generation Failed</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (image) {
    return (
      <img
        src={`data:image/jpeg;base64,${image}`}
        alt="Generated character"
        className="max-w-full max-h-[512px] object-contain rounded-lg shadow-lg"
      />
    );
  }

  return <Placeholder />;
};

export default ImageDisplay;
