
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-t-4 border-t-[#58cc02] border-gray-200 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-semibold">AI가 웃픈 스토리를 만드는 중...</p>
    </div>
  );
};

export default LoadingSpinner;
