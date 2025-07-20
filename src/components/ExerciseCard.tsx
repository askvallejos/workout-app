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
  isDarkMode: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  completedSets,
  onSetToggle,
  onSetSkip,
  isDarkMode
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const completedCount = completedSets.filter(Boolean).length;
  const totalSets = exercise.sets.length;
  const isAllCompleted = completedCount === totalSets;

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'} border rounded-lg overflow-hidden mb-4`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full p-4 flex items-center justify-between ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
      >
        <div className="flex items-center space-x-3">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
            ${isAllCompleted ? 'bg-emerald-600 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}
          `}>
            {completedCount}/{totalSets}
          </div>
          
          <div className="text-left">
            <h3 className={`${isDarkMode ? 'text-white' : 'text-black'} font-medium`}>{exercise.exercise}</h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
              {totalSets} sets • {exercise.rest_between_sets}s rest
            </p>
          </div>
        </div>
        
        {isExpanded ? (
          <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        ) : (
          <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        )}
      </button>
      
      {isExpanded && (
        <div className={`border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className={`flex items-center py-2 px-4 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'} text-xs font-medium`}>
            <div className="w-6 mr-4"></div>
            <div className="w-12 text-center">SET</div>
            <div className="flex-1 px-2">TYPE</div>
            <div className="w-16 text-center">REPS</div>
            <div className="w-20 text-center">WEIGHT</div>
          </div>
          
          {exercise.sets.map((set, index) => (
            <SetRow
              key={index}
              set={set}
              exerciseName={exercise.exercise}
              isCompleted={completedSets[index]}
              onToggle={() => onSetToggle(index)}
              onSkip={() => onSetSkip(index)}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};