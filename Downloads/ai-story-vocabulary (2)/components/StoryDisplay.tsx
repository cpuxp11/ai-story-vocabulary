
import React from 'react';
import type { Word, StoryResult } from '../types';
import WordChip from './WordChip';

interface StoryDisplayProps {
  words: Word[];
  storyResult: StoryResult;
  imageUrl: string | null;
}

const HighlightedKoreanText: React.FC<{ text: string }> = ({ text }) => {
    const parts = text.split(/(\([a-zA-Z]+\))/g);
    return (
      <p className="text-slate-600 leading-relaxed text-center text-base sm:text-lg">
        {parts.map((part, index) => {
          if (part.match(/(\([a-zA-Z]+\))/g)) {
            return (
              <span key={index} className="font-bold text-teal-600">
                {part}
              </span>
            );
          }
          return part;
        })}
      </p>
    );
};

const StoryDisplay: React.FC<StoryDisplayProps> = ({ words, storyResult, imageUrl }) => {
  return (
    <div className="w-full animate-fade-in flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {words.map((word) => (
          <WordChip key={word.word} word={word.word} meaning={word.meaning} />
        ))}
      </div>
      
      <div className="w-full aspect-square max-w-sm bg-slate-200 rounded-xl mb-6 overflow-hidden flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={storyResult.imagePrompt} className="w-full h-full object-cover" />
        ) : (
          <div className="text-slate-400">Generating image...</div>
        )}
      </div>

      <div className="w-full space-y-6">
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-slate-800 font-semibold text-center text-base sm:text-lg">
                "{storyResult.englishStory}"
            </p>
        </div>
        <div className="p-4">
            <HighlightedKoreanText text={storyResult.koreanTranslation} />
        </div>
      </div>
    </div>
  );
};

export default StoryDisplay;
