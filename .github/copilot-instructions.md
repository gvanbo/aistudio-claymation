# AI Studio Claymation Educational Character Generator Agent Instructions

## System Context
**Mission**: Generate high-quality 3D claymation-style character images optimized for educational materials using React/Vite and Google Gemini AI.

## Core Architecture

### Technology Stack
- **Framework**: React 18 with TypeScript and Vite
- **AI Service**: Google Gemini AI via `@google/genai`
- **Styling**: Tailwind CSS with dark mode support
- **Build Tool**: Vite with hot module replacement

### Primary Entry Points
- **Development**: `npm run dev` - Starts development server
- **Production**: `npm run build` - Builds for production deployment
- **Testing**: `npm test` - Runs Jest test suite

## Key Components

### Character Management
- **Character Data**: [`constants/characters.ts`](constants/characters.ts) - Comprehensive character definitions
- **Character Selection**: [`components/CharacterSelector.tsx`](components/CharacterSelector.tsx) - Multi-select character interface
- **Pose Library**: [`components/PoseReferenceLibrary.tsx`](components/PoseReferenceLibrary.tsx) - Pre-defined pose catalog

### Quality Control System
- **Quality Presets**: [`types.enhanced.ts`](types.enhanced.ts) - Educational Print, Online Learning, Interactive Media
- **Quality Selector**: [`components/QualitySelector.tsx`](components/QualitySelector.tsx) - Preset selection interface
- **Background Control**: [`components/BackgroundSelector.tsx`](components/BackgroundSelector.tsx) - Transparent, solid, or illustrated backgrounds

### Prompt Generation
- **Core Logic**: [`utils/promptGenerator.ts`](utils/promptGenerator.ts) - Professional prompt generation with educational optimization
- **Enhanced Types**: [`types.enhanced.ts`](types.enhanced.ts) - Advanced configuration interfaces
- **Gemini Service**: [`services/geminiService.enhanced.ts`](services/geminiService.enhanced.ts) - AI service integration

## Configuration Management

### Environment Setup
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Quality Presets
```typescript
{
  "Educational Print": {
    outputFormat: "png",
    qualityLevel: "high_res",
    backgroundOption: "transparent",
    aspectRatio: "1:1"
  },
  "Online Learning": {
    outputFormat: "jpeg",
    qualityLevel: "web",
    backgroundOption: "solid_white",
    aspectRatio: "16:9"
  }
}
```

## Character System

### Character Structure
```typescript
interface Character {
  character_name: string;
  character_short_description: string;
  base_description: string; // Detailed appearance description
  style_prefix: string; // "Masterpiece 3D claymation style character"
  style_suffix: string; // Quality and composition specifications
  poses: { [key: string]: string }; // Pre-defined pose descriptions
}
```

### Enhanced Character Features
- **Multi-Character Scenes**: Automatic height relationship calculations
- **Individual Prompts**: Separate pose descriptions per character
- **Educational Characters**: Age-appropriate designs (grade 1-12)
- **Consistency**: Standardized style across all characters

## Prompt Generation System

### Core Features
- **Structured Format**: Professional prompt templates
- **Educational Optimization**: Prompts designed for educational contexts
- **Quality Specifications**: Automatic inclusion of quality requirements
- **Height Relationships**: Multi-character scene scaling

### Prompt Components
```typescript
// Base character description + custom prompt + quality specs
function generatePrompt(characters, customPrompt, config) {
  return `${stylePrefix} ${characterDescription} ${customPrompt} ${qualitySpecs} ${styleConstraints}`;
}
```

### Educational Optimization
```typescript
interface PromptGenerationOptions {
  useStructuredFormat: boolean; // Professional prompt structure
  includeHeightCalculations: boolean; // Multi-character scaling
  educationalOptimization: boolean; // Educational content focus
}
```

## Quality Control

### Output Formats
- **PNG**: For transparency and print materials
- **JPEG**: For web optimization and smaller file sizes
- **High Resolution**: For large format printing and detailed work

### Background Options
- **Transparent**: For flexible placement in materials
- **Solid White**: For consistent presentation
- **Illustrated**: For contextual educational scenes

### Quality Levels
- **Web**: Optimized for online learning platforms
- **Print**: High resolution for physical materials
- **High Resolution**: Ultra-high quality for professional use

## State Management

### Core State
```typescript
// Original functionality (preserved)
const [selectedCharacterKeys, setSelectedCharacterKeys] = useState<string[]>([]);
const [customPrompt, setCustomPrompt] = useState<string>('');
const [generatedImage, setGeneratedImage] = useState<string | null>(null);

// Enhanced features
const [selectedQualityPreset, setSelectedQualityPreset] = useState<string>('Educational Print');
const [generationConfig, setGenerationConfig] = useState<GenerationConfig>({...});
const [characterPrompts, setCharacterPrompts] = useState<Record<string, string>>({});
```

### Feature Flags
```typescript
const FEATURE_FLAGS = {
  useEnhancedPrompts: true,
  enableQualityPresets: true,
  enableBackgroundControl: true,
  enableIndividualPrompts: true
};
```

## Development Workflow

### Component Development
```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Adding New Characters
1. Update [`constants/characters.ts`](constants/characters.ts) with character definition
2. Include detailed `base_description` and pose library
3. Test character selection and prompt generation
4. Validate output quality across presets

### Extending Quality Presets
1. Define new preset in [`types.enhanced.ts`](types.enhanced.ts)
2. Add preset to `QUALITY_PRESETS` array
3. Update [`components/QualitySelector.tsx`](components/QualitySelector.tsx) if needed
4. Test prompt generation with new preset

## API Integration

### Gemini AI Service
```typescript
// Enhanced service with configuration support
async function generateImage(prompt: string, config?: Partial<GenerationConfig>): Promise<string> {
  // Handles format, quality, and educational optimization
}

// Educational presets for common use cases
async function generateEducationalImage(prompt: string, useCase: 'print' | 'web' | 'interactive'): Promise<string> {
  // Applies optimized configurations automatically
}
```

### Error Handling
- **API Failures**: Graceful fallback with user feedback
- **Invalid Configurations**: Validation with helpful error messages
- **Network Issues**: Retry logic with exponential backoff

## Testing Strategy

### Unit Tests
- **Prompt Generation**: Validate prompt structure and content
- **Character Transformation**: Test data mapping and validation
- **Quality Configuration**: Verify preset application

### Integration Tests
- **Image Generation**: End-to-end workflow testing
- **State Management**: Component interaction validation
- **Error Scenarios**: Failure mode testing

## Educational Use Cases

### Print Materials
- **Worksheets**: High-resolution transparent backgrounds
- **Textbooks**: Consistent character representation
- **Posters**: Large format quality requirements

### Digital Learning
- **Interactive Lessons**: Animated character sequences
- **Online Courses**: Web-optimized file sizes
- **Mobile Apps**: Responsive aspect ratios

### Assessment Tools
- **Character Consistency**: Same character across materials
- **Context Appropriateness**: Age-appropriate designs
- **Cultural Sensitivity**: Inclusive character representation

## Performance Optimization

### Bundle Size
- **Tree Shaking**: Remove unused code
- **Code Splitting**: Load components on demand
- **Asset Optimization**: Compress images and fonts

### Runtime Performance
- **Memoization**: Cache expensive computations
- **Lazy Loading**: Load components as needed
- **State Optimization**: Minimize re-renders

## Documentation References
- **Architecture Comparison**: [`ARCHITECTURE_COMPARISON.md`](ARCHITECTURE_COMPARISON.md) - Technical architecture decisions
- **Enhancement Summary**: [`ENHANCEMENT_SUMMARY.md`](ENHANCEMENT_SUMMARY.md) - Feature improvements
- **Migration Guide**: [`MIGRATION_GUIDE.md`](MIGRATION_GUIDE.md) - Upgrade instructions
- **Integration Plan**: [`INTEGRATION_PLAN.md`](INTEGRATION_PLAN.md) - System integration details