import React from 'react';

const Header = (): React.ReactNode => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Educational Character Generator
            </h1>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Optimized for Educational Resources
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;