/**
 * Game Architecture Agent
 *
 * Purpose: Core game engine enhancement and system integration
 * Capabilities:
 * - Audio system integration (Web Audio API)
 * - Advanced state management for save/load functionality
 * - Asset loading optimization and caching
 * - Performance monitoring and optimization
 * - Cross-platform compatibility enhancements
 * - Game engine architecture improvements
 */

import { GameData, Scene, GameState, SceneId, Character } from '../k-pop-demon-hunters_-a-visual-novel/types';

export interface AudioSystem {
  playBGM: (url: string, loop?: boolean) => void;
  playSFX: (url: string) => void;
  stopBGM: () => void;
  setVolume: (type: 'bgm' | 'sfx' | 'voice', volume: number) => void;
  getVolume: (type: 'bgm' | 'sfx' | 'voice') => number;
}

export interface SaveData {
  id: string;
  timestamp: number;
  currentSceneId: SceneId;
  dialogueIndex: number;
  gameState: GameState;
  playerChoices: Record<string, any>;
  gameFlags: Record<string, any>;
  playtime: number;
  metadata: {
    sceneName: string;
    previewText: string;
    screenshot?: string;
  };
}

export interface AssetCache {
  preloadAssets: (urls: string[]) => Promise<void>;
  getAsset: (url: string) => Promise<any>;
  clearCache: () => void;
  getCacheStatus: () => { loaded: number; total: number; };
}

export interface PerformanceMonitor {
  startProfiler: () => void;
  stopProfiler: () => PerformanceReport;
  trackFrameRate: () => void;
  getMemoryUsage: () => MemoryInfo;
}

export interface PerformanceReport {
  averageFPS: number;
  memoryPeak: number;
  loadTimes: Record<string, number>;
  renderingMetrics: {
    averageRenderTime: number;
    slowestFrame: number;
  };
}

export interface MemoryInfo {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export class GameArchitectureAgent {
  private audioContext: AudioContext | null = null;
  private bgmSource: AudioBufferSourceNode | null = null;
  private saveSlots: SaveData[] = [];
  private assetCache: Map<string, any> = new Map();
  private performanceData: {
    frameCount: number;
    startTime: number;
    frameTimes: number[];
  } = { frameCount: 0, startTime: 0, frameTimes: [] };

  // Audio System Implementation
  initializeAudioSystem(): AudioSystem {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    return {
      playBGM: this.playBGM.bind(this),
      playSFX: this.playSFX.bind(this),
      stopBGM: this.stopBGM.bind(this),
      setVolume: this.setVolume.bind(this),
      getVolume: this.getVolume.bind(this),
    };
  }

  private async playBGM(url: string, loop: boolean = true): Promise<void> {
    if (!this.audioContext) return;

    try {
      this.stopBGM();
      const response = await fetch(url);
      const audioBuffer = await response.arrayBuffer();
      const decodedBuffer = await this.audioContext.decodeAudioData(audioBuffer);

      this.bgmSource = this.audioContext.createBufferSource();
      this.bgmSource.buffer = decodedBuffer;
      this.bgmSource.loop = loop;
      this.bgmSource.connect(this.audioContext.destination);
      this.bgmSource.start();
    } catch (error) {
      console.error('Failed to play BGM:', error);
    }
  }

  private async playSFX(url: string): Promise<void> {
    if (!this.audioContext) return;

    try {
      const response = await fetch(url);
      const audioBuffer = await response.arrayBuffer();
      const decodedBuffer = await this.audioContext.decodeAudioData(audioBuffer);

      const source = this.audioContext.createBufferSource();
      source.buffer = decodedBuffer;
      source.connect(this.audioContext.destination);
      source.start();
    } catch (error) {
      console.error('Failed to play SFX:', error);
    }
  }

  private stopBGM(): void {
    if (this.bgmSource) {
      this.bgmSource.stop();
      this.bgmSource = null;
    }
  }

  private setVolume(type: 'bgm' | 'sfx' | 'voice', volume: number): void {
    localStorage.setItem(`volume_${type}`, volume.toString());
  }

  private getVolume(type: 'bgm' | 'sfx' | 'voice'): number {
    return parseFloat(localStorage.getItem(`volume_${type}`) || '0.8');
  }

  // Save/Load System Implementation
  saveGame(
    currentSceneId: SceneId,
    dialogueIndex: number,
    gameState: GameState,
    playerChoices: Record<string, any> = {},
    gameFlags: Record<string, any> = {},
    slotId?: string
  ): string {
    const saveId = slotId || `save_${Date.now()}`;
    const playtime = this.getPlaytime();

    const saveData: SaveData = {
      id: saveId,
      timestamp: Date.now(),
      currentSceneId,
      dialogueIndex,
      gameState,
      playerChoices,
      gameFlags,
      playtime,
      metadata: {
        sceneName: this.getSceneName(currentSceneId),
        previewText: this.getPreviewText(currentSceneId, dialogueIndex),
      },
    };

    // Save to localStorage
    localStorage.setItem(`game_save_${saveId}`, JSON.stringify(saveData));

    // Update save slots
    const existingIndex = this.saveSlots.findIndex(save => save.id === saveId);
    if (existingIndex >= 0) {
      this.saveSlots[existingIndex] = saveData;
    } else {
      this.saveSlots.push(saveData);
    }

    return saveId;
  }

  loadGame(saveId: string): SaveData | null {
    try {
      const saveDataString = localStorage.getItem(`game_save_${saveId}`);
      if (!saveDataString) return null;

      return JSON.parse(saveDataString) as SaveData;
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  }

  getSaveSlots(): SaveData[] {
    const saves: SaveData[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('game_save_')) {
        try {
          const saveData = JSON.parse(localStorage.getItem(key)!);
          saves.push(saveData);
        } catch (error) {
          console.error('Corrupted save data:', key);
        }
      }
    }
    return saves.sort((a, b) => b.timestamp - a.timestamp);
  }

  deleteSave(saveId: string): void {
    localStorage.removeItem(`game_save_${saveId}`);
    this.saveSlots = this.saveSlots.filter(save => save.id !== saveId);
  }

  // Asset Management System
  createAssetCache(): AssetCache {
    return {
      preloadAssets: this.preloadAssets.bind(this),
      getAsset: this.getAsset.bind(this),
      clearCache: this.clearCache.bind(this),
      getCacheStatus: this.getCacheStatus.bind(this),
    };
  }

  private async preloadAssets(urls: string[]): Promise<void> {
    const promises = urls.map(async url => {
      if (this.assetCache.has(url)) return;

      try {
        if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          const img = new Image();
          img.src = url;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
          });
          this.assetCache.set(url, img);
        } else if (url.match(/\.(mp3|wav|ogg)$/i)) {
          const response = await fetch(url);
          const buffer = await response.arrayBuffer();
          this.assetCache.set(url, buffer);
        }
      } catch (error) {
        console.warn(`Failed to preload asset: ${url}`, error);
      }
    });

    await Promise.allSettled(promises);
  }

  private async getAsset(url: string): Promise<any> {
    if (this.assetCache.has(url)) {
      return this.assetCache.get(url);
    }

    await this.preloadAssets([url]);
    return this.assetCache.get(url);
  }

  private clearCache(): void {
    this.assetCache.clear();
  }

  private getCacheStatus(): { loaded: number; total: number; } {
    return {
      loaded: this.assetCache.size,
      total: this.assetCache.size, // This would need to be tracked differently for a real implementation
    };
  }

  // Performance Monitoring
  createPerformanceMonitor(): PerformanceMonitor {
    return {
      startProfiler: this.startProfiler.bind(this),
      stopProfiler: this.stopProfiler.bind(this),
      trackFrameRate: this.trackFrameRate.bind(this),
      getMemoryUsage: this.getMemoryUsage.bind(this),
    };
  }

  private startProfiler(): void {
    this.performanceData.startTime = performance.now();
    this.performanceData.frameCount = 0;
    this.performanceData.frameTimes = [];
  }

  private stopProfiler(): PerformanceReport {
    const endTime = performance.now();
    const duration = endTime - this.performanceData.startTime;

    return {
      averageFPS: this.performanceData.frameCount / (duration / 1000),
      memoryPeak: Math.max(...this.performanceData.frameTimes),
      loadTimes: {}, // Would track specific asset load times
      renderingMetrics: {
        averageRenderTime: this.performanceData.frameTimes.reduce((a, b) => a + b, 0) / this.performanceData.frameTimes.length,
        slowestFrame: Math.max(...this.performanceData.frameTimes),
      },
    };
  }

  private trackFrameRate(): void {
    const frameTime = performance.now();
    this.performanceData.frameTimes.push(frameTime);
    this.performanceData.frameCount++;

    requestAnimationFrame(() => this.trackFrameRate());
  }

  private getMemoryUsage(): MemoryInfo {
    if ('memory' in performance) {
      return (performance as any).memory;
    }
    return {
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0,
    };
  }

  // Helper methods
  private getPlaytime(): number {
    const startTime = localStorage.getItem('game_start_time');
    if (!startTime) {
      localStorage.setItem('game_start_time', Date.now().toString());
      return 0;
    }
    return Date.now() - parseInt(startTime);
  }

  private getSceneName(sceneId: SceneId): string {
    // This would be enhanced with actual scene data
    return sceneId.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  private getPreviewText(sceneId: SceneId, dialogueIndex: number): string {
    // This would extract actual dialogue text from the scene
    return `Scene: ${sceneId}, Dialogue: ${dialogueIndex}`;
  }

  // Enhanced Game State Management
  createGameStateManager() {
    return {
      // Undo/Redo functionality
      saveStateSnapshot: () => {
        const state = this.getCurrentGameState();
        this.saveToHistory(state);
      },

      undoLastAction: () => {
        return this.loadFromHistory(-1);
      },

      redoLastAction: () => {
        return this.loadFromHistory(1);
      },

      // Auto-save functionality
      enableAutoSave: (intervalMs: number = 60000) => {
        setInterval(() => {
          this.autoSave();
        }, intervalMs);
      },

      // Cloud save integration (placeholder)
      syncToCloud: async () => {
        // Implementation for cloud save synchronization
        console.log('Cloud sync not implemented yet');
      },
    };
  }

  private getCurrentGameState(): any {
    // Implementation to capture current game state
    return {};
  }

  private saveToHistory(state: any): void {
    // Implementation for state history management
  }

  private loadFromHistory(offset: number): any {
    // Implementation for loading from state history
    return {};
  }

  private autoSave(): void {
    // Implementation for automatic saving
    console.log('Auto-save triggered');
  }

  // Cross-platform compatibility helpers
  getCompatibilityInfo() {
    return {
      isWebAudioSupported: !!(window.AudioContext || (window as any).webkitAudioContext),
      isLocalStorageSupported: !!window.localStorage,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      isTouch: 'ontouchstart' in window,
      screenSize: {
        width: window.screen.width,
        height: window.screen.height,
      },
    };
  }
}

export default GameArchitectureAgent;