// Test setup file for aistudio-claymation enhancements

export const mockCharacters = {
  "alex": {
    "character_name": "Alex",
    "character_short_description": "grade 1 boy",
    "base_description": "6-year-old boy, short curly brown hair, bright blue eyes",
    "style_prefix": "Masterpiece 3D claymation style character",
    "style_suffix": ", full body shot, educational cartoon style",
    "poses": {
      "waving_happy": "A friendly wave with a big smile"
    }
  }
};

export const mockGenerationConfig = {
  outputFormat: 'png' as const,
  backgroundOption: 'transparent' as const,
  qualityLevel: 'print' as const,
  aspectRatio: '1:1' as const
};

// Mock Gemini API response
export const mockImageResponse = {
  generatedImages: [{
    image: {
      imageBytes: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    }
  }]
};
