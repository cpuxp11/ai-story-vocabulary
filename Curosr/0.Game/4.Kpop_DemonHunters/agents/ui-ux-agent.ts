/**
 * UI/UX Agent
 *
 * Purpose: 게임 인터페이스, 메뉴, 대화창 관리
 * Capabilities:
 * - 게임 UI 레이아웃 및 테마 관리
 * - 대화창 및 텍스트 시스템
 * - 메뉴 및 옵션 화면 관리
 * - 애니메이션 및 트랜지션 효과
 * - 접근성 및 반응형 디자인
 * - 사용자 설정 및 개인화
 */

import { GameState, DialogueChoice } from '../k-pop-demon-hunters_-a-visual-novel/types';

export interface UITheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    shadow: string;
    danger: string;
    success: string;
    warning: string;
  };
  fonts: {
    primary: string;
    secondary: string;
    dialogue: string;
    ui: string;
  };
  borderRadius: string;
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface DialogueBoxConfig {
  style: 'classic' | 'modern' | 'minimalist' | 'transparent';
  position: 'bottom' | 'center' | 'top';
  width: number; // percentage
  height: number; // percentage
  opacity: number; // 0-1
  textSpeed: number; // characters per second
  autoAdvanceDelay: number; // ms
  showCharacterName: boolean;
  showCharacterPortrait: boolean;
  enableTypewriterEffect: boolean;
  backgroundBlur: number; // 0-100
}

export interface UILayoutConfig {
  showStatusBar: boolean;
  showQuickMenu: boolean;
  showProgressBar: boolean;
  characterPortraitSize: 'small' | 'medium' | 'large';
  backgroundDimming: number; // 0-100
  menuAnimationSpeed: 'slow' | 'normal' | 'fast';
  transitionEffects: boolean;
}

export interface AccessibilityConfig {
  fontSize: number; // 50-200 (percentage)
  highContrast: boolean;
  reduceMotion: boolean;
  screenReaderSupport: boolean;
  colorBlindSupport: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  subtitles: boolean;
  voiceOverEnabled: boolean;
}

export interface UIAnimation {
  id: string;
  type: 'fadeIn' | 'fadeOut' | 'slideIn' | 'slideOut' | 'scale' | 'bounce' | 'shake';
  duration: number;
  delay?: number;
  easing: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce';
  direction?: 'up' | 'down' | 'left' | 'right';
  intensity?: number;
}

export interface MenuState {
  currentMenu: 'main' | 'game' | 'settings' | 'save' | 'load' | 'history' | 'extras' | null;
  previousMenu: string | null;
  isVisible: boolean;
  isAnimating: boolean;
  quickMenuVisible: boolean;
}

export interface DialogueState {
  isVisible: boolean;
  currentText: string;
  displayedText: string;
  characterName: string;
  characterPortrait: string;
  isTyping: boolean;
  hasMoreText: boolean;
  choices: DialogueChoice[];
  canSkip: boolean;
  autoMode: boolean;
}

export interface NotificationMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'achievement';
  title: string;
  message: string;
  duration?: number; // ms, undefined = permanent
  action?: {
    label: string;
    callback: () => void;
  };
}

export interface ProgressInfo {
  current: number;
  total: number;
  percentage: number;
  label: string;
}

export class UIUXAgent {
  private currentTheme: UITheme;
  private dialogueConfig: DialogueBoxConfig;
  private layoutConfig: UILayoutConfig;
  private accessibilityConfig: AccessibilityConfig;
  private menuState: MenuState;
  private dialogueState: DialogueState;
  private notifications: NotificationMessage[] = [];
  private activeAnimations: Map<string, UIAnimation> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.currentTheme = this.getDefaultTheme();
    this.dialogueConfig = this.getDefaultDialogueConfig();
    this.layoutConfig = this.getDefaultLayoutConfig();
    this.accessibilityConfig = this.getDefaultAccessibilityConfig();
    this.menuState = this.getDefaultMenuState();
    this.dialogueState = this.getDefaultDialogueState();
  }

  // ========== 테마 관리 ==========

  private getDefaultTheme(): UITheme {
    return {
      id: 'kpop_default',
      name: 'K-pop Default',
      colors: {
        primary: '#FF6B9D',
        secondary: '#A855F7',
        accent: '#FFD700',
        background: '#1A1B23',
        surface: '#2D2E37',
        text: '#FFFFFF',
        textSecondary: '#B8BCC8',
        border: '#404152',
        shadow: 'rgba(0, 0, 0, 0.25)',
        danger: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B'
      },
      fonts: {
        primary: '"Noto Sans KR", sans-serif',
        secondary: '"Roboto", sans-serif',
        dialogue: '"Noto Sans KR", serif',
        ui: '"Roboto", sans-serif'
      },
      borderRadius: '8px',
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px'
      },
      shadows: {
        small: '0 2px 4px rgba(0, 0, 0, 0.1)',
        medium: '0 4px 8px rgba(0, 0, 0, 0.15)',
        large: '0 8px 16px rgba(0, 0, 0, 0.2)'
      }
    };
  }

  setTheme(theme: UITheme): void {
    this.currentTheme = theme;
    this.applyTheme();
    this.emit('themeChanged', theme);
  }

  getTheme(): UITheme {
    return { ...this.currentTheme };
  }

  private applyTheme(): void {
    const root = document.documentElement;

    // CSS 커스텀 프로퍼티 업데이트
    Object.entries(this.currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    Object.entries(this.currentTheme.fonts).forEach(([key, value]) => {
      root.style.setProperty(`--font-${key}`, value);
    });

    root.style.setProperty('--border-radius', this.currentTheme.borderRadius);

    Object.entries(this.currentTheme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    Object.entries(this.currentTheme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });
  }

  getAvailableThemes(): UITheme[] {
    return [
      this.getDefaultTheme(),
      {
        ...this.getDefaultTheme(),
        id: 'dark_hunter',
        name: 'Dark Hunter',
        colors: {
          ...this.getDefaultTheme().colors,
          primary: '#8B5CF6',
          background: '#0F0F14',
          surface: '#1A1B23'
        }
      },
      {
        ...this.getDefaultTheme(),
        id: 'light_mode',
        name: 'Light Mode',
        colors: {
          ...this.getDefaultTheme().colors,
          background: '#FFFFFF',
          surface: '#F8FAFC',
          text: '#1F2937',
          textSecondary: '#6B7280',
          border: '#E5E7EB'
        }
      }
    ];
  }

  // ========== 대화창 관리 ==========

  private getDefaultDialogueConfig(): DialogueBoxConfig {
    return {
      style: 'modern',
      position: 'bottom',
      width: 90,
      height: 25,
      opacity: 0.95,
      textSpeed: 30,
      autoAdvanceDelay: 3000,
      showCharacterName: true,
      showCharacterPortrait: true,
      enableTypewriterEffect: true,
      backgroundBlur: 5
    };
  }

  setDialogueConfig(config: Partial<DialogueBoxConfig>): void {
    this.dialogueConfig = { ...this.dialogueConfig, ...config };
    this.emit('dialogueConfigChanged', this.dialogueConfig);
  }

  getDialogueConfig(): DialogueBoxConfig {
    return { ...this.dialogueConfig };
  }

  async showDialogue(
    text: string,
    characterName?: string,
    characterPortrait?: string,
    choices?: DialogueChoice[]
  ): Promise<void> {
    this.dialogueState = {
      isVisible: true,
      currentText: text,
      displayedText: '',
      characterName: characterName || '',
      characterPortrait: characterPortrait || '',
      isTyping: true,
      hasMoreText: false,
      choices: choices || [],
      canSkip: true,
      autoMode: false
    };

    if (this.dialogueConfig.enableTypewriterEffect) {
      await this.typewriterEffect(text);
    } else {
      this.dialogueState.displayedText = text;
      this.dialogueState.isTyping = false;
    }

    this.emit('dialogueShown', this.dialogueState);
  }

  private async typewriterEffect(text: string): Promise<void> {
    const delay = 1000 / this.dialogueConfig.textSpeed;
    let index = 0;

    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (index < text.length) {
          this.dialogueState.displayedText += text[index];
          index++;
          this.emit('dialogueTextUpdated', this.dialogueState);
        } else {
          clearInterval(timer);
          this.dialogueState.isTyping = false;
          this.emit('dialogueTextComplete', this.dialogueState);
          resolve();
        }
      }, delay);
    });
  }

  skipDialogueAnimation(): void {
    if (this.dialogueState.isTyping) {
      this.dialogueState.displayedText = this.dialogueState.currentText;
      this.dialogueState.isTyping = false;
      this.emit('dialogueTextComplete', this.dialogueState);
    }
  }

  hideDialogue(): void {
    this.dialogueState.isVisible = false;
    this.emit('dialogueHidden');
  }

  getDialogueState(): DialogueState {
    return { ...this.dialogueState };
  }

  // ========== 메뉴 관리 ==========

  private getDefaultMenuState(): MenuState {
    return {
      currentMenu: null,
      previousMenu: null,
      isVisible: false,
      isAnimating: false,
      quickMenuVisible: false
    };
  }

  async showMenu(menuType: MenuState['currentMenu'], animated: boolean = true): Promise<void> {
    if (this.menuState.isAnimating) return;

    this.menuState.previousMenu = this.menuState.currentMenu;
    this.menuState.currentMenu = menuType;
    this.menuState.isVisible = true;

    if (animated) {
      this.menuState.isAnimating = true;
      await this.playAnimation('menu-fade-in', {
        id: 'menu-show',
        type: 'fadeIn',
        duration: 300,
        easing: 'ease-out'
      });
      this.menuState.isAnimating = false;
    }

    this.emit('menuShown', menuType);
  }

  async hideMenu(animated: boolean = true): Promise<void> {
    if (this.menuState.isAnimating) return;

    if (animated) {
      this.menuState.isAnimating = true;
      await this.playAnimation('menu-fade-out', {
        id: 'menu-hide',
        type: 'fadeOut',
        duration: 300,
        easing: 'ease-in'
      });
      this.menuState.isAnimating = false;
    }

    this.menuState.currentMenu = null;
    this.menuState.isVisible = false;
    this.emit('menuHidden');
  }

  async navigateToMenu(menuType: MenuState['currentMenu'], animated: boolean = true): Promise<void> {
    if (this.menuState.currentMenu) {
      await this.hideMenu(animated);
    }
    await this.showMenu(menuType, animated);
  }

  toggleQuickMenu(): void {
    this.menuState.quickMenuVisible = !this.menuState.quickMenuVisible;
    this.emit('quickMenuToggled', this.menuState.quickMenuVisible);
  }

  getMenuState(): MenuState {
    return { ...this.menuState };
  }

  // ========== 레이아웃 관리 ==========

  private getDefaultLayoutConfig(): UILayoutConfig {
    return {
      showStatusBar: true,
      showQuickMenu: true,
      showProgressBar: true,
      characterPortraitSize: 'medium',
      backgroundDimming: 30,
      menuAnimationSpeed: 'normal',
      transitionEffects: true
    };
  }

  setLayoutConfig(config: Partial<UILayoutConfig>): void {
    this.layoutConfig = { ...this.layoutConfig, ...config };
    this.applyLayoutConfig();
    this.emit('layoutConfigChanged', this.layoutConfig);
  }

  getLayoutConfig(): UILayoutConfig {
    return { ...this.layoutConfig };
  }

  private applyLayoutConfig(): void {
    // CSS 클래스 및 스타일 적용
    const root = document.documentElement;

    root.style.setProperty('--background-dimming', `${this.layoutConfig.backgroundDimming}%`);

    // 포트레이트 크기 설정
    const portraitSizes = {
      small: '80px',
      medium: '120px',
      large: '160px'
    };
    root.style.setProperty('--portrait-size', portraitSizes[this.layoutConfig.characterPortraitSize]);

    // 애니메이션 속도 설정
    const animationSpeeds = {
      slow: '0.5s',
      normal: '0.3s',
      fast: '0.15s'
    };
    root.style.setProperty('--animation-speed', animationSpeeds[this.layoutConfig.menuAnimationSpeed]);
  }

  // ========== 접근성 관리 ==========

  private getDefaultAccessibilityConfig(): AccessibilityConfig {
    return {
      fontSize: 100,
      highContrast: false,
      reduceMotion: false,
      screenReaderSupport: false,
      colorBlindSupport: 'none',
      subtitles: false,
      voiceOverEnabled: false
    };
  }

  setAccessibilityConfig(config: Partial<AccessibilityConfig>): void {
    this.accessibilityConfig = { ...this.accessibilityConfig, ...config };
    this.applyAccessibilityConfig();
    this.emit('accessibilityConfigChanged', this.accessibilityConfig);
  }

  getAccessibilityConfig(): AccessibilityConfig {
    return { ...this.accessibilityConfig };
  }

  private applyAccessibilityConfig(): void {
    const root = document.documentElement;

    // 폰트 크기 적용
    root.style.setProperty('--font-scale', `${this.accessibilityConfig.fontSize}%`);

    // 고대비 모드
    if (this.accessibilityConfig.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // 모션 감소
    if (this.accessibilityConfig.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // 색맹 지원
    root.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
    if (this.accessibilityConfig.colorBlindSupport !== 'none') {
      root.classList.add(this.accessibilityConfig.colorBlindSupport);
    }
  }

  // ========== 애니메이션 시스템 ==========

  async playAnimation(elementId: string, animation: UIAnimation): Promise<void> {
    this.activeAnimations.set(elementId, animation);

    return new Promise((resolve) => {
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / animation.duration, 1);

        // 애니메이션 적용 (실제로는 DOM 조작)
        this.applyAnimationFrame(elementId, animation, progress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          this.activeAnimations.delete(elementId);
          resolve();
        }
      };

      setTimeout(() => {
        requestAnimationFrame(animate);
      }, animation.delay || 0);
    });
  }

  private applyAnimationFrame(elementId: string, animation: UIAnimation, progress: number): void {
    // 실제 DOM 요소에 애니메이션 적용
    const element = document.getElementById(elementId);
    if (!element) return;

    const easedProgress = this.applyEasing(progress, animation.easing);

    switch (animation.type) {
      case 'fadeIn':
        element.style.opacity = easedProgress.toString();
        break;
      case 'fadeOut':
        element.style.opacity = (1 - easedProgress).toString();
        break;
      case 'slideIn':
        const slideDistance = 100;
        const offset = slideDistance * (1 - easedProgress);
        element.style.transform = `translateY(${offset}px)`;
        break;
      case 'scale':
        const scale = 0.8 + (0.2 * easedProgress);
        element.style.transform = `scale(${scale})`;
        break;
      // 추가 애니메이션 타입들...
    }
  }

  private applyEasing(progress: number, easing: UIAnimation['easing']): number {
    switch (easing) {
      case 'ease-in':
        return progress * progress;
      case 'ease-out':
        return 1 - (1 - progress) * (1 - progress);
      case 'ease-in-out':
        return progress < 0.5
          ? 2 * progress * progress
          : 1 - 2 * (1 - progress) * (1 - progress);
      case 'bounce':
        const n1 = 7.5625;
        const d1 = 2.75;
        if (progress < 1 / d1) {
          return n1 * progress * progress;
        } else if (progress < 2 / d1) {
          return n1 * (progress -= 1.5 / d1) * progress + 0.75;
        } else if (progress < 2.5 / d1) {
          return n1 * (progress -= 2.25 / d1) * progress + 0.9375;
        } else {
          return n1 * (progress -= 2.625 / d1) * progress + 0.984375;
        }
      default:
        return progress;
    }
  }

  stopAnimation(elementId: string): void {
    this.activeAnimations.delete(elementId);
  }

  // ========== 알림 시스템 ==========

  showNotification(notification: Omit<NotificationMessage, 'id'>): string {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullNotification: NotificationMessage = { ...notification, id };

    this.notifications.push(fullNotification);

    // 자동 제거 타이머
    if (notification.duration) {
      setTimeout(() => {
        this.hideNotification(id);
      }, notification.duration);
    }

    this.emit('notificationShown', fullNotification);
    return id;
  }

  hideNotification(id: string): void {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      const notification = this.notifications.splice(index, 1)[0];
      this.emit('notificationHidden', notification);
    }
  }

  getNotifications(): NotificationMessage[] {
    return [...this.notifications];
  }

  clearAllNotifications(): void {
    this.notifications.length = 0;
    this.emit('notificationsCleared');
  }

  // ========== 진행도 표시 ==========

  showProgress(info: ProgressInfo): void {
    this.emit('progressShown', info);
  }

  updateProgress(info: Partial<ProgressInfo>): void {
    this.emit('progressUpdated', info);
  }

  hideProgress(): void {
    this.emit('progressHidden');
  }

  // ========== 이벤트 시스템 ==========

  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, ...args: any[]): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(...args));
    }
  }

  // ========== 저장/로드 ==========

  getUISettings(): any {
    return {
      theme: this.currentTheme,
      dialogueConfig: this.dialogueConfig,
      layoutConfig: this.layoutConfig,
      accessibilityConfig: this.accessibilityConfig
    };
  }

  loadUISettings(settings: any): void {
    if (settings.theme) {
      this.setTheme(settings.theme);
    }
    if (settings.dialogueConfig) {
      this.setDialogueConfig(settings.dialogueConfig);
    }
    if (settings.layoutConfig) {
      this.setLayoutConfig(settings.layoutConfig);
    }
    if (settings.accessibilityConfig) {
      this.setAccessibilityConfig(settings.accessibilityConfig);
    }
  }

  // ========== 반응형 디자인 ==========

  getScreenSize(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  adaptToScreenSize(): void {
    const screenSize = this.getScreenSize();

    // 화면 크기에 따른 레이아웃 조정
    const adaptiveConfig: Partial<UILayoutConfig> = {};

    if (screenSize === 'mobile') {
      adaptiveConfig.characterPortraitSize = 'small';
      adaptiveConfig.showStatusBar = false;
    } else if (screenSize === 'tablet') {
      adaptiveConfig.characterPortraitSize = 'medium';
      adaptiveConfig.showStatusBar = true;
    }

    if (Object.keys(adaptiveConfig).length > 0) {
      this.setLayoutConfig(adaptiveConfig);
    }

    this.emit('screenSizeChanged', screenSize);
  }

  // ========== 디버그 기능 ==========

  debugShowAllAnimations(): void {
    if (process.env.NODE_ENV === 'development') {
      console.log('Active animations:', Array.from(this.activeAnimations.entries()));
    }
  }

  debugTriggerNotification(type: NotificationMessage['type']): void {
    if (process.env.NODE_ENV === 'development') {
      this.showNotification({
        type,
        title: `Debug ${type}`,
        message: `This is a debug ${type} notification`,
        duration: 3000
      });
    }
  }

  private getDefaultDialogueState(): DialogueState {
    return {
      isVisible: false,
      currentText: '',
      displayedText: '',
      characterName: '',
      characterPortrait: '',
      isTyping: false,
      hasMoreText: false,
      choices: [],
      canSkip: false,
      autoMode: false
    };
  }
}

export default UIUXAgent;