import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { WorkoutDay } from './components/WorkoutDay';
import { getCurrentDay } from './utils/dateHelpers';
import workoutData from './data/workout.json';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function App() {
  const [currentDay, setCurrentDay] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

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
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    // Update hash when day changes
    window.location.hash = `#/${currentDay}`;
  }, [currentDay]);

  const workout = workoutData.workout_plan[currentDay as keyof typeof workoutData.workout_plan];
  const availableDays = Object.keys(workoutData.workout_plan);

  const RestDayCard = () => (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black' : 'bg-white'} flex items-center justify-center p-4`}>
      <div className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'} border rounded-lg p-8 text-center max-w-sm`}>
        <div className={`w-24 h-24 mx-auto mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
          <Calendar className={`w-12 h-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </div>
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'} mb-2`}>Rest Day</h2>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
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


    <div className={`${isDarkMode ? 'bg-black' : 'bg-white'} min-h-screen`}>
        {workout ? (
          <WorkoutDay 
            day={currentDay} 
            workoutData={workout} 
            onDayChange={setCurrentDay}
            isDarkMode={isDarkMode}
            onThemeToggle={() => setIsDarkMode(!isDarkMode)}
            availableDays={availableDays}
          />
        ) : (
          <RestDayCard />
        )}
    </div>
  );
}

export default App;