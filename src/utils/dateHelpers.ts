import moment from 'moment';

export const getCurrentDay = (): string => {
  return moment().format('dddd').toLowerCase();
};

export const getAccentColor = (day: string): string => {
  // Simple hash function to generate consistent colors for each day
  let hash = 0;
  for (let i = 0; i < day.length; i++) {
    const char = day.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  const colors = [
    'rgb(59, 130, 246)',   // blue
    'rgb(16, 185, 129)',   // emerald
    'rgb(245, 101, 101)',  // red
    'rgb(139, 92, 246)',   // violet
    'rgb(251, 146, 60)',   // orange
    'rgb(236, 72, 153)',   // pink
    'rgb(34, 197, 94)',    // green
  ];
  
  return colors[Math.abs(hash) % colors.length];
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};