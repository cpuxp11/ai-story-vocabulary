
import React, { useState, useEffect, useCallback } from 'react';
import type { Word, StoryResult } from './types';
import { WORD_POOL } from './data/wordlist';
import { generateStory, generateImage } from './services/geminiService';
import Header from './components/Header';
import StoryDisplay from './components/StoryDisplay';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);
  const [storyResult, setStoryResult] = useState<StoryResult | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const selectRandomWords = useCallback(() => {
    const shuffled = [...WORD_POOL].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, []);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setStoryResult(null);
    setGeneratedImage(null);

    try {
      const words = selectRandomWords();
      setSelectedWords(words);
      
      const wordStrings = words.map(w => w.word);
      const storyData = await generateStory(wordStrings);
      setStoryResult(storyData);

      if (storyData && storyData.imagePrompt) {
        const imageBase64 = await generateImage(storyData.imagePrompt);
        setGeneratedImage(`data:image/png;base64,${imageBase64}`);
      } else {
        throw new Error("Failed to get a valid image prompt.");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please check the API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectRandomWords]);

  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-slate-800 flex flex-col items-center pb-20">
      <Header />
      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-700">유병재식 영단어 암기</h1>
          <p className="text-slate-500 mt-2">웃픈 스토리로 단어를 기억해보세요!</p>
        </div>
        
        <div className="relative min-h-[400px] bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200 flex flex-col items-center justify-center">
          {isLoading && <LoadingSpinner />}
          {error && !isLoading && (
            <div className="text-center text-red-500">
              <h3 className="font-bold text-lg mb-2">Oops! Something went wrong.</h3>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {!isLoading && !error && storyResult && (
            <StoryDisplay 
              words={selectedWords}
              storyResult={storyResult}
              imageUrl={generatedImage}
            />
          )}
        </div>
        
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full max-w-xs bg-[#58cc02] text-white font-bold uppercase tracking-wider py-4 px-6 rounded-2xl border-b-4 border-[#58a700] hover:bg-[#61e002] active:border-b-2 active:translate-y-0.5 transition-all duration-150 ease-in-out disabled:bg-slate-300 disabled:border-slate-200 disabled:cursor-not-allowed"
          >
            {isLoading ? '생성중...' : '새 스토리 생성'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
