
import React from 'react';

interface CharacterSpriteProps {
  src?: string;
  alt: string;
  position: 'left' | 'center' | 'right';
  isVisible: boolean;
  isSpeaking: boolean;
}

const CharacterSprite: React.FC<CharacterSpriteProps> = ({ src, alt, position, isVisible, isSpeaking }) => {
  if (!src) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'left':
        return 'left-8 translate-x-0';
      case 'right':
        return 'right-8 translate-x-0';
      case 'center':
      default:
        return 'left-1/2 -translate-x-1/2';
    }
  };

  const speakingEffect = isSpeaking ? 'brightness-100 scale-100' : 'brightness-75 scale-95';
  const visibilityEffect = isVisible ? 'opacity-100' : 'opacity-0';

  return (
    <div
      className={`absolute bottom-0 h-full w-auto transition-all duration-500 ease-in-out ${getPositionClasses()} ${visibilityEffect} ${speakingEffect}`}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-auto object-contain drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
      />
    </div>
  );
};

export default CharacterSprite;
