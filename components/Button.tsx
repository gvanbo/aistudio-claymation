import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button = ({ children, className, ...props }: ButtonProps): React.ReactNode => {
  // The original component's className is preserved. If a className is passed, it will override the default.
  const defaultClassName = "w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200";

  return (
    <button
      {...props}
      className={className || defaultClassName}
    >
      {children}
    </button>
  );
};

export default Button;