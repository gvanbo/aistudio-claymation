export interface Pose {
    [key: string]: string;
}

export interface Character {
    character_name: string;
    character_short_description: string;
    base_description: string;
    style_prefix: string;
    style_suffix: string;
    poses: Pose;
}

export interface CharacterData {
    characters: {
        [key: string]: Character;
    };
}