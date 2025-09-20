import { GameData, Character } from './types';

// The character data, including sprites.
export const characters: { [id: string]: Omit<Character, 'id'> } = {
  'Rumi': {
    name: 'Rumi',
    sprites: {
      'neutral': './Rumi.png',
      'sad': './Rumi.png',
      'angry': './Rumi.png',
      'surprised': './Rumi.png'
    },
  },
  'Jinu': {
    name: 'Jinu',
    sprites: {
      'neutral': './Jinwoo.jpeg',
      'serious': './Jinwoo.jpeg',
      'sad': './Jinwoo.jpeg'
    },
  },
  'Mira': {
    name: 'Mira',
    sprites: {
      'neutral': './Mira.png'
    },
  },
  'Zoey': {
    name: 'Zoey',
    sprites: {
      'neutral': './Zoey.png'
    },
  },
  'Gwi-Ma': {
    name: 'Gwi-Ma',
    sprites: {
      'neutral': 'https://i.imgur.com/FwWk8c5.png' // 임시로 미라 이미지 사용
    },
  },
};

// Backgrounds
const BG_START = './3.background_start.jpg';    // 시작 배경
const BG_CONCERT_STAGE = './1.background.png';  // 콘서트 무대
const BG_BACKSTAGE = './2.background.png';      // 백스테이지
const BG_CLINIC = './1.background.png';         // 클리닉 배경
const BG_NIGHT_STREET = './2.background.png';   // 밤거리 배경
const BG_AWARDS = './3.background_start.jpg';   // 시상식 배경
const BG_NAMSAN_TOWER = 'https://i.imgur.com/vHqQwgA.jpg';

const enGameData: GameData = {
  // ========== 프롤로그: 헌터의 전설 ==========
  'prologue_intro': {
    background: BG_START,
    dialogue: [
      { character: 'Narrator', text: 'Long ago, there existed beings who could touch people\'s souls through song...' },
      { character: 'Narrator', text: 'They were called Hunters. With their voices, they created Soul Barriers - "Honmoon" - to protect humanity from demons.' },
      { character: 'Narrator', text: 'But demons, led by the fearsome Gwi-Ma, have grown stronger. Now, a new generation of Hunters must rise...' },
      { character: 'Narrator', text: 'This is the story of HUNTR/X - and their leader, Rumi.' },
    ],
    nextScene: 'world_tour_finale',
  },

  // ========== 헌트릭스의 이야기와 진우의 계략 ==========
  'world_tour_finale': {
    background: BG_CONCERT_STAGE,
    dialogue: [
      { character: 'Narrator', text: 'The roar of the crowd is deafening. This is it. The final show of HUNTR/X\'s world tour.' },
      { character: 'Mira', emotion: 'neutral', text: 'Okay, this is our biggest show yet.', position: 'left' },
      { character: 'Rumi', emotion: 'neutral', text: 'Our fans deserve the best.', position: 'center' },
      { character: 'Zoey', emotion: 'neutral', text: 'Happy fans, happy Honmoon!', position: 'right' },
      { character: 'Narrator', text: 'But during their flight to the venue, demons hijacked their plane...' },
    ],
    nextScene: 'plane_battle',
  },

  'plane_battle': {
    background: BG_NIGHT_STREET, // 임시 배경
    dialogue: [
      { character: 'Narrator', text: 'The plane splits in half, but HUNTR/X fights off the demons with ease.' },
      { character: 'Mira', emotion: 'neutral', text: 'Aww, you got the patterns. Now you gotta die.', position: 'left' },
      { character: 'Narrator', text: 'They land gracefully at the venue and perform flawlessly.' },
      { character: 'Rumi', emotion: 'neutral', text: 'The Honmoon... it\'s glowing golden!', position: 'center' },
      { character: 'Zoey', emotion: 'neutral', text: 'We\'re so close to completing the Golden Honmoon!', position: 'right' },
    ],
    nextScene: 'underground_world',
  },

  'underground_world': {
    background: BG_NIGHT_STREET, // 지하세계 배경 필요
    dialogue: [
      { character: 'Narrator', text: 'In the underground realm, Gwi-Ma punishes his failed demons.' },
      { character: 'Gwi-Ma', emotion: 'neutral', text: 'PATHETIC! USELESS! ALL OF YOU!!!', position: 'center' },
      { character: 'Narrator', text: 'Then, Jinu appears with a proposition.' },
      { character: 'Jinu', emotion: 'neutral', text: 'We can\'t win through direct confrontation. Let us compete as idols instead.', position: 'right' },
      { character: 'Gwi-Ma', emotion: 'neutral', text: 'Interesting... And what do you want in return?', position: 'left' },
      { character: 'Jinu', emotion: 'sad', text: 'Erase my memories of being human.', position: 'right' },
    ],
    nextScene: 'rumi_solo_decision',
  },

  // ========== Act 1: 루미의 갈등과 첫 만남 ==========
  'rumi_solo_decision': {
    background: BG_BACKSTAGE,
    dialogue: [
      { character: 'Narrator', text: 'Two weeks later, during their break, Rumi feels compelled to complete the Golden Honmoon.' },
      { character: 'Rumi', emotion: 'sad', text: '(My voice... it faltered during the show. The demon patterns are spreading.)', position: 'center' },
      { character: 'Rumi', emotion: 'sad', text: 'How am I supposed to fix the world, fix me, when I don\'t have my voice? Why? WHY!?', position: 'center' },
      { character: 'Narrator', text: 'Against her team\'s wishes, Rumi decides to release a solo single called "Golden".' },
    ],
    nextScene: 'stage_failure',
    onEnter: [
      { type: 'set', flag: 'CurseMark', value: 3 },
      { type: 'set', flag: 'TeamTrust', value: 70 }
    ]
  },

  'stage_failure': {
    background: BG_CONCERT_STAGE,
    dialogue: [
      { character: 'Narrator', text: 'But during the performance, the demon patterns become visible.' },
      { character: 'Rumi', emotion: 'surprised', text: 'No... not now...', position: 'center' },
      { character: 'Narrator', text: 'Rumi flees the stage, unable to sing. The fans are confused and worried.' },
      { character: 'Rumi', emotion: 'sad', text: 'These were supposed to be gone. You were never supposed to see!', position: 'center' },
    ],
    nextScene: 'clinic_meeting',
    onEnter: [
      { type: 'add', flag: 'CurseMark', value: 2 },
      { type: 'subtract', flag: 'TeamTrust', value: 20 }
    ]
  },

  // ========== Act 1: 첫 만남 (핵심 분기점) ==========
  'clinic_meeting': {
    background: BG_CLINIC,
    dialogue: [
      { character: 'Narrator', text: 'Mira and Zoey suggest visiting a traditional clinic.' },
      { character: 'Narrator', text: 'The scent of medicinal herbs hangs heavy in the air.' },
      { character: 'Rumi', emotion: 'sad', text: 'I hope this works... I can\'t let them see me like this.', position: 'left' },
      { character: 'Jinu', emotion: 'neutral', text: 'Hiding something?', position: 'right' },
      { character: 'Rumi', emotion: 'surprised', text: 'You! Jinu, from Saja Boys! What are you doing here?', position: 'left' },
      { character: 'Jinu', emotion: 'neutral', text: 'Perhaps the same as you. Looking for a cure.', position: 'right' },
      { character: 'Narrator', text: 'His eyes linger on her neck, where her collar barely hides the creeping demon patterns.' },
    ],
    nextScene: 'jinu_confrontation',
    onEnter: [
      { type: 'set', flag: 'JinwooMeet', value: true }
    ]
  },

  'jinu_confrontation': {
    background: BG_NIGHT_STREET,
    dialogue: [
      { character: 'Narrator', text: 'Later that week, Jinu corners Rumi after practice.' },
      { character: 'Jinu', emotion: 'serious', text: 'We need to talk. I know what you are.', position: 'right' },
      { character: 'Rumi', emotion: 'angry', text: 'I don\'t know what you\'re talking about.', position: 'left' },
      { character: 'Jinu', emotion: 'serious', text: 'Don\'t lie. I have them too. These patterns... this curse.', position: 'right' },
      { character: 'Narrator', text: 'He pulls back his sleeve, revealing the same dark, swirling markings.' },
      { character: 'Rumi', emotion: 'surprised', text: 'How...?', position: 'left' },
      { character: 'Jinu', emotion: 'sad', text: 'These are a constant reminder of my shame. A shame I can never escape.', position: 'right' },
      { character: 'Jinu', emotion: 'sad', text: '400 years ago, I made a deal with Gwima to save my family. It cost me everything.', position: 'right' },
    ],
    choices: [
      {
        text: 'Listen to his story. Maybe he understands.',
        nextScene: 'trust_jinu',
        flagEffects: [
          { type: 'add', flag: 'JinwooTrust', value: 20 },
          { type: 'subtract', flag: 'CurseMark', value: 1 }
        ]
      },
      {
        text: 'Push him away. You can\'t trust a demon.',
        nextScene: 'reject_jinu',
        flagEffects: [
          { type: 'subtract', flag: 'JinwooTrust', value: 20 },
          { type: 'add', flag: 'CurseMark', value: 1 }
        ]
      },
    ]
  },

  // ========== Act 1: 신뢰 루트 ==========
  'trust_jinu': {
    background: BG_NIGHT_STREET,
    dialogue: [
      { character: 'Rumi', emotion: 'sad', text: 'I... I am a mistake. A hunter and a demon... a half-breed.', position: 'left' },
      { character: 'Jinu', emotion: 'sad', text: 'For what it\'s worth, I don\'t think you\'re a mistake.', position: 'right' },
      { character: 'Narrator', text: 'A fragile connection forms between them, two souls caught between worlds.' },
      { character: 'Rumi', emotion: 'neutral', text: 'Because if there\'s no hope for you, what hope is there for me?', position: 'left' },
      { character: 'Jinu', emotion: 'neutral', text: 'Freedom... Is that even possible?', position: 'right' },
    ],
    nextScene: 'saja_boys_rise',
    onEnter: [
      { type: 'add', flag: 'JinwooTrust', value: 10 }
    ]
  },

  // ========== Act 1: 거부 루트 ==========
  'reject_jinu': {
    background: BG_NIGHT_STREET,
    dialogue: [
      { character: 'Rumi', emotion: 'angry', text: 'Your story means nothing to me. A demon is a demon. Stay away from me!', position: 'left' },
      { character: 'Narrator', text: 'Rumi runs, leaving a conflicted Jinu alone in the rain.' },
      { character: 'Jinu', emotion: 'sad', text: '(She\'s just like me... but she won\'t see it. Maybe there is no hope.)', position: 'right' },
      { character: 'Narrator', text: 'Rumi\'s heart hardens, but a seed of doubt has been planted.' },
    ],
    nextScene: 'early_failure_check',
    onEnter: [
      { type: 'subtract', flag: 'JinwooTrust', value: 10 }
    ]
  },

  // ========== 조기 탈락 엔딩 체크 ==========
  'early_failure_check': {
    background: BG_BACKSTAGE,
    dialogue: [
      { character: 'Narrator', text: 'Rumi\'s isolation deepens. Without trust or hope...' },
    ],
    nextScene: 'early_failure_ending',
    condition: 'JinwooTrust <= 0'
  },

  'early_failure_ending': {
    background: BG_BACKSTAGE,
    dialogue: [
      { character: 'Narrator', text: 'Rumi loses her voice completely. HUNTR/X disbands.' },
      { character: 'Rumi', emotion: 'sad', text: 'I couldn\'t save anyone... not even myself.', position: 'center' },
      { character: 'Narrator', text: 'The demons grow stronger. The world falls into darkness.' },
      { character: 'Narrator', text: 'EARLY FAILURE ENDING: The Hunter\'s Despair' },
    ],
    nextScene: null
  },

  'prologue2': {
    background: BG_BACKSTAGE,
    dialogue: [
      { character: 'Narrator', text: 'After the show, the energy is electric, but a cold dread snakes around Rumi\'s heart.' },
      { character: 'Rumi', emotion: 'sad', text: '(My voice... it faltered on the high note. The patterns on my skin... they\'re spreading.)', position: 'center' },
      { character: 'Rumi', emotion: 'sad', text: 'How am I supposed to fix the world, fix me, when I don\'t have my voice? Why now, when I\'m so close?', position: 'center' },
      { character: 'Narrator', text: 'Desperate, Rumi seeks a solution in an old, forgotten part of the city.' },
    ],
    nextScene: 'clinicMeeting',
  },
  'clinicMeeting': {
    background: BG_CLINIC,
    dialogue: [
      { character: 'Narrator', text: 'The scent of medicinal herbs hangs heavy in the air. Rumi finds herself in an old traditional clinic.' },
      { character: 'Rumi', emotion: 'sad', text: 'I hope this works... I can\'t let Mira and Zoey see.', position: 'left' },
      { character: 'Jinu', emotion: 'neutral', text: 'Hiding something?', position: 'right' },
      { character: 'Rumi', emotion: 'surprised', text: 'You! Jinu, from Saja Boys! What are you doing here?', position: 'left' },
      { character: 'Jinu', emotion: 'neutral', text: 'Perhaps the same as you. Looking for a cure.', position: 'right' },
      { character: 'Narrator', text: 'His eyes linger on her neck, where her collar just barely hides the creeping demon patterns.' },
    ],
    nextScene: 'jinuConfrontation',
  },
  'jinuConfrontation': {
    background: BG_NIGHT_STREET,
    dialogue: [
      { character: 'Narrator', text: 'Later that week, Jinu corners Rumi after a grueling practice session.' },
      { character: 'Jinu', emotion: 'serious', text: 'We need to talk. I know what you are.', position: 'right' },
      { character: 'Rumi', emotion: 'angry', text: 'I don\'t know what you\'re talking about.', position: 'left' },
      { character: 'Jinu', emotion: 'serious', text: 'Don\'t lie. I have them too. These patterns... this curse.', position: 'right' },
      { character: 'Narrator', text: 'He pulls back his own sleeve, revealing the same dark, swirling markings that haunt Rumi.' },
      { character: 'Rumi', emotion: 'surprised', text: 'How...?', position: 'left' },
      { character: 'Jinu', emotion: 'sad', text: '400 years ago, I made a deal with Gwima to save my family. It cost me everything. I became this.', position: 'right' },
      { character: 'Jinu', emotion: 'sad', text: 'You have a story too, don\'t you? I can see the pain in your eyes.', position: 'right' },
    ],
    choices: [
      { text: 'Trust him. Tell him your story.', nextScene: 'trustJinu' },
      { text: 'Push him away. You can\'t trust a demon.', nextScene: 'rejectJinu' },
    ]
  },
  'trustJinu': {
    background: BG_NIGHT_STREET,
    dialogue: [
      { character: 'Rumi', emotion: 'sad', text: 'I... I am a mistake. A hunter and a demon... a half-breed. These patterns are proof.', position: 'left' },
      { character: 'Jinu', emotion: 'sad', text: 'You are not a mistake, Rumi. You made a choice. I am the one who made a mistake.', position: 'right' },
      { character: 'Narrator', text: 'A fragile connection forms between them, two souls caught between worlds.' },
      { character: 'Rumi', emotion: 'neutral', text: 'Jinu... there\'s an awards show coming up. If you help us... we can break free from Gwima. Both of us.', position: 'left' },
      { character: 'Jinu', emotion: 'neutral', text: 'Freedom... Is that even possible?', position: 'right' },
      { character: 'Rumi', emotion: 'neutral', text: 'Nobody else gets to decide if you feel hope. That choice belongs to you.', position: 'left' },
    ],
    nextScene: 'awardsClimax',
  },
  'rejectJinu': {
    background: BG_NIGHT_STREET,
    dialogue: [
      { character: 'Rumi', emotion: 'angry', text: 'Your story means nothing to me. A demon is a demon. Stay away from me!', position: 'left' },
      { character: 'Narrator', text: 'Rumi runs, leaving a conflicted Jinu alone in the rain.' },
      { character: 'Jinu', emotion: 'sad', text: '(She\'s just like me... but she won\'t see it. Maybe there is no hope.)', position: 'right' },
      { character: 'Narrator', text: 'Rumi\'s heart hardens, but a seed of doubt has been planted. Are all demons simply monsters to be slain?' },
    ],
    nextScene: 'awardsClimax',
  },
  'awardsClimax': {
    background: BG_AWARDS,
    dialogue: [
        { character: 'Narrator', text: 'The World Idol Awards. The lights are blinding. This is the moment of truth.' },
        { character: 'Rumi', emotion: 'neutral', text: '(I will sing "Golden". I will show them who I truly am.)', position: 'center' },
        { character: 'Narrator', text: 'But as the first notes play, the screens flicker. An image of Rumi appears, her demon patterns exposed for the world to see.' },
        { character: 'Rumi', emotion: 'surprised', text: 'No... this can\'t be...', position: 'center' },
        { character: 'Jinu', emotion: 'sad', text: 'I\'m sorry, Rumi. There is no escape from Gwima. I tried to find another way... but there is no hope.', position: 'right' },
        { character: 'Rumi', emotion: 'angry', text: 'JINU! YOU...!', position: 'left' },
        { character: 'Narrator', text: 'Betrayed. Exposed. The Golden Honmoon shatters. Everything falls into darkness.' }
    ],
    nextScene: 'ending'
  },
  'ending': {
    background: BG_NAMSAN_TOWER,
    dialogue: [
      { character: 'Narrator', text: 'But in the deepest despair, Rumi finds a new strength.' },
      { character: 'Rumi', emotion: 'neutral', text: '(The scars are part of me. Darkness and harmony. My voice without the lies. This is what it sounds like!)', position: 'center' },
      { character: 'Narrator', text: 'Her song, raw and true, pierces the darkness. A new Honmoon, a brilliant rainbow of colors, begins to form.' },
      { character: 'Narrator', text: 'The story of the K-Pop Demon Hunters is far from over.' }
    ],
    nextScene: null 
  }
};

const koGameData: GameData = {
  // ========== 프롤로그: 헌터의 전설 ==========
  'prologue_intro': {
    background: BG_START,
    dialogue: [
      { character: 'Narrator', text: '오래전부터 노래로 사람들의 영혼을 어루만질 수 있는 존재들이 있었다...' },
      { character: 'Narrator', text: '그들은 헌터라고 불렸다. 그들의 목소리로 혼문을 만들어 인류를 악령으로부터 보호했다.' },
      { character: 'Narrator', text: '하지만 귀마가 이끄는 악령들은 더욱 강해졌다. 이제 새로운 세대의 헌터들이 일어나야 한다...' },
      { character: 'Narrator', text: '이것은 헌트릭스와 그들의 리더 루미의 이야기다.' },
    ],
    nextScene: 'world_tour_finale',
  },

  // ========== 헌트릭스의 이야기와 진우의 계략 ==========
  'world_tour_finale': {
    background: BG_CONCERT_STAGE,
    dialogue: [
      { character: 'Narrator', text: '관중의 함성이 귀를 먹먹하게 한다. 헌트릭스 월드투어의 마지막 공연이다.' },
      { character: 'Mira', emotion: 'neutral', text: '좋아, 이번이 우리 최대 규모 공연이야.', position: 'left' },
      { character: 'Rumi', emotion: 'neutral', text: '팬들은 최고만을 받을 자격이 있어.', position: 'center' },
      { character: 'Zoey', emotion: 'neutral', text: '팬들이 행복하면, 혼문도 행복해!', position: 'right' },
      { character: 'Narrator', text: '하지만 공연장으로 가는 비행기에서 악령들이 습격을 가했다...' },
    ],
    nextScene: 'plane_battle',
  },

  'plane_battle': {
    background: BG_NIGHT_STREET, // 임시 배경
    dialogue: [
      { character: 'Narrator', text: '비행기가 반으로 갈라지지만, 헌트릭스는 여유롭게 악령들을 물리친다.' },
      { character: 'Mira', emotion: 'neutral', text: '어, 문양이 생겼네. 이제 죽어야겠어.', position: 'left' },
      { character: 'Narrator', text: '그들은 공연장에 우아하게 착지하고 완벽한 공연을 펼친다.' },
      { character: 'Rumi', emotion: 'neutral', text: '혼문이... 황금빛으로 빛나고 있어!', position: 'center' },
      { character: 'Zoey', emotion: 'neutral', text: '황금 혼문 완성이 얼마 남지 않았어!', position: 'right' },
    ],
    nextScene: 'underground_world',
  },

  'underground_world': {
    background: BG_NIGHT_STREET, // 지하세계 배경 필요
    dialogue: [
      { character: 'Narrator', text: '지하 세계에서 귀마는 실패한 악령들을 응징한다.' },
      { character: 'Gwi-Ma', emotion: 'neutral', text: '한심해! 쓸모없어! 너희 모두!!!', position: 'center' },
      { character: 'Narrator', text: '그때 진우가 제안을 가지고 나타난다.' },
      { character: 'Jinu', emotion: 'neutral', text: '정면 대결로는 이길 수 없습니다. 아이돌로 경쟁하죠.', position: 'right' },
      { character: 'Gwi-Ma', emotion: 'neutral', text: '흥미롭군... 그 대가로 무엇을 원하느냐?', position: 'left' },
      { character: 'Jinu', emotion: 'sad', text: '인간이었던 기억을 지워주세요.', position: 'right' },
    ],
    nextScene: 'rumi_solo_decision',
  },

  // ========== Act 1: 루미의 갈등과 첫 만남 ==========
  'rumi_solo_decision': {
    background: BG_BACKSTAGE,
    dialogue: [
      { character: 'Narrator', text: '2주 후 휴식기 동안, 루미는 황금 혼문을 완성하고 싶은 마음에 사로잡힌다.' },
      { character: 'Rumi', emotion: 'sad', text: '(내 목소리... 공연 중에 흔들렸어. 악령 문양이 퍼지고 있어.)', position: 'center' },
      { character: 'Rumi', emotion: 'sad', text: '내 목소리가 없는데 어떻게 세상을 구하고, 나를 고칠 수 있겠어? 왜? 왜지!?', position: 'center' },
      { character: 'Narrator', text: '팀의 반대에도 불구하고 루미는 "Golden"이라는 솔로 곡을 발표하기로 결심한다.' },
    ],
    nextScene: 'stage_failure',
    onEnter: [
      { type: 'set', flag: 'CurseMark', value: 3 },
      { type: 'set', flag: 'TeamTrust', value: 70 }
    ]
  },

  'stage_failure': {
    background: BG_CONCERT_STAGE,
    dialogue: [
      { character: 'Narrator', text: '하지만 공연 중 악령 문양이 드러나기 시작한다.' },
      { character: 'Rumi', emotion: 'surprised', text: '안돼... 지금은 안돼...', position: 'center' },
      { character: 'Narrator', text: '루미는 노래를 부르지 못하고 무대에서 도망친다. 팬들은 혼란스러워한다.' },
      { character: 'Rumi', emotion: 'sad', text: '이런 건 사라져야 했어. 너희가 볼 일은 없었어!', position: 'center' },
    ],
    nextScene: 'clinic_meeting',
    onEnter: [
      { type: 'add', flag: 'CurseMark', value: 2 },
      { type: 'subtract', flag: 'TeamTrust', value: 20 }
    ]
  },

  // ========== Act 1: 첫 만남 (핵심 분기점) ==========
  'clinic_meeting': {
    background: BG_CLINIC,
    dialogue: [
      { character: 'Narrator', text: '미라와 조이가 전통 한의원 방문을 제안한다.' },
      { character: 'Narrator', text: '약초 냄새가 공중에 짙게 배어 있다.' },
      { character: 'Rumi', emotion: 'sad', text: '효과가 있었으면... 그들이 이런 나를 보게 할 순 없어.', position: 'left' },
      { character: 'Jinu', emotion: 'neutral', text: '뭔가 숨기고 있나?', position: 'right' },
      { character: 'Rumi', emotion: 'surprised', text: '너! 사자 보이즈의 진우! 여기서 뭐해?', position: 'left' },
      { character: 'Jinu', emotion: 'neutral', text: '아마 너와 같은 이유겠지. 치료법을 찾고 있어.', position: 'right' },
      { character: 'Narrator', text: '그의 시선이 그녀의 목에 머물렀고, 칼라가 간신히 기어다니는 악령 문양을 가리고 있었다.' },
    ],
    nextScene: 'jinu_confrontation',
    onEnter: [
      { type: 'set', flag: 'JinwooMeet', value: true }
    ]
  },

  'jinu_confrontation': {
    background: BG_NIGHT_STREET,
    dialogue: [
      { character: 'Narrator', text: '그 주 후, 힘든 연습이 끝난 후 진우가 루미를 구석으로 몰았다.' },
      { character: 'Jinu', emotion: 'serious', text: '얘기 좀 해. 네가 뭔지 알아.', position: 'right' },
      { character: 'Rumi', emotion: 'angry', text: '무슨 말인지 모르겠어.', position: 'left' },
      { character: 'Jinu', emotion: 'serious', text: '거짓말하지 마. 나도 가지고 있어. 이 문양들... 이 저주.', position: 'right' },
      { character: 'Narrator', text: '그는 소매를 걷어 올려 같은 어둡고 소용돌이치는 문양을 드러낸다.' },
      { character: 'Rumi', emotion: 'surprised', text: '어떻게...?', position: 'left' },
      { character: 'Jinu', emotion: 'sad', text: '이것들은 내 수치심을 끊임없이 상기시켜줘. 절대 벗어날 수 없는 수치심을.', position: 'right' },
      { character: 'Jinu', emotion: 'sad', text: '400년 전, 가족을 구하기 위해 귀마와 거래했어. 모든 것을 잃었지.', position: 'right' },
    ],
    choices: [
      {
        text: '그의 이야기를 들어보자. 아마 그가 이해할 것이다.',
        nextScene: 'trust_jinu',
        flagEffects: [
          { type: 'add', flag: 'JinwooTrust', value: 20 },
          { type: 'subtract', flag: 'CurseMark', value: 1 }
        ]
      },
      {
        text: '그를 밀어내자. 악령을 믿을 수 없다.',
        nextScene: 'reject_jinu',
        flagEffects: [
          { type: 'subtract', flag: 'JinwooTrust', value: 20 },
          { type: 'add', flag: 'CurseMark', value: 1 }
        ]
      },
    ]
  },

  // ========== Act 1: 신뢰 루트 ==========
  'trust_jinu': {
    background: BG_NIGHT_STREET,
    dialogue: [
      { character: 'Rumi', emotion: 'sad', text: '나는... 나는 실수야. 헌터이자 악령... 혼혈이지.', position: 'left' },
      { character: 'Jinu', emotion: 'sad', text: '솔직히 말하면, 너는 실수가 아니라고 생각해.', position: 'right' },
      { character: 'Narrator', text: '두 세계 사이에 갇힌 두 영혼 사이에 깨지기 쉬운 연결이 형성된다.' },
      { character: 'Rumi', emotion: 'neutral', text: '너에게 희망이 없다면, 나에게 무슨 희망이 있겠어?', position: 'left' },
      { character: 'Jinu', emotion: 'neutral', text: '자유... 그게 가능할까?', position: 'right' },
    ],
    nextScene: 'saja_boys_rise',
    onEnter: [
      { type: 'add', flag: 'JinwooTrust', value: 10 }
    ]
  },

  // ========== Act 1: 거부 루트 ==========
  'reject_jinu': {
    background: BG_NIGHT_STREET,
    dialogue: [
      { character: 'Rumi', emotion: 'angry', text: '네 이야기는 나한테 아무 의미 없어. 악령은 악령일 뿐이야. 내게서 떨어져!', position: 'left' },
      { character: 'Narrator', text: '루미는 빗속에 갈등하는 진우를 홀로 남겨두고 달려간다.' },
      { character: 'Jinu', emotion: 'sad', text: '(그녀는 나랑 똑같아... 하지만 그걸 보려 하지 않네. 아마 희망은 없나 봐.)', position: 'right' },
      { character: 'Narrator', text: '루미의 마음은 굳어지지만, 의심의 씨앗이 심어졌다.' },
    ],
    nextScene: 'early_failure_check',
    onEnter: [
      { type: 'subtract', flag: 'JinwooTrust', value: 10 }
    ]
  },

  // ========== 조기 탈락 엔딩 체크 ==========
  'early_failure_check': {
    background: BG_BACKSTAGE,
    dialogue: [
      { character: 'Narrator', text: '루미의 고립이 깊어진다. 신뢰도 희망도 없이...' },
    ],
    nextScene: 'early_failure_ending',
    condition: 'JinwooTrust <= 0'
  },

  'early_failure_ending': {
    background: BG_BACKSTAGE,
    dialogue: [
      { character: 'Narrator', text: '루미는 완전히 목소리를 잃는다. 헌트릭스는 해체된다.' },
      { character: 'Rumi', emotion: 'sad', text: '아무도 구할 수 없었어... 나 자신조차도.', position: 'center' },
      { character: 'Narrator', text: '악령들이 더 강해진다. 세상은 어둠에 빠진다.' },
      { character: 'Narrator', text: '조기 탈락 엔딩: 헌터의 절망' },
    ],
    nextScene: null
  },

  'prologue1': {
    background: BG_CONCERT_STAGE,
    dialogue: [
      { character: 'Narrator', text: '관중의 함성이 귀를 먹먹하게 한다. 바로 오늘이다. HentropyX의 가장 큰 공연.' },
      { character: 'Mira', emotion: 'neutral', text: '좋아, 너 무슨 일 있어? 밤새 조용하잖아.', position: 'left' },
      { character: 'Rumi', emotion: 'sad', text: '그냥 집중하려고 노력하는 중이야.', position: 'right' },
      { character: 'Zoey', emotion: 'neutral', text: '팬들이 행복하면, 혼문도 행복해! 가자!', position: 'center' },
    ],
    nextScene: 'prologue2',
  },
  'prologue2': {
    background: BG_BACKSTAGE,
    dialogue: [
      { character: 'Narrator', text: '공연이 끝난 후, 열기는 뜨거웠지만 루미의 심장에는 차가운 공포가 스며들었다.' },
      { character: 'Rumi', emotion: 'sad', text: '(내 목소리... 고음에서 흔들렸어. 피부에 있는 문양들... 번지고 있어.)', position: 'center' },
      { character: 'Rumi', emotion: 'sad', text: '내 목소리가 없는데 어떻게 세상을 구하고, 나를 고칠 수 있겠어? 왜 하필 지금, 이렇게 가까이 왔는데?', position: 'center' },
      { character: 'Narrator', text: '절박해진 루미는 도시의 잊혀진 낡은 곳에서 해결책을 찾는다.' },
    ],
    nextScene: 'clinicMeeting',
  },
  'clinicMeeting': {
    background: BG_CLINIC,
    dialogue: [
      { character: 'Narrator', text: '약초 냄새가 공중에 짙게 배어 있다. 루미는 낡은 전통 한의원에 와 있다.' },
      { character: 'Rumi', emotion: 'sad', text: '효과가 있었으면... 미라와 조이가 보게 할 순 없어.', position: 'left' },
      { character: 'Jinu', emotion: 'neutral', text: '뭘 숨기고 있나?', position: 'right' },
      { character: 'Rumi', emotion: 'surprised', text: '너! 사자 보이즈의 진우! 여기서 뭐해?', position: 'left' },
      { character: 'Jinu', emotion: 'neutral', text: '아마 너와 같은 이유겠지. 치료법을 찾고 있어.', position: 'right' },
      { character: 'Narrator', text: '그의 시선은 그녀의 목에 머물렀고, 그곳에는 칼라가 간신히 기어다니는 악마 문양을 가리고 있었다.' },
    ],
    nextScene: 'jinuConfrontation',
  },
  'jinuConfrontation': {
    background: BG_NIGHT_STREET,
    dialogue: [
      { character: 'Narrator', text: '그 주 후반, 힘든 연습 세션이 끝난 후 진우가 루미를 구석으로 몰았다.' },
      { character: 'Jinu', emotion: 'serious', text: '얘기 좀 해. 네가 뭔지 알아.', position: 'right' },
      { character: 'Rumi', emotion: 'angry', text: '무슨 말인지 모르겠어.', position: 'left' },
      { character: 'Jinu', emotion: 'serious', text: '거짓말하지 마. 나도 가지고 있어. 이 문양들... 이 저주.', position: 'right' },
      { character: 'Narrator', text: '그는 자신의 소매를 걷어 루미를 괴롭히는 것과 같은 어둡고 소용돌이치는 문양을 드러낸다.' },
      { character: 'Rumi', emotion: 'surprised', text: '어떻게...?', position: 'left' },
      { character: 'Jinu', emotion: 'sad', text: '400년 전, 가족을 구하기 위해 귀마와 거래를 했어. 모든 것을 잃었지. 난 이렇게 됐어.', position: 'right' },
      { character: 'Jinu', emotion: 'sad', text: '너도 사연이 있겠지? 네 눈에서 고통이 보여.', position: 'right' },
    ],
    choices: [
      { text: '그를 믿고 당신의 이야기를 들려주세요.', nextScene: 'trustJinu' },
      { text: '그를 밀어내세요. 악마를 믿을 수 없어요.', nextScene: 'rejectJinu' },
    ]
  },
  'trustJinu': {
    background: BG_NIGHT_STREET,
    dialogue: [
      { character: 'Rumi', emotion: 'sad', text: '나는... 나는 실수야. 사냥꾼이자 악마... 혼혈이지. 이 문양들이 증거야.', position: 'left' },
      { character: 'Jinu', emotion: 'sad', text: '넌 실수가 아니야, 루미. 넌 선택을 한 거야. 실수한 건 나야.', position: 'right' },
      { character: 'Narrator', text: '두 세계 사이에 갇힌 두 영혼 사이에 깨지기 쉬운 연결이 형성된다.' },
      { character: 'Rumi', emotion: 'neutral', text: '진우... 곧 시상식이 있어. 네가 우리를 도와준다면... 귀마에게서 벗어날 수 있어. 우리 둘 다.', position: 'left' },
      { character: 'Jinu', emotion: 'neutral', text: '자유... 그게 가능할까?', position: 'right' },
      { character: 'Rumi', emotion: 'neutral', text: '희망을 느낄지 말지는 다른 사람이 결정하는 게 아니야. 그 선택은 네게 달려 있어.', position: 'left' },
    ],
    nextScene: 'awardsClimax',
  },
  'rejectJinu': {
    background: BG_NIGHT_STREET,
    dialogue: [
      { character: 'Rumi', emotion: 'angry', text: '네 이야기는 나한테 아무 의미 없어. 악마는 악마일 뿐이야. 내게서 떨어져!', position: 'left' },
      { character: 'Narrator', text: '루미는 빗속에 갈등하는 진우를 홀로 남겨두고 달려간다.' },
      { character: 'Jinu', emotion: 'sad', text: '(그녀는 나랑 똑같아... 하지만 그걸 보려 하지 않아. 아마 희망은 없나 봐.)', position: 'right' },
      { character: 'Narrator', text: '루미의 마음은 굳어지지만, 의심의 씨앗이 심어졌다. 모든 악마는 그저 죽여야 할 괴물일까?' },
    ],
    nextScene: 'awardsClimax',
  },
  'awardsClimax': {
    background: BG_AWARDS,
    dialogue: [
        { character: 'Narrator', text: '월드 아이돌 어워즈. 조명이 눈부시다. 진실의 순간이다.' },
        { character: 'Rumi', emotion: 'neutral', text: '("골든"을 부를 거야. 내가 진정 누구인지 보여주겠어.)', position: 'center' },
        { character: 'Narrator', text: '하지만 첫 음이 연주되자 화면이 깜빡인다. 루미의 악마 문양이 온 세상에 드러나는 이미지가 나타난다.' },
        { character: 'Rumi', emotion: 'surprised', text: '안돼... 이럴 순 없어...', position: 'center' },
        { character: 'Jinu', emotion: 'sad', text: '미안해, 루미. 귀마에게서 벗어날 길은 없어. 다른 방법을 찾아보려 했지만... 희망이 없어.', position: 'right' },
        { character: 'Rumi', emotion: 'angry', text: '진우! 네가...!', position: 'left' },
        { character: 'Narrator', text: '배신당했다. 폭로되었다. 황금 혼문이 산산조각 난다. 모든 것이 어둠 속으로 떨어진다.' }
    ],
    nextScene: 'ending'
  },
  'ending': {
    background: BG_NAMSAN_TOWER,
    dialogue: [
      { character: 'Narrator', text: '하지만 가장 깊은 절망 속에서 루미는 새로운 힘을 찾는다.' },
      { character: 'Rumi', emotion: 'neutral', text: '(흉터는 내 일부야. 어둠과 조화. 거짓 없는 내 목소리. 바로 이런 소리야!)', position: 'center' },
      { character: 'Narrator', text: '그녀의 날것 그대로의 진실한 노래가 어둠을 꿰뚫는다. 눈부신 무지갯빛의 새로운 혼문이 형성되기 시작한다.' },
      { character: 'Narrator', text: 'K팝 데몬 헌터스의 이야기는 아직 끝나지 않았다.' }
    ],
    nextScene: null
  }
};

export const translations = {
  en: {
    title: "K-Pop Demon Hunters",
    subtitle: "A Visual Novel",
    startGame: "Start Game",
    toBeContinued: "To Be Continued...",
    thankYou: "Thank you for playing.",
    playAgain: "Play Again",
    characters: {
      'Narrator': 'Narrator', 'Rumi': 'Rumi', 'Jinu': 'Jinu', 'Mira': 'Mira', 'Zoey': 'Zoey',
    },
    gameData: enGameData,
  },
  ko: {
    title: "K-팝 데몬 헌터스",
    subtitle: "비주얼 노벨",
    startGame: "게임 시작",
    toBeContinued: "다음 편에 계속...",
    thankYou: "플레이해주셔서 감사합니다.",
    playAgain: "다시 플레이",
    characters: {
      'Narrator': '나레이터', 'Rumi': '루미', 'Jinu': '진우', 'Mira': '미라', 'Zoey': '조이',
    },
    gameData: koGameData,
  }
};