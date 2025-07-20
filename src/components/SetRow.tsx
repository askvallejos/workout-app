import React from 'react';
import { Check, SkipForward } from 'lucide-react';
import { triggerHaptic } from '../utils/sound';

interface Set {
  set: number;
  type: 'warm_up' | 'work';
  reps_from: number;
  reps_to: number;
  weight: number;
}

interface SetRowProps {
  set: Set;
  exerciseName: string;
  isCompleted: boolean;
  onToggle: () => void;
  onSkip: () => void;
}

export const SetRow: React.FC<SetRowProps> = ({
  set,
  exerciseName,
  isCompleted,
  onToggle,
  onSkip
}) => {
  const handleSwipeLeft = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const element = e.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    const swipeDistance = rect.right - touch.clientX;
    
    if (swipeDistance > 100) {
      triggerHaptic();
      onSkip();
    }
  };

  const getWeightDisplay = () => {
    if (exerciseName.toLowerCase().includes('pull-up') && set.weight > 0) {
      return `+${set.weight} lbs`;
    }
    return `${set.weight} lbs`;
  };

  const getRepsDisplay = () => {
    return set.reps_from === set.reps_to 
      ? set.reps_from.toString()
      : `${set.reps_from}-${set.reps_to}`;
  };

  return (
    <div 
      className="flex items-center py-3 px-4 border-b border-gray-800 touch-pan-y"
      onTouchEnd={handleSwipeLeft}
    >
      <button
        onClick={onToggle}
        className={`
          w-6 h-6 rounded border-2 flex items-center justify-center mr-4 transition-all
          ${isCompleted 
            ? 'bg-emerald-500 border-emerald-500' 
            : 'border-gray-600 hover:border-gray-400'}
        `}
      >
        {isCompleted && <Check className="w-4 h-4 text-white" />}
      </button>
      
      <div className="w-12 text-center text-gray-300 text-sm">
        {set.set}
      </div>
      
      <div className="flex-1 px-2">
        <span className={`
          inline-block px-2 py-1 rounded text-xs font-medium
          ${set.type === 'warm_up' 
            ? 'bg-amber-600 text-amber-100' 
            : 'bg-emerald-600 text-emerald-100'}
        `}>
          {set.type === 'warm_up' ? 'Warm Up' : 'Work'}
        </span>
      </div>
      
      <div className="w-16 text-center text-gray-300 text-sm">
        {getRepsDisplay()}
      </div>
      
      <div className="w-20 text-center text-gray-300 text-sm">
        {getWeightDisplay()}
      </div>
    </div>
  );
};