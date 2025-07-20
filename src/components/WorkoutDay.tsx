import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, RotateCcw } from 'lucide-react';
import { ExerciseCard } from './ExerciseCard';
import { TimerBanner } from './TimerBanner';
import { useTimer } from '../hooks/useTimer';
import { getAccentColor } from '../utils/dateHelpers';

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

interface WorkoutData {
  name: string;
  exercises: Exercise[];
}

interface WorkoutDayProps {
  day: string;
  workoutData: WorkoutData;
}

export const WorkoutDay: React.FC<WorkoutDayProps> = ({ day, workoutData }) => {
  const [completedSets, setCompletedSets] = useState<boolean[][]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const { timeLeft, isRunning, startTimer, stopTimer, addTime, progress } = useTimer();
  const contentRef = useRef<HTMLDivElement>(null);
  
  const accentColor = getAccentColor(day);
  
  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem(`workout-${day}`);
    if (saved) {
      setCompletedSets(JSON.parse(saved));
    } else {
      setCompletedSets(workoutData.exercises.map(ex => new Array(ex.sets.length).fill(false)));
    }
  }, [day, workoutData]);
  
  // Save progress
  useEffect(() => {
    if (completedSets.length > 0) {
      localStorage.setItem(`workout-${day}`, JSON.stringify(completedSets));
    }
  }, [completedSets, day]);
  
  const totalSets = workoutData.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedCount = completedSets.flat().filter(Boolean).length;
  const progressPercent = totalSets > 0 ? (completedCount / totalSets) * 100 : 0;
  
  const handleSetToggle = (exerciseIndex: number, setIndex: number) => {
    const newCompletedSets = [...completedSets];
    const wasCompleted = newCompletedSets[exerciseIndex][setIndex];
    newCompletedSets[exerciseIndex][setIndex] = !wasCompleted;
    setCompletedSets(newCompletedSets);
    
    // Start timer if set was just completed
    if (!wasCompleted) {
      const exercise = workoutData.exercises[exerciseIndex];
      startTimer(exercise.rest_between_sets);
      
      // Auto-scroll to next unfinished set
      setTimeout(() => {
        scrollToNextSet();
      }, 500);
    }
  };
  
  const handleSetSkip = (exerciseIndex: number, setIndex: number) => {
    const newCompletedSets = [...completedSets];
    newCompletedSets[exerciseIndex][setIndex] = true;
    setCompletedSets(newCompletedSets);
  };
  
  const scrollToNextSet = () => {
    // Find next incomplete set and scroll to it
    for (let i = 0; i < completedSets.length; i++) {
      for (let j = 0; j < completedSets[i].length; j++) {
        if (!completedSets[i][j]) {
          const element = document.querySelector(`[data-exercise="${i}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }
      }
    }
  };
  
  const resetDay = () => {
    setCompletedSets(workoutData.exercises.map(ex => new Array(ex.sets.length).fill(false)));
    localStorage.removeItem(`workout-${day}`);
    setShowMenu(false);
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      {isRunning && (
        <TimerBanner
          timeLeft={timeLeft}
          progress={progress}
          onStop={stopTimer}
          onAddTime={addTime}
        />
      )}
      
      <div className={`sticky top-0 z-40 bg-black border-b border-gray-800 ${isRunning ? 'mt-16' : ''}`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgb(55, 65, 81)"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="2"
                  strokeDasharray={`${progressPercent}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                {Math.round(progressPercent)}%
              </div>
            </div>
            
            <div>
              <h1 className="text-xl font-bold capitalize">{day}</h1>
              <p className="text-gray-400 text-sm">{workoutData.name}</p>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-12 bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
                <button
                  onClick={resetDay}
                  className="flex items-center space-x-2 w-full px-4 py-3 hover:bg-gray-800 transition-colors text-left"
                >
                  <RotateCcw className="w-4 h-4 text-gray-400" />
                  <span>Reset Day</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div ref={contentRef} className="p-4 pb-8">
        {workoutData.exercises.map((exercise, exerciseIndex) => (
          <div key={exerciseIndex} data-exercise={exerciseIndex}>
            <ExerciseCard
              exercise={exercise}
              completedSets={completedSets[exerciseIndex] || []}
              onSetToggle={(setIndex) => handleSetToggle(exerciseIndex, setIndex)}
              onSetSkip={(setIndex) => handleSetSkip(exerciseIndex, setIndex)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};