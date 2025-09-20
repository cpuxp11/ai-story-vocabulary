
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { GameState, SceneId } from './types';
import { translations } from './gameData';
import GameScreen from './components/GameScreen';

type Language = 'en' | 'ko';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const App: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const gameData = t.gameData;

  const [gameState, setGameState] = useState<GameState>(GameState.StartMenu);
  const [currentSceneId, setCurrentSceneId] = useState<SceneId>('prologue_intro');
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | null>(null);
  
  const currentScene = gameData[currentSceneId];
  const currentDialogue = currentScene?.dialogue[dialogueIndex];

  const handleNext = useCallback(() => {
    // 중복 클릭 방지
    if (!currentDialogue || !currentScene) return;

    // 타이핑 중이면 즉시 완료
    if (isTyping) {
      setText(currentDialogue.text);
      setIsTyping(false);
      return;
    }

    // 다음 대화로 진행
    if (dialogueIndex < currentScene.dialogue.length - 1) {
      setDialogueIndex(prev => prev + 1);
    } else {
      // 선택지가 없으면 다음 씬으로
      if (!currentScene.choices || currentScene.choices.length === 0) {
        if (currentScene.nextScene) {
          setCurrentSceneId(currentScene.nextScene);
          setDialogueIndex(0);
        } else {
          setGameState(GameState.EndMenu);
        }
      }
    }
  }, [isTyping, currentDialogue, dialogueIndex, currentScene]);

  // 타이핑 효과만 담당
  useEffect(() => {
    if (gameState === GameState.Playing && currentDialogue) {
      // 초기화
      setText('');
      setIsTyping(true);

      let i = 0;
      let isActive = true;

      const typingInterval = setInterval(() => {
        if (!isActive) return;

        if (i < currentDialogue.text.length) {
          setText(currentDialogue.text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 40);

      return () => {
        isActive = false;
        clearInterval(typingInterval);
      };
    }
  }, [currentDialogue, gameState]);

  // 자동 진행 로직 (타이핑 완료 후)
  useEffect(() => {
    // 자동 진행 타이머 정리
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }

    // 타이핑이 완료되고, 선택지가 없을 때만 자동 진행 설정
    if (!isTyping && gameState === GameState.Playing && currentScene && (!currentScene.choices || currentScene.choices.length === 0)) {
      const timer = setTimeout(() => {
        if (dialogueIndex < currentScene.dialogue.length - 1) {
          setDialogueIndex(prev => prev + 1);
        } else if (currentScene.nextScene) {
          setCurrentSceneId(currentScene.nextScene);
          setDialogueIndex(0);
        } else {
          setGameState(GameState.EndMenu);
        }
      }, 3500);

      setAutoAdvanceTimer(timer);
    }

    return () => {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
      }
    };
  }, [isTyping, gameState, currentScene, dialogueIndex]);

  // 키보드 이벤트 리스너 추가
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState === GameState.Playing) {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === ' ' || event.key === 'Enter') {
          event.preventDefault();
          handleNext();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [gameState, handleNext]);

  // 컴포넌트 언마운트 시 모든 타이머 정리
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
      }
    };
  }, []);

  const handleChoice = (nextScene: SceneId) => {
    // TODO: 플래그 효과 처리 (현재는 무시)
    setCurrentSceneId(nextScene);
    setDialogueIndex(0);
  };

  const startGame = () => {
    setGameState(GameState.Playing);
    setCurrentSceneId('prologue_intro');
    setDialogueIndex(0);
  };
  
  const restartGame = () => {
    setGameState(GameState.StartMenu);
  }

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center font-poppins">
      <div className="relative w-full h-full max-w-[1280px] max-h-[720px] bg-gray-900 shadow-2xl shadow-purple-500/20 overflow-hidden">
        {gameState === GameState.StartMenu && (
          <div 
            className="w-full h-full bg-cover bg-center flex flex-col items-center justify-center text-white"
            style={{backgroundImage: `url('./3.background_start.jpg')`}}
          >
            <div className="bg-black bg-opacity-60 p-12 rounded-lg text-center">
              <h1 className="text-6xl font-bold text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]">{t.title}</h1>
              <p className="text-xl mt-4 text-gray-300">{t.subtitle}</p>
              <button
                onClick={startGame}
                className="mt-8 px-8 py-4 bg-purple-600 hover:bg-purple-500 transition-all duration-300 rounded-lg text-2xl font-semibold transform hover:scale-105"
              >
                {t.startGame}
              </button>
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-2 text-sm rounded-md transition-colors ${language === 'en' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('ko')}
                  className={`px-4 py-2 text-sm rounded-md transition-colors ${language === 'ko' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  한국어
                </button>
              </div>
            </div>
          </div>
        )}

        {gameState === GameState.Playing && currentScene && (
          <GameScreen
            scene={currentScene}
            dialogueIndex={dialogueIndex}
            typedText={text}
            onNext={handleNext}
            onChoice={handleChoice}
          />
        )}
        
        {gameState === GameState.EndMenu && (
           <div 
            className="w-full h-full bg-cover bg-center flex flex-col items-center justify-center text-white"
            style={{backgroundImage: `url('https://i.imgur.com/vHqQwgA.jpg')`}}
          >
            <div className="bg-black bg-opacity-70 p-12 rounded-lg text-center">
              <h1 className="text-5xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">{t.toBeContinued}</h1>
              <p className="text-lg mt-4 text-gray-300">{t.thankYou}</p>
              <button
                onClick={restartGame}
                className="mt-8 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 transition-all duration-300 rounded-lg text-xl font-semibold transform hover:scale-105"
              >
                {t.playAgain}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;