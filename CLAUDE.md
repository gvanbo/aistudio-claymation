# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`
- **Install dependencies**: `npm install`

## Environment Setup

The application requires a Gemini API key to function:
1. Set `GEMINI_API_KEY` in `.env.local` file
2. The Vite config maps this to `process.env.API_KEY` for the application

## Architecture Overview

This is a React + TypeScript application built with Vite that generates claymation-style character images using Google's Gemini AI.

### Core Application Flow
1. **Character Selection** (`App.tsx:26-36`) - Users select one or more characters from predefined options
2. **Prompt Generation** (`App.tsx:58-100`) - The app builds sophisticated prompts based on:
   - Single character: Combines character description + user pose/scene input
   - Multiple characters: Adds character definitions and relative height calculations for realistic scenes
3. **Image Generation** (`services/geminiService.ts`) - Calls Gemini's Imagen 3.0 API with the constructed prompt
4. **Result Display** - Shows generated base64 image or error states

### Key Data Structures

**Character System** (`constants/characters.ts`, `types.ts`):
- Each character has: name, description, style prefix/suffix, and predefined poses
- Characters include students (grade 1 & 6) and teachers with distinct heights
- Height categories (`short`/`medium`/`tall`) enable realistic multi-character scenes

**State Management** (`App.tsx:14-18`):
- `selectedCharacterKeys`: Currently selected character IDs
- `generatedImage`: Base64 image data from API
- `customPrompt`: User's pose/scene description
- Loading and error states

### Component Architecture

- **App.tsx**: Main application logic and state management
- **CharacterSelector**: Grid of selectable character cards
- **CustomPromptInput**: Text input for pose/scene descriptions
- **PoseReferenceLibrary**: Preset poses for single character selection
- **ImageDisplay**: Handles loading, error, and success states for generated images
- **Header**: Application title and branding

### API Integration

The `geminiService.ts` uses Google's GenAI SDK with Imagen 3.0 model:
- Generates 1:1 aspect ratio JPEG images
- Throws user-friendly errors on API failures
- Expects `process.env.API_KEY` environment variable

### Styling

Uses Tailwind CSS with dark mode support. Key design patterns:
- Responsive grid layout (single column on mobile, two columns on desktop)
- Rounded cards with shadows and borders
- Consistent color scheme with gray/white base and accent colors
- Loading spinners and error states with appropriate visual feedback