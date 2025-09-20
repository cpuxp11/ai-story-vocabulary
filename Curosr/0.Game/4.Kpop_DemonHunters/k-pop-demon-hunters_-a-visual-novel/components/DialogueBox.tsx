
import React from 'react';
import type { Dialogue } from '../types';
import { useLanguage } from '../App';
import { translations } from '../gameData';

interface DialogueBoxProps {
  dialogue: Dialogue;
  typedText: string;
}

const DialogueBox: React.FC<DialogueBoxProps> = ({ dialogue, typedText }) => {
  const { language } = useLanguage();
  if (!dialogue) return null;

  const isNarrator = dialogue.character === 'Narrator';
  const characterName = translations[language].characters[dialogue.character as keyof typeof translations[typeof language]['characters']] || dialogue.character;


  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 cursor-pointer">
      <div className="bg-black bg-opacity-80 rounded-lg p-8 text-white max-w-6xl mx-auto border-2 border-purple-500/50 shadow-lg shadow-purple-900/50">
        {!isNarrator && (
          <h2 className="text-2xl font-bold mb-2 text-purple-300">
            {characterName}
          </h2>
        )}
        <div className="min-h-[120px] flex items-start py-3">
          <p className={`text-lg leading-loose w-full break-words word-wrap hyphens-auto ${isNarrator ? 'italic text-gray-300' : 'text-gray-100'}`}>
            {typedText}
            <span className="inline-block w-2 h-5 bg-white ml-1 animate-ping"></span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DialogueBox;