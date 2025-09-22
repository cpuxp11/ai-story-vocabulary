
import React from 'react';

interface WordChipProps {
  word: string;
  meaning: string;
}

const WordChip: React.FC<WordChipProps> = ({ word, meaning }) => {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-full px-4 py-2 shadow-sm">
      <span className="font-bold text-slate-700">{word}</span>
      <span className="text-slate-500 ml-2">{meaning}</span>
    </div>
  );
};

export default WordChip;
