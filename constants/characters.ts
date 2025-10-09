import { CharacterData, HeightCategory } from '../types.enhanced';

// --- Global Style Definitions for Token Efficiency and Consistency ---

// Style Prefix: Defines the core aesthetic and consistency
export const CLAYMATION_STYLE_PREFIX: string = "Masterpiece 3D claymation style character, highly detailed clay-like texture, bright color palette, soft even studio lighting, perfect composition, isolated character on background, educational cartoon style";

// Style Suffix: Defines the general quality and technical constraints (applies to all)
export const CLAYMATION_STYLE_SUFFIX: string = ", full body shot, dynamic expressive pose, high quality 3D render, clear silhouette, no text, no logos, no patterns on clothing (except explicit design in base_description)";

// --- Character Definitions ---

export const CHARACTERS_DATA: CharacterData = {
  "characters": {
    "alex": {
      "character_name": "Alex",
      "character_short_description": "grade 1 boy",
      "base_description": "6-year-old boy, short curly brown hair, bright blue eyes, light brown skin tone, freckles on cheeks, wearing plain solid bright blue t-shirt and khaki cargo shorts with white sneakers",
      "poses": {
        "waving_happy": "A friendly and welcoming wave with the right arm raised, a big happy smile with curious eyes, body angled slightly towards the viewer.",
        "pointing_excited": "Pointing forward with an excited expression, eyes wide with enthusiasm and a wide open mouth smile, body leaning forward as if showing something amazing.",
        "thumbs_up_happy": "Giving a confident thumbs-up with the right hand, a proud and happy smile, standing straight and positive.",
        "thinking_thoughtful": "A classic thinking pose with the right index finger on the chin, a thoughtful and contemplative expression with a slight smile, looking slightly upwards as if pondering an idea.",
        "presenting_happy": "Presenting with both hands open and palms up in a welcoming gesture, a warm and friendly smile as if sharing information."
      },
      "height_category": 'short_child' as HeightCategory,
    },
    "zoe": {
      "character_name": "Zoe",
      "character_short_description": "grade 1 girl",
      "base_description": "6-year-old girl, long straight black hair in two pigtails with matching bright colorful hair ties on both sides, dark brown eyes, medium skin tone, freckles on nose, wearing plain solid pink t-shirt with heart design and denim skirt, white crew socks, blue and pink Vans style shoes",
      "poses": {
        "waving_happy": "A friendly and welcoming wave with the right arm raised, a bright enthusiastic smile, body angled slightly towards the viewer.",
        "pointing_excited": "Pointing forward with an excited expression, eyes wide with enthusiasm and a wide open mouth smile, body leaning forward as if showing something amazing.",
        "thumbs_up_happy": "Giving a confident thumbs-up with the right hand, a proud and bright enthusiastic smile, standing straight and positive.",
        "thinking_thoughtful": "A classic thinking pose with the right index finger on the chin, a thoughtful expression with a gentle smile, looking slightly upwards as if pondering an idea.",
        "presenting_happy": "Presenting with both hands open and palms up in a welcoming gesture, a bright enthusiastic smile as if sharing information."
      },
      "height_category": 'short_child' as HeightCategory,
    },
    "marcus": {
      "character_name": "Marcus",
      "character_short_description": "grade 6 boy",
      "base_description": "11-year-old boy, medium-length wavy red hair, green eyes with freckles across nose and cheeks, fair skin tone, wearing plain solid green hoodie and dark blue jeans with black high-top sneakers",
      "poses": {
        "waving_happy": "A friendly and welcoming wave with the right arm raised, a confident friendly grin, body angled slightly towards the viewer.",
        "pointing_excited": "Pointing forward with an excited expression, eyes wide with enthusiasm and a wide open mouth smile, body leaning forward as if showing something amazing.",
        "thumbs_up_happy": "Giving a confident thumbs-up with the right hand, a proud and confident friendly grin, standing straight and positive.",
        "thinking_thoughtful": "A classic thinking pose with the right index finger on the chin, a thoughtful expression with a slight smile, looking slightly upwards as if pondering an idea.",
        "presenting_happy": "Presenting with both hands open and palms up in a welcoming gesture, a confident friendly grin as if sharing information."
      },
      "height_category": 'medium_child' as HeightCategory,
    },
    "priya": {
      "character_name": "Priya",
      "character_short_description": "grade 6 girl",
      "base_description": "11-year-old girl, long straight black hair, dark brown eyes, South Asian skin tone, wearing plain solid purple cardigan over white shirt with dark leggings and brown ankle boots",
      "poses": {
        "waving_happy": "A friendly and welcoming wave with the right arm raised, a thoughtful warm smile, body angled slightly towards the viewer.",
        "pointing_excited": "Pointing forward with an excited expression, eyes wide with enthusiasm and a wide open mouth smile, body leaning forward as if showing something amazing.",
        "thumbs_up_happy": "Giving a confident thumbs-up with the right hand, a proud and thoughtful warm smile, standing straight and positive.",
        "thinking_thoughtful": "A classic thinking pose with the right index finger on the chin, a gentle smile and focused contemplative eyes, looking slightly upwards as if pondering an idea.",
        "presenting_happy": "Presenting with both hands open and palms up in a welcoming gesture, a thoughtful warm smile as if sharing information."
      },
      "height_category": 'medium_child' as HeightCategory,
    },
    "ms_rodriguez": {
      "character_name": "Ms. Rodriguez",
      "character_short_description": "female teacher",
      "base_description": "30-year-old female teacher, shoulder-length wavy brown hair, brown eyes with glasses, Latina skin tone, wearing professional solid blue blouse and dark gray slacks with comfortable black flats",
      "poses": {
        "waving_happy": "A friendly and welcoming wave with the right arm raised, an encouraging and patient smile showing warmth, body angled slightly towards the viewer.",
        "pointing_encouraging": "Pointing forward with an encouraging expression, a gentle smile and soft supportive eyes, as if guiding a student.",
        "thumbs_up_happy": "Giving a confident thumbs-up with the right hand, a proud and encouraging smile, standing straight and positive.",
        "thinking_thoughtful": "A classic thinking pose with a hand on her chin, a thoughtful expression with a gentle smile, looking slightly downwards as if listening to a student's question.",
        "presenting_encouraging": "Presenting with both hands open and palms up in a welcoming gesture, an encouraging smile as if explaining a concept."
      },
      "height_category": 'adult' as HeightCategory,
    },
    "mr_johnson": {
      "character_name": "Mr. Johnson",
      "character_short_description": "male teacher",
      "base_description": "35-year-old male teacher, short black hair with slight gray at temples, dark brown eyes, African American skin tone, wearing casual solid light blue button-up shirt and khaki pants with loafers",
      "poses": {
        "waving_happy": "A friendly and welcoming wave with the right arm raised, a warm and kind smile, body angled slightly towards the viewer.",
        "pointing_encouraging": "Pointing forward with an encouraging expression and a supportive smile, as if explaining something on a board.",
        "thumbs_up_happy": "Giving a confident thumbs-up with the right hand, a proud and happy smile, standing straight and positive.",
        "thinking_thoughtful": "A classic thinking pose with a hand on his chin, a thoughtful and calm expression, looking slightly to the side as if considering a problem.",
        "presenting_encouraging": "Presenting with both hands open and palms up in a welcoming gesture, an encouraging smile as if inviting students to participate."
      },
      "height_category": 'adult' as HeightCategory,
    },
    "dino_danny": {
      "character_name": "Danny",
      "character_short_description": "grade 4 boy who loves dinosaurs",
      "base_description": "15-year-old boy who looks like he is in grade 10, short messy blond hair, hazel eyes, fair skin tone, wearing a vibrant t-shirt with a detailed T-Rex skeleton graphic and 'DINO MIGHT!' text, blue denim jeans, and sneakers designed like dinosaur feet",
      "poses": {
        "waving_happy": "A friendly and energetic wave with the right arm, a big, toothy grin, body angled slightly towards the viewer.",
        "dino_roar_playful": "A playful roar with hands held up like T-Rex claws, a wide-open mouth in a mock roar, and a fun, scrunched-up nose.",
        "pointing_excited": "Pointing excitedly at something off-camera with a look of awe and wonder, as if discovering a new dinosaur fossil.",
        "thinking_about_dinos": "A thoughtful pose with a finger to the temple, eyes looking up as if imagining a world full of dinosaurs, a slight, curious smile.",
        "thumbs_up_confident": "Giving a big, confident thumbs-up with the right hand, a proud smile, standing tall as if he's the king of the dinosaurs."
      },
      "height_category": 'teenager' as HeightCategory,
    }
  }
};
