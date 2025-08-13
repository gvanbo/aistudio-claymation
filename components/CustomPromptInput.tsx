
import React from 'react';

interface CustomPromptInputProps {
    prompt: string;
    onPromptChange: (value: string) => void;
    disabled: boolean;
    label: string;
    placeholder: string;
    description: string;
}

const CustomPromptInput = ({ prompt, onPromptChange, disabled, label, placeholder, description }: CustomPromptInputProps): React.ReactNode => {
    return (
        <div>
            <label htmlFor="custom-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
            </label>
            <textarea
                id="custom-prompt"
                rows={4}
                className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 transition disabled:bg-gray-200 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
                placeholder={placeholder}
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
                disabled={disabled}
                aria-label="Custom pose or scene description"
                aria-describedby="custom-prompt-description"
            />
            <p id="custom-prompt-description" className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {description}
            </p>
        </div>
    );
};

export default CustomPromptInput;
