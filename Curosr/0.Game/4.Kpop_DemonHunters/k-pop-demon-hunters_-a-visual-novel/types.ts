
export type SceneId = string;

export interface Character {
  id: string;
  name: string;
  sprites: {
    [emotion: string]: string; // e.g., 'neutral', 'sad', 'happy' -> image URL
  };
}

export interface Dialogue {
  character: string; // Character ID or 'Narrator'
  emotion?: string; // e.g. 'sad' to select sprite
  text: string;
  position?: 'left' | 'center' | 'right';
}

export interface Choice {
  text: string;
  nextScene: SceneId;
  flagEffects?: FlagEffect[];
  condition?: string; // 조건부 선택지
}

export interface FlagEffect {
  type: 'set' | 'add' | 'subtract';
  flag: string;
  value: number | boolean | string;
}

export interface Scene {
  background: string;
  dialogue: Dialogue[];
  choices?: Choice[];
  nextScene?: SceneId;
  onEnter?: FlagEffect[]; // 씬 진입 시 실행되는 효과
  condition?: string; // 씬 진입 조건
}

export type GameData = {
  [key: SceneId]: Scene;
};

export interface GameFlags {
  // 주요 변수들
  JinwooTrust: number; // 0~100
  CurseMark: number; // 0~10
  TeamTrust: number; // 0~100
  Fandom: number; // 상대 지표

  // 플래그들
  JinwooMeet: boolean;
  Betrayal: boolean;
  SoloRoute: boolean;

  // 씬 방문 기록
  visitedScenes: string[];

  // 선택 기록
  choiceHistory: Record<string, number>;
}

export enum GameState {
  StartMenu,
  Playing,
  EndMenu,
}
