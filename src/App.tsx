import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, Calendar } from 'lucide-react';
import { WorkoutDay } from './components/WorkoutDay';
import { getCurrentDay } from './utils/dateHelpers';
import workoutData from './data/workout.json';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function App() {
  const [currentDay, setCurrentDay] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    // Check hash routing first
    const hash = window.location.hash.replace('#/', '');
    if (hash && DAYS.includes(hash)) {
      setCurrentDay(hash);
    } else {
      // Default to today
      setCurrentDay(getCurrentDay());
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    // Update hash when day changes
    window.location.hash = `#/${currentDay}`;
  }, [currentDay]);

  const workout = workoutData.workout_plan[currentDay as keyof typeof workoutData.workout_plan];

  const RestDayCard = () => (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center max-w-sm">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
          <Calendar className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Rest Day</h2>
        <p className="text-gray-400 mb-6">
          No workout scheduled for {currentDay}. Take some time to recover!
        </p>
        <img 
          src="https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=400"
          alt="Rest day"
          className="w-full h-32 object-cover rounded-lg opacity-60"
        />
      </div>
    </div>
  );

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="bg-black min-h-screen">
        {/* Navigation Drawer */}
        {showDrawer && (
          <div className="fixed inset-0 z-50 flex">
            <div 
              className="flex-1 bg-black bg-opacity-50"
              onClick={() => setShowDrawer(false)}
            />
            <div className="w-80 bg-gray-900 border-l border-gray-800 p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white">Workout Tracker</h2>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
                  Select Day
                </h3>
                {DAYS.map(day => {
                  const hasWorkout = workoutData.workout_plan[day as keyof typeof workoutData.workout_plan];
                  return (
                    <button
                      key={day}
                      onClick={() => {
                        setCurrentDay(day);
                        setShowDrawer(false);
                      }}
                      className={`
                        w-full text-left p-3 rounded-lg transition-colors capitalize
                        ${currentDay === day 
                          ? 'bg-blue-600 text-white' 
                          : hasWorkout 
                            ? 'text-white hover:bg-gray-800' 
                            : 'text-gray-500 hover:bg-gray-800'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span>{day}</span>
                        {!hasWorkout && (
                          <span className="text-xs text-gray-500">Rest</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Menu Button */}
        <button
          onClick={() => setShowDrawer(true)}
          className="fixed top-4 left-4 z-40 p-3 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-full transition-colors"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>

        {/* Main Content */}
        {workout ? (
          <WorkoutDay day={currentDay} workoutData={workout} />
        ) : (
          <RestDayCard />
        )}
      </div>
    </div>
  );
}

export default App;