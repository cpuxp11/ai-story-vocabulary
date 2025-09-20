/**
 * Character Agent
 *
 * Purpose: 캐릭터 시스템, 감정 표현, 애니메이션 관리
 * Capabilities:
 * - 캐릭터 감정 상태 및 표현 관리
 * - 캐릭터 애니메이션 및 이동 시스템
 * - 호감도 및 관계 시스템
 * - 캐릭터 의상 및 외형 변경
 * - 립싱크 및 음성 동기화
 * - 캐릭터별 고유 특성 및 능력
 */

import { Character, GameState } from '../k-pop-demon-hunters_-a-visual-novel/types';

export interface CharacterEmotion {
  id: string;
  name: string;
  intensity: number; // 0-100
  duration?: number; // ms, undefined = permanent until changed
  blendable?: boolean; // 다른 감정과 블렌딩 가능 여부
}

export interface CharacterExpression {
  eyes: 'normal' | 'happy' | 'sad' | 'angry' | 'surprised' | 'closed' | 'winking';
  mouth: 'normal' | 'smile' | 'frown' | 'open' | 'shocked' | 'smirk';
  eyebrows: 'normal' | 'raised' | 'furrowed' | 'worried';
  blush?: 'none' | 'light' | 'medium' | 'heavy';
  special?: 'tears' | 'sweat' | 'sparkles' | 'dark_aura' | 'demon_mark';
}

export interface CharacterPose {
  id: string;
  name: string;
  position: { x: number; y: number; z?: number };
  scale: number;
  rotation: number;
  anchorPoint: 'left' | 'center' | 'right';
  layer: number; // 렌더링 순서
}

export interface CharacterOutfit {
  id: string;
  name: string;
  description: string;
  parts: {
    hair?: string;
    top?: string;
    bottom?: string;
    accessories?: string[];
    special?: string; // 악령 문양, 헌터 의상 등
  };
  unlockCondition?: string;
}

export interface CharacterStats {
  affection: number; // 호감도 (-100 ~ 100)
  trust: number; // 신뢰도 (0 ~ 100)
  suspicion: number; // 의심도 (0 ~ 100)
  hunterPower?: number; // 헌터 파워 (헌트릭스 멤버만)
  demonInfluence?: number; // 악령 영향도 (루미, 진우 등)
}

export interface CharacterRelationship {
  characterId: string;
  relationshipType: 'friend' | 'rival' | 'romance' | 'enemy' | 'neutral' | 'family';
  strength: number; // -100 ~ 100
  history: RelationshipEvent[];
}

export interface RelationshipEvent {
  id: string;
  type: 'positive' | 'negative' | 'neutral';
  impact: number;
  description: string;
  timestamp: number;
  sceneId?: string;
}

export interface CharacterAnimation {
  id: string;
  type: 'idle' | 'talking' | 'thinking' | 'happy' | 'sad' | 'angry' | 'surprised' | 'special';
  duration: number;
  loop: boolean;
  frames?: string[]; // 스프라이트 프레임들
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce';
  effects?: AnimationEffect[];
}

export interface AnimationEffect {
  type: 'shake' | 'glow' | 'fade' | 'slide' | 'scale' | 'rotate' | 'color_change';
  intensity: number;
  duration: number;
  delay?: number;
}

export interface CharacterProfile {
  id: string;
  name: string;
  koreanName: string;
  age: number;
  height: string;
  position?: string; // K-pop 포지션 (메인보컬, 래퍼 등)
  personality: string[];
  background: string;
  specialAbility?: string;
  voiceActor?: {
    korean?: string;
    japanese?: string;
    english?: string;
  };
  psychProfile?: {
    coreDesire: string;
    coreFear: string;
    defenseMode: string;
    stressResponse: string;
  };
  languagePattern?: {
    sentenceStructure: string;
    vocabulary: string[];
    speechHabits: string[];
    signaturePhrases: string[];
  };
}

export interface LipSyncData {
  phonemes: Array<{
    time: number; // 시간 (ms)
    phoneme: string; // 음소
    mouth: string; // 입 모양
  }>;
  duration: number;
}

export class CharacterAgent {
  private characters: Map<string, CharacterProfile> = new Map();
  private characterStats: Map<string, CharacterStats> = new Map();
  private characterRelationships: Map<string, CharacterRelationship[]> = new Map();
  private currentExpressions: Map<string, CharacterExpression> = new Map();
  private currentPoses: Map<string, CharacterPose> = new Map();
  private currentOutfits: Map<string, CharacterOutfit> = new Map();
  private currentAnimations: Map<string, CharacterAnimation> = new Map();
  private characterEmotions: Map<string, CharacterEmotion[]> = new Map();

  constructor() {
    this.initializeCharacters();
  }

  // ========== 캐릭터 초기화 ==========

  private initializeCharacters(): void {
    // 헌트릭스 멤버들
    this.addCharacter({
      id: 'rumi',
      name: 'Rumi',
      koreanName: '루미',
      age: 22,
      height: '165cm',
      position: 'HUNTR/X 리더, 메인보컬',
      personality: ['완벽주의자', '책임감 강함', '리더십', '비밀주의', '목표지향성', '취약성 숨김'],
      background: '헌터와 악령의 혼혈로 악마의 패턴을 숨긴 채 완벽한 헌터가 되려 하지만, 자신의 불완전함을 수용하며 진정한 리더로 성장하는 인물.',
      specialAbility: '황금 혼문 생성',
      voiceActor: { korean: '미정' },
      psychProfile: {
        coreDesire: '자기완성, 인정',
        coreFear: '정체성 발각으로 인한 배척',
        defenseMode: '억압, 합리화',
        stressResponse: '사적인 노출 회피, 계획 통제 강화'
      },
      languagePattern: {
        sentenceStructure: '선언적, 지시적 문장',
        vocabulary: ['fans', 'Honmoon', 'duty', 'fix', 'patterns', 'hiding', 'strong'],
        speechHabits: ['그건...', '일단은...'],
        signaturePhrases: [
          'Okay, this is our biggest show yet.',
          'Our fans deserve the best.',
          'How am I supposed to fix the world, fix me, when I don\'t have my voice?',
          'Because if there\'s no hope for you, what hope is there for me?'
        ]
      }
    });

    this.addCharacter({
      id: 'mira',
      name: 'Mira',
      koreanName: '미라',
      age: 21,
      height: '162cm',
      position: 'HUNTR/X 리드댄서, 행동대장',
      personality: ['행동파', '직설적', '불신', '충성심', '츤데레', '현실주의'],
      background: '과거의 상처로 인해 타인을 불신하지만, HUNTR/X라는 가족을 지키기 위해 싸우며 진정한 신뢰를 배워가는 인물.',
      specialAbility: '방어막 혼문',
      voiceActor: { korean: '미정' },
      psychProfile: {
        coreDesire: '진실성, 안정적인 소속감',
        coreFear: '배신, 믿었던 가족에게 버림받는 것',
        defenseMode: '냉소주의, 투사',
        stressResponse: '공격성 표출, 관계 단절 선언'
      },
      languagePattern: {
        sentenceStructure: '짧고 간결한 단정적 문장, 반어법',
        vocabulary: ['demon', 'kill', 'die', 'hurt', 'smash', 'face'],
        speechHabits: ['Yeah.', 'No.'],
        signaturePhrases: [
          'Aww, you got the patterns. Now you gotta die.',
          'A demon\'s a demon. We kill them.',
          'Yep, about as legit as I expected.',
          'I\'m kind of a difficult person... But somehow, with you guys, they\'re okay.'
        ]
      }
    });

    this.addCharacter({
      id: 'joy',
      name: 'Zoey',
      koreanName: '조이',
      age: 19,
      height: '158cm',
      position: 'HUNTR/X 래퍼, 작사가, 막내',
      personality: ['긍정', '분위기메이커', '순수', '소속감 갈망', '반전매력'],
      background: '팀의 분위기 메이커이자 중재자. 자신의 재능이 팀에 기여하며 소속감을 느끼고, 갈등 속에서도 긍정의 힘으로 동료들을 하나로 묶으려 노력함.',
      specialAbility: '스피드 부스트 혼문',
      voiceActor: { korean: '미정' },
      psychProfile: {
        coreDesire: '소속감, 인정',
        coreFear: '팀에서 겉도는 것, 쓸모없어지는 것',
        defenseMode: '과잉 긍정',
        stressResponse: '안절부절못함, 중재 시도, 극심한 스트레스 시 울음'
      },
      languagePattern: {
        sentenceStructure: '감탄문, 짧고 활기찬 문장',
        vocabulary: ['Yay!', 'exciting', 'totally', 'happy fans', 'together', 'couch'],
        speechHabits: ['wewaxy time', 'Caw-caw!'],
        signaturePhrases: [
          'It\'s so exciting!',
          'Happy fans, happy Honmoon!',
          'Hey, we\'ll get through this. We can get through anything. Together.',
          'THEY WILL FACE MY WRATH!'
        ]
      }
    });

    // 사자 보이즈
    this.addCharacter({
      id: 'jinwoo',
      name: 'Jinu',
      koreanName: '진우',
      age: 25,
      height: '178cm',
      position: '사자 보이즈 리더, 메인보컬',
      personality: ['이중성', '죄책감', '비극적', '매력', '냉소적', '체념적'],
      background: '400년 전 조선시대 음악가였으나 가족을 먹여 살리기 위해 귀마와 거래했고, 결국 가족을 비참하게 만들고 자신은 악령이 되었다. 루미를 만나며 구원의 가능성을 찾는 비극적 인물.',
      specialAbility: '마음 조작 혼문',
      voiceActor: { korean: '미정' },
      psychProfile: {
        coreDesire: '구원, 죄책감으로부터의 해방',
        coreFear: '자신의 과오를 영원히 마주하는 것',
        defenseMode: '냉소주의, 합리화',
        stressResponse: '귀마에게 정신적 위축, 루미 앞에서 능글맞게 행동'
      },
      languagePattern: {
        sentenceStructure: '(아이돌 모드) 짧고 자신감 있는 문장 / (진심 모드) 길고 서사적인 문장',
        vocabulary: ['shame', 'misery', 'memories', 'escape', 'mistake', 'voices'],
        speechHabits: ['(아이돌) 부드럽고 능글맞은 톤', '(진심) 낮고 차분하며 슬픔이 묻어나는 톤'],
        signaturePhrases: [
          'Watch yourself.',
          'Saja Boys love you!',
          'These are a constant reminder of my shame. A shame I can never escape.',
          'For what it\'s worth, I don\'t think you\'re a mistake.',
          'You did. You gave me my soul back. And now... I give it to you.'
        ]
      }
    });

    this.addCharacter({
      id: 'gwima',
      name: 'Gwi-Ma',
      koreanName: '귀마',
      age: 9999,
      height: '???',
      position: '악마의 왕, 메인 빌런',
      personality: ['절대악', '지배욕', '통제', '심리조작', '무자비', '폭군'],
      background: '세상의 모든 존재를 자신의 통제 아래 두고 그들의 절망과 수치심을 양분으로 삼으려는 절대악. 심리적 조작을 통해 상대의 약점을 끊임없이 상기시켜 스스로를 파괴하게 만든다.',
      specialAbility: '절망 조작, 정신 지배',
      voiceActor: { korean: '미정' },
      psychProfile: {
        coreDesire: '절대적 통제와 지배',
        coreFear: '통제력 상실, 존재의 소멸',
        defenseMode: '심리적 조작(Gaslighting)',
        stressResponse: '실패한 부하에 대한 즉각적이고 무자비한 처벌'
      },
      languagePattern: {
        sentenceStructure: '대문자로 표현되는 짧고 단정적인 명령문과 질책',
        vocabulary: ['WEAK', 'PATHETIC', 'USELESS', 'IDIOTS', 'SHAME', 'ESCAPE'],
        speechHabits: ['모든 단어에 경멸과 분노를 담은 굵고 울리는 톤'],
        signaturePhrases: [
          'I UNDERSTAND YOU ARE WEAK!',
          'PATHETIC! USELESS! ALL OF YOU!!!',
          'You betrayed your own family. ... Don\'t forget about our deal, Jinu...',
          'You think you can fix the world? You can\'t even fix yourself.'
        ]
      }
    });

    // 기본 스탯 초기화
    this.initializeCharacterStats();
  }

  private initializeCharacterStats(): void {
    const defaultStats: CharacterStats = {
      affection: 0,
      trust: 50,
      suspicion: 0
    };

    this.characters.forEach((_, characterId) => {
      const stats = { ...defaultStats };

      // 캐릭터별 특수 스탯 설정
      if (['rumi', 'mira', 'joy'].includes(characterId)) {
        stats.hunterPower = 70;
      }

      if (['rumi', 'jinwoo'].includes(characterId)) {
        stats.demonInfluence = characterId === 'rumi' ? 30 : 80;
      }

      this.characterStats.set(characterId, stats);
    });
  }

  // ========== 캐릭터 관리 ==========

  addCharacter(profile: CharacterProfile): void {
    this.characters.set(profile.id, profile);

    if (!this.characterStats.has(profile.id)) {
      this.characterStats.set(profile.id, {
        affection: 0,
        trust: 50,
        suspicion: 0
      });
    }
  }

  getCharacter(characterId: string): CharacterProfile | null {
    return this.characters.get(characterId) || null;
  }

  getAllCharacters(): CharacterProfile[] {
    return Array.from(this.characters.values());
  }

  // ========== 감정 및 표현 관리 ==========

  setCharacterExpression(characterId: string, expression: Partial<CharacterExpression>): void {
    const currentExpression = this.currentExpressions.get(characterId) || {
      eyes: 'normal',
      mouth: 'normal',
      eyebrows: 'normal',
      blush: 'none'
    };

    const newExpression = { ...currentExpression, ...expression };
    this.currentExpressions.set(characterId, newExpression);
  }

  getCharacterExpression(characterId: string): CharacterExpression | null {
    return this.currentExpressions.get(characterId) || null;
  }

  setCharacterEmotion(characterId: string, emotion: CharacterEmotion): void {
    const emotions = this.characterEmotions.get(characterId) || [];

    // 블렌딩 불가능한 감정이면 기존 감정들 제거
    if (!emotion.blendable) {
      emotions.length = 0;
    }

    emotions.push(emotion);
    this.characterEmotions.set(characterId, emotions);

    // 감정에 따른 표현 자동 설정
    this.applyEmotionToExpression(characterId, emotion);

    // 지속시간이 있으면 타이머 설정
    if (emotion.duration) {
      setTimeout(() => {
        this.removeCharacterEmotion(characterId, emotion.id);
      }, emotion.duration);
    }
  }

  private applyEmotionToExpression(characterId: string, emotion: CharacterEmotion): void {
    const expressionMap: Record<string, Partial<CharacterExpression>> = {
      'happy': { eyes: 'happy', mouth: 'smile', eyebrows: 'normal' },
      'sad': { eyes: 'sad', mouth: 'frown', eyebrows: 'worried' },
      'angry': { eyes: 'angry', mouth: 'frown', eyebrows: 'furrowed' },
      'surprised': { eyes: 'surprised', mouth: 'open', eyebrows: 'raised' },
      'embarrassed': { eyes: 'normal', mouth: 'normal', eyebrows: 'normal', blush: 'medium' },
      'determined': { eyes: 'normal', mouth: 'normal', eyebrows: 'furrowed' },
      'worried': { eyes: 'sad', mouth: 'frown', eyebrows: 'worried' },
      'confused': { eyes: 'normal', mouth: 'normal', eyebrows: 'raised' }
    };

    const expression = expressionMap[emotion.id];
    if (expression) {
      this.setCharacterExpression(characterId, expression);
    }
  }

  removeCharacterEmotion(characterId: string, emotionId: string): void {
    const emotions = this.characterEmotions.get(characterId) || [];
    const filteredEmotions = emotions.filter(e => e.id !== emotionId);
    this.characterEmotions.set(characterId, filteredEmotions);
  }

  getCharacterEmotions(characterId: string): CharacterEmotion[] {
    return this.characterEmotions.get(characterId) || [];
  }

  // ========== 포즈 및 애니메이션 ==========

  setCharacterPose(characterId: string, pose: CharacterPose): void {
    this.currentPoses.set(characterId, pose);
  }

  getCharacterPose(characterId: string): CharacterPose | null {
    return this.currentPoses.get(characterId) || null;
  }

  playCharacterAnimation(characterId: string, animation: CharacterAnimation): Promise<void> {
    return new Promise((resolve) => {
      this.currentAnimations.set(characterId, animation);

      // 애니메이션 효과 적용
      if (animation.effects) {
        animation.effects.forEach(effect => {
          setTimeout(() => {
            this.applyAnimationEffect(characterId, effect);
          }, effect.delay || 0);
        });
      }

      // 애니메이션 완료 시 해결
      setTimeout(() => {
        if (!animation.loop) {
          this.currentAnimations.delete(characterId);
        }
        resolve();
      }, animation.duration);
    });
  }

  private applyAnimationEffect(characterId: string, effect: AnimationEffect): void {
    // 실제 DOM 조작이나 캔버스 효과는 렌더링 레이어에서 처리
    console.log(`Applying ${effect.type} effect to ${characterId}`);
  }

  stopCharacterAnimation(characterId: string): void {
    this.currentAnimations.delete(characterId);
  }

  getCurrentAnimation(characterId: string): CharacterAnimation | null {
    return this.currentAnimations.get(characterId) || null;
  }

  // ========== 의상 및 외형 ==========

  setCharacterOutfit(characterId: string, outfit: CharacterOutfit): boolean {
    // 잠금 해제 조건 확인
    if (outfit.unlockCondition) {
      // 실제로는 게임 상태를 확인하는 로직
      console.log(`Checking unlock condition: ${outfit.unlockCondition}`);
    }

    this.currentOutfits.set(characterId, outfit);
    return true;
  }

  getCharacterOutfit(characterId: string): CharacterOutfit | null {
    return this.currentOutfits.get(characterId) || null;
  }

  getAvailableOutfits(characterId: string): CharacterOutfit[] {
    // 실제로는 데이터베이스나 설정에서 로드
    return [];
  }

  // ========== 스탯 및 관계 시스템 ==========

  getCharacterStats(characterId: string): CharacterStats | null {
    return this.characterStats.get(characterId) || null;
  }

  updateCharacterStat(characterId: string, stat: keyof CharacterStats, change: number): void {
    const stats = this.characterStats.get(characterId);
    if (!stats) return;

    const currentValue = stats[stat] as number || 0;
    let newValue = currentValue + change;

    // 스탯 범위 제한
    if (stat === 'affection') {
      newValue = Math.max(-100, Math.min(100, newValue));
    } else {
      newValue = Math.max(0, Math.min(100, newValue));
    }

    (stats[stat] as number) = newValue;

    // 스탯 변경에 따른 이벤트 트리거
    this.onStatChanged(characterId, stat, currentValue, newValue);
  }

  private onStatChanged(characterId: string, stat: keyof CharacterStats, oldValue: number, newValue: number): void {
    // 중요한 스탯 변화에 대한 반응
    if (stat === 'affection') {
      if (newValue >= 80 && oldValue < 80) {
        console.log(`${characterId} affection reached high level!`);
      } else if (newValue <= -50 && oldValue > -50) {
        console.log(`${characterId} affection reached low level!`);
      }
    }

    if (stat === 'demonInfluence' && characterId === 'rumi') {
      if (newValue >= 70 && oldValue < 70) {
        console.log('Rumi demon influence critical!');
        // 악령 문양 표시 등
        this.setCharacterExpression('rumi', { special: 'demon_mark' });
      }
    }
  }

  addRelationshipEvent(characterId1: string, characterId2: string, event: Omit<RelationshipEvent, 'id' | 'timestamp'>): void {
    const eventWithMeta: RelationshipEvent = {
      ...event,
      id: `rel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    // 양방향 관계 업데이트
    this.updateRelationship(characterId1, characterId2, eventWithMeta);
    this.updateRelationship(characterId2, characterId1, eventWithMeta);
  }

  private updateRelationship(fromCharacter: string, toCharacter: string, event: RelationshipEvent): void {
    const relationships = this.characterRelationships.get(fromCharacter) || [];
    let relationship = relationships.find(r => r.characterId === toCharacter);

    if (!relationship) {
      relationship = {
        characterId: toCharacter,
        relationshipType: 'neutral',
        strength: 0,
        history: []
      };
      relationships.push(relationship);
    }

    relationship.history.push(event);
    relationship.strength += event.impact;

    // 관계 강도에 따른 타입 자동 업데이트
    this.updateRelationshipType(relationship);

    this.characterRelationships.set(fromCharacter, relationships);
  }

  private updateRelationshipType(relationship: CharacterRelationship): void {
    const strength = relationship.strength;

    if (strength > 70) {
      relationship.relationshipType = 'friend';
    } else if (strength < -50) {
      relationship.relationshipType = 'enemy';
    } else if (strength > 30) {
      relationship.relationshipType = 'neutral';
    }
  }

  getRelationship(characterId1: string, characterId2: string): CharacterRelationship | null {
    const relationships = this.characterRelationships.get(characterId1) || [];
    return relationships.find(r => r.characterId === characterId2) || null;
  }

  // ========== 음성 및 립싱크 ==========

  async playCharacterVoice(characterId: string, audioUrl: string, lipSyncData?: LipSyncData): Promise<void> {
    // 음성 재생 (실제로는 오디오 시스템과 연동)
    console.log(`Playing voice for ${characterId}: ${audioUrl}`);

    if (lipSyncData) {
      await this.syncLipMovement(characterId, lipSyncData);
    }
  }

  private async syncLipMovement(characterId: string, lipSyncData: LipSyncData): Promise<void> {
    const startTime = Date.now();

    for (const phoneme of lipSyncData.phonemes) {
      const delay = phoneme.time - (Date.now() - startTime);

      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      // 입 모양 변경
      this.setCharacterExpression(characterId, { mouth: phoneme.mouth as any });
    }

    // 립싱크 완료 후 기본 입 모양으로 복원
    this.setCharacterExpression(characterId, { mouth: 'normal' });
  }

  // ========== 특수 능력 및 이벤트 ==========

  triggerSpecialAbility(characterId: string): boolean {
    const character = this.getCharacter(characterId);
    if (!character?.specialAbility) return false;

    console.log(`${character.name} uses special ability: ${character.specialAbility}`);

    // 캐릭터별 특수 능력 효과
    switch (characterId) {
      case 'rumi':
        this.playCharacterAnimation(characterId, {
          id: 'golden_song',
          type: 'special',
          duration: 3000,
          loop: false,
          effects: [{ type: 'glow', intensity: 80, duration: 3000 }]
        });
        break;
      case 'mira':
        this.playCharacterAnimation(characterId, {
          id: 'barrier_creation',
          type: 'special',
          duration: 2000,
          loop: false,
          effects: [{ type: 'color_change', intensity: 50, duration: 2000 }]
        });
        break;
      case 'joy':
        this.playCharacterAnimation(characterId, {
          id: 'speed_boost',
          type: 'special',
          duration: 1500,
          loop: false,
          effects: [{ type: 'shake', intensity: 30, duration: 1500 }]
        });
        break;
    }

    return true;
  }

  // ========== 데이터 관리 ==========

  exportCharacterData(): any {
    return {
      characters: Array.from(this.characters.entries()),
      stats: Array.from(this.characterStats.entries()),
      relationships: Array.from(this.characterRelationships.entries()),
      expressions: Array.from(this.currentExpressions.entries()),
      poses: Array.from(this.currentPoses.entries()),
      outfits: Array.from(this.currentOutfits.entries())
    };
  }

  importCharacterData(data: any): void {
    if (data.characters) {
      this.characters = new Map(data.characters);
    }
    if (data.stats) {
      this.characterStats = new Map(data.stats);
    }
    if (data.relationships) {
      this.characterRelationships = new Map(data.relationships);
    }
    if (data.expressions) {
      this.currentExpressions = new Map(data.expressions);
    }
    if (data.poses) {
      this.currentPoses = new Map(data.poses);
    }
    if (data.outfits) {
      this.currentOutfits = new Map(data.outfits);
    }
  }

  // ========== 디버그 기능 ==========

  debugSetAffection(characterId: string, value: number): void {
    if (process.env.NODE_ENV === 'development') {
      const stats = this.characterStats.get(characterId);
      if (stats) {
        stats.affection = Math.max(-100, Math.min(100, value));
      }
    }
  }

  debugTriggerExpression(characterId: string, expression: CharacterExpression): void {
    if (process.env.NODE_ENV === 'development') {
      this.setCharacterExpression(characterId, expression);
    }
  }

  debugGetAllData(): any {
    if (process.env.NODE_ENV === 'development') {
      return this.exportCharacterData();
    }
  }
}

export default CharacterAgent;