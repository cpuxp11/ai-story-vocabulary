/**
 * Story Manager Agent
 *
 * Purpose: 시나리오 및 대화 관리, 분기 처리
 * Capabilities:
 * - 스토리 진행 관리 및 대화 시스템
 * - 플레이어 선택에 따른 분기 처리
 * - 게임 플래그 및 상태 관리
 * - 시나리오 저장/로드 시스템
 * - 대화 히스토리 및 백로그 관리
 * - 자동 진행 및 스킵 기능
 */

import { GameData, Scene, GameState, SceneId, Character, DialogueChoice } from '../k-pop-demon-hunters_-a-visual-novel/types';

export interface StoryBranch {
  id: string;
  condition?: string;
  targetSceneId: SceneId;
  flags?: Record<string, any>;
  description?: string;
}

export interface DialogueNode {
  id: string;
  character?: string;
  text: string;
  emotion?: string;
  voice?: string;
  choices?: DialogueChoice[];
  branches?: StoryBranch[];
  effects?: StoryEffect[];
  flags?: Record<string, boolean | number | string>;
}

export interface StoryEffect {
  type: 'flag' | 'stat' | 'item' | 'scene' | 'character';
  action: 'set' | 'add' | 'remove' | 'toggle';
  target: string;
  value?: any;
}

export interface StoryProgress {
  currentSceneId: SceneId;
  currentDialogueIndex: number;
  visitedScenes: Set<SceneId>;
  playerChoices: Record<string, any>;
  gameFlags: Record<string, any>;
  characterStats: Record<string, Record<string, number>>;
  unlockedContent: string[];
}

export interface DialogueHistory {
  sceneId: SceneId;
  dialogueIndex: number;
  character?: string;
  text: string;
  timestamp: number;
  choices?: DialogueChoice[];
}

export interface AutoPlaySettings {
  enabled: boolean;
  speed: number; // 1-5
  skipRead: boolean;
  stopOnChoices: boolean;
}

export class StoryManagerAgent {
  private gameData: GameData;
  private storyProgress: StoryProgress;
  private dialogueHistory: DialogueHistory[] = [];
  private autoPlaySettings: AutoPlaySettings = {
    enabled: false,
    speed: 3,
    skipRead: false,
    stopOnChoices: true
  };
  private currentDialogueNode: DialogueNode | null = null;
  private autoPlayTimer: NodeJS.Timeout | null = null;

  constructor(gameData: GameData, initialProgress?: Partial<StoryProgress>) {
    this.gameData = gameData;
    this.storyProgress = {
      currentSceneId: 'prologue' as SceneId,
      currentDialogueIndex: 0,
      visitedScenes: new Set(),
      playerChoices: {},
      gameFlags: {},
      characterStats: {},
      unlockedContent: [],
      ...initialProgress
    };
  }

  // ========== 기본 스토리 진행 관리 ==========

  getCurrentScene(): Scene | null {
    return this.gameData.scenes[this.storyProgress.currentSceneId] || null;
  }

  getCurrentDialogue(): DialogueNode | null {
    const scene = this.getCurrentScene();
    if (!scene || !scene.dialogues) return null;

    return scene.dialogues[this.storyProgress.currentDialogueIndex] || null;
  }

  async advanceDialogue(): Promise<{
    hasNext: boolean;
    currentDialogue: DialogueNode | null;
    isSceneEnd: boolean;
  }> {
    const scene = this.getCurrentScene();
    if (!scene || !scene.dialogues) {
      return { hasNext: false, currentDialogue: null, isSceneEnd: true };
    }

    // 현재 대화를 히스토리에 추가
    const currentDialogue = this.getCurrentDialogue();
    if (currentDialogue) {
      this.addToHistory(currentDialogue);
    }

    // 다음 대화로 진행
    this.storyProgress.currentDialogueIndex++;

    const nextDialogue = this.getCurrentDialogue();
    const isSceneEnd = this.storyProgress.currentDialogueIndex >= scene.dialogues.length;

    if (nextDialogue) {
      await this.processDialogueEffects(nextDialogue);
    }

    return {
      hasNext: !isSceneEnd,
      currentDialogue: nextDialogue,
      isSceneEnd
    };
  }

  async goToScene(sceneId: SceneId, dialogueIndex: number = 0): Promise<boolean> {
    const targetScene = this.gameData.scenes[sceneId];
    if (!targetScene) {
      console.error(`Scene not found: ${sceneId}`);
      return false;
    }

    // 현재 씬을 방문 기록에 추가
    this.storyProgress.visitedScenes.add(this.storyProgress.currentSceneId);

    // 새로운 씬으로 이동
    this.storyProgress.currentSceneId = sceneId;
    this.storyProgress.currentDialogueIndex = dialogueIndex;

    // 씬 진입 효과 처리
    if (targetScene.onEnter) {
      await this.processSceneEffects(targetScene.onEnter);
    }

    return true;
  }

  // ========== 선택 및 분기 처리 ==========

  async makeChoice(choiceIndex: number): Promise<{
    success: boolean;
    nextScene?: SceneId;
    effects?: StoryEffect[];
  }> {
    const currentDialogue = this.getCurrentDialogue();
    if (!currentDialogue?.choices || choiceIndex >= currentDialogue.choices.length) {
      return { success: false };
    }

    const choice = currentDialogue.choices[choiceIndex];

    // 선택 기록
    this.storyProgress.playerChoices[`${this.storyProgress.currentSceneId}_${this.storyProgress.currentDialogueIndex}`] = choiceIndex;

    // 선택에 따른 효과 처리
    if (choice.effects) {
      await this.processEffects(choice.effects);
    }

    // 분기 처리
    let nextScene: SceneId | undefined;
    if (choice.nextScene) {
      nextScene = choice.nextScene;
      await this.goToScene(choice.nextScene);
    } else {
      // 다음 대화로 진행
      await this.advanceDialogue();
    }

    return {
      success: true,
      nextScene,
      effects: choice.effects
    };
  }

  checkBranchCondition(condition: string): boolean {
    // 간단한 조건 평가기 (실제로는 더 복잡한 파서가 필요)
    try {
      // 예: "flag.sawIntro == true", "character.rumi.affection > 50"
      const evaluated = this.evaluateCondition(condition);
      return Boolean(evaluated);
    } catch (error) {
      console.error('Error evaluating condition:', condition, error);
      return false;
    }
  }

  private evaluateCondition(condition: string): any {
    // 안전한 조건 평가 (실제 구현에서는 더 안전한 파서 사용)
    const context = {
      flag: this.storyProgress.gameFlags,
      character: this.storyProgress.characterStats,
      choice: this.storyProgress.playerChoices,
      visited: (sceneId: string) => this.storyProgress.visitedScenes.has(sceneId as SceneId)
    };

    // 간단한 조건 평가 (실제로는 더 안전한 방법 사용)
    return Function('"use strict"; return (' + condition + ')').call(context);
  }

  // ========== 효과 처리 ==========

  private async processDialogueEffects(dialogue: DialogueNode): Promise<void> {
    if (dialogue.effects) {
      await this.processEffects(dialogue.effects);
    }

    if (dialogue.flags) {
      Object.assign(this.storyProgress.gameFlags, dialogue.flags);
    }
  }

  private async processSceneEffects(effects: StoryEffect[]): Promise<void> {
    await this.processEffects(effects);
  }

  private async processEffects(effects: StoryEffect[]): Promise<void> {
    for (const effect of effects) {
      await this.applyEffect(effect);
    }
  }

  private async applyEffect(effect: StoryEffect): Promise<void> {
    switch (effect.type) {
      case 'flag':
        this.applyFlagEffect(effect);
        break;
      case 'stat':
        this.applyStatEffect(effect);
        break;
      case 'item':
        this.applyItemEffect(effect);
        break;
      case 'scene':
        if (effect.action === 'set' && effect.value) {
          await this.goToScene(effect.value as SceneId);
        }
        break;
      case 'character':
        this.applyCharacterEffect(effect);
        break;
    }
  }

  private applyFlagEffect(effect: StoryEffect): void {
    const target = effect.target;

    switch (effect.action) {
      case 'set':
        this.storyProgress.gameFlags[target] = effect.value;
        break;
      case 'toggle':
        this.storyProgress.gameFlags[target] = !this.storyProgress.gameFlags[target];
        break;
      case 'add':
        this.storyProgress.gameFlags[target] = (this.storyProgress.gameFlags[target] || 0) + (effect.value || 1);
        break;
      case 'remove':
        delete this.storyProgress.gameFlags[target];
        break;
    }
  }

  private applyStatEffect(effect: StoryEffect): void {
    const [character, stat] = effect.target.split('.');

    if (!this.storyProgress.characterStats[character]) {
      this.storyProgress.characterStats[character] = {};
    }

    const currentValue = this.storyProgress.characterStats[character][stat] || 0;

    switch (effect.action) {
      case 'set':
        this.storyProgress.characterStats[character][stat] = effect.value || 0;
        break;
      case 'add':
        this.storyProgress.characterStats[character][stat] = currentValue + (effect.value || 1);
        break;
      case 'remove':
        this.storyProgress.characterStats[character][stat] = Math.max(0, currentValue - (effect.value || 1));
        break;
    }
  }

  private applyItemEffect(effect: StoryEffect): void {
    // 아이템 시스템 구현 (추후 확장)
    console.log('Item effect:', effect);
  }

  private applyCharacterEffect(effect: StoryEffect): void {
    // 캐릭터 상태 변경 (추후 확장)
    console.log('Character effect:', effect);
  }

  // ========== 히스토리 및 백로그 관리 ==========

  private addToHistory(dialogue: DialogueNode): void {
    const historyEntry: DialogueHistory = {
      sceneId: this.storyProgress.currentSceneId,
      dialogueIndex: this.storyProgress.currentDialogueIndex,
      character: dialogue.character,
      text: dialogue.text,
      timestamp: Date.now(),
      choices: dialogue.choices
    };

    this.dialogueHistory.push(historyEntry);

    // 히스토리 크기 제한 (메모리 관리)
    if (this.dialogueHistory.length > 1000) {
      this.dialogueHistory = this.dialogueHistory.slice(-500);
    }
  }

  getDialogueHistory(limit?: number): DialogueHistory[] {
    if (limit) {
      return this.dialogueHistory.slice(-limit);
    }
    return [...this.dialogueHistory];
  }

  clearHistory(): void {
    this.dialogueHistory = [];
  }

  // ========== 자동 진행 및 스킵 ==========

  setAutoPlay(settings: Partial<AutoPlaySettings>): void {
    this.autoPlaySettings = { ...this.autoPlaySettings, ...settings };

    if (this.autoPlaySettings.enabled) {
      this.startAutoPlay();
    } else {
      this.stopAutoPlay();
    }
  }

  private startAutoPlay(): void {
    if (this.autoPlayTimer) {
      clearTimeout(this.autoPlayTimer);
    }

    const delay = Math.max(1000, (6 - this.autoPlaySettings.speed) * 1000);

    this.autoPlayTimer = setTimeout(async () => {
      const currentDialogue = this.getCurrentDialogue();

      // 선택지가 있고 정지 설정이 켜져있으면 자동진행 중단
      if (currentDialogue?.choices && this.autoPlaySettings.stopOnChoices) {
        this.setAutoPlay({ enabled: false });
        return;
      }

      // 이미 읽은 대화 스킵 여부 확인
      if (this.autoPlaySettings.skipRead && this.isDialogueRead(currentDialogue)) {
        await this.advanceDialogue();
        this.startAutoPlay();
        return;
      }

      const result = await this.advanceDialogue();

      if (result.hasNext) {
        this.startAutoPlay();
      } else {
        this.setAutoPlay({ enabled: false });
      }
    }, delay);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayTimer) {
      clearTimeout(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
  }

  private isDialogueRead(dialogue: DialogueNode | null): boolean {
    if (!dialogue) return false;

    return this.dialogueHistory.some(entry =>
      entry.sceneId === this.storyProgress.currentSceneId &&
      entry.dialogueIndex === this.storyProgress.currentDialogueIndex
    );
  }

  async skipToNextChoice(): Promise<void> {
    while (true) {
      const currentDialogue = this.getCurrentDialogue();

      if (currentDialogue?.choices) {
        break; // 선택지에서 정지
      }

      const result = await this.advanceDialogue();

      if (!result.hasNext) {
        break; // 씬 종료
      }
    }
  }

  // ========== 저장/로드 데이터 ==========

  getStoryProgress(): StoryProgress {
    return {
      ...this.storyProgress,
      visitedScenes: new Set(this.storyProgress.visitedScenes)
    };
  }

  loadStoryProgress(progress: StoryProgress): void {
    this.storyProgress = {
      ...progress,
      visitedScenes: new Set(progress.visitedScenes)
    };
  }

  // ========== 유틸리티 ==========

  getSceneCompletion(): { current: number; total: number; percentage: number } {
    const totalScenes = Object.keys(this.gameData.scenes).length;
    const visitedScenes = this.storyProgress.visitedScenes.size + 1; // +1 for current scene

    return {
      current: visitedScenes,
      total: totalScenes,
      percentage: Math.round((visitedScenes / totalScenes) * 100)
    };
  }

  getCharacterStats(characterId: string): Record<string, number> {
    return { ...this.storyProgress.characterStats[characterId] } || {};
  }

  getGameFlags(): Record<string, any> {
    return { ...this.storyProgress.gameFlags };
  }

  // ========== 디버그 기능 ==========

  debugJumpToScene(sceneId: SceneId, dialogueIndex: number = 0): void {
    if (process.env.NODE_ENV === 'development') {
      this.goToScene(sceneId, dialogueIndex);
    }
  }

  debugSetFlag(key: string, value: any): void {
    if (process.env.NODE_ENV === 'development') {
      this.storyProgress.gameFlags[key] = value;
    }
  }

  debugGetState(): any {
    if (process.env.NODE_ENV === 'development') {
      return {
        progress: this.storyProgress,
        history: this.dialogueHistory,
        autoPlay: this.autoPlaySettings
      };
    }
  }
}

export default StoryManagerAgent;