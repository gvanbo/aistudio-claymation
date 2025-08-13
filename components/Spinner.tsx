
import React from 'react';

const Spinner = (): React.ReactNode => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
      <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">Generating Image...</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">This may take a moment.</p>
    </div>
  );
};

export default Spinner;
