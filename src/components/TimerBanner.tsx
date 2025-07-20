import React from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { formatTime } from '../utils/dateHelpers';

interface TimerBannerProps {
  timeLeft: number;
  progress: number;
  onStop: () => void;
  onAddTime: (seconds: number) => void;
}

export const TimerBanner: React.FC<TimerBannerProps> = ({
  timeLeft,
  progress,
  onStop,
  onAddTime
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-700">
      <div className="relative">
        <div 
          className="h-1 bg-emerald-500 transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onStop}
            className="p-1 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
          
          <div className="text-white font-mono text-lg">
            {formatTime(timeLeft)}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onAddTime(-15)}
            className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 rounded-full text-white text-sm transition-colors"
          >
            <Minus className="w-3 h-3" />
            <span>15s</span>
          </button>
          
          <button
            onClick={() => onAddTime(30)}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-full text-white text-sm transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>30s</span>
          </button>
        </div>
      </div>
    </div>
  );
};