import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SetRow } from './SetRow';

interface Set {
  set: number;
  type: 'warm_up' | 'work';
  reps_from: number;
  reps_to: number;
  weight: number;
}

interface Exercise {
  exercise: string;
  sets: Set[];
  rest_between_sets: number;
}

interface ExerciseCardProps {
  exercise: Exercise;
  completedSets: boolean[];
  onSetToggle: (setIndex: number) => void;
  onSetSkip: (setIndex: number) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  completedSets,
  onSetToggle,
  onSetSkip
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const completedCount = completedSets.filter(Boolean).length;
  const totalSets = exercise.sets.length;
  const isAllCompleted = completedCount === totalSets;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
            ${isAllCompleted ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300'}
          `}>
            {completedCount}/{totalSets}
          </div>
          
          <div className="text-left">
            <h3 className="text-white font-medium">{exercise.exercise}</h3>
            <p className="text-gray-400 text-sm">
              {totalSets} sets • {exercise.rest_between_sets}s rest
            </p>
          </div>
        </div>
        
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="border-t border-gray-800">
          <div className="flex items-center py-2 px-4 bg-gray-800 text-xs text-gray-400 font-medium">
            <div className="w-6 mr-4"></div>
            <div className="w-12 text-center">SET</div>
            <div className="flex-1 px-2">TYPE</div>
            <div className="w-16 text-center">REPS</div>
            <div className="w-20 text-center">WEIGHT</div>
            <div className="w-16 text-center">REST</div>
          </div>
          
          {exercise.sets.map((set, index) => (
            <SetRow
              key={index}
              set={set}
              exerciseName={exercise.exercise}
              isCompleted={completedSets[index]}
              onToggle={() => onSetToggle(index)}
              onSkip={() => onSetSkip(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};