# Workout Tracker

A mobile-first React + TypeScript workout tracking application with interactive timers, progress tracking, and dark theme.

## Features

- **Smart Day Detection**: Automatically detects today's workout using moment.js
- **Hash Routing**: Deep-link support for specific days (`#/monday`, `#/tuesday`, etc.)
- **Interactive Timers**: Rest timers with countdown, notifications, and audio alerts
- **Progress Tracking**: Persistent progress saved to localStorage
- **Mobile Optimized**: Touch-friendly interface with swipe gestures
- **Wake Lock**: Keeps screen awake during workouts
- **Dark Theme**: AMOLED-friendly dark design with day-based accent colors

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Usage

- The app automatically shows today's workout on launch
- Use the menu button (top-left) to navigate between days
- Tap checkboxes to mark sets as complete
- Swipe left on any set to skip it
- Rest timers start automatically after completing a set
- Use +30s/-15s buttons to adjust timer duration
- Progress is automatically saved and persists between sessions

## Project Structure

```
src/
├── data/workout.json          # Workout plan data
├── components/
│   ├── WorkoutDay.tsx         # Main workout view
│   ├── ExerciseCard.tsx       # Exercise accordion component
│   ├── SetRow.tsx             # Individual set row
│   └── TimerBanner.tsx        # Rest timer banner
├── hooks/
│   ├── useWakeLock.ts         # Screen wake lock hook
│   └── useTimer.ts            # Timer logic hook
├── utils/
│   ├── dateHelpers.ts         # Date utilities and color generation
│   └── sound.ts               # Audio and haptic feedback
├── App.tsx                    # Main app component
└── main.tsx                   # Entry point
```

## Browser Support

- Modern browsers with ES2020+ support
- Wake Lock API (Chrome 84+, Edge 84+)
- Web Audio API for sound notifications
- Vibration API for haptic feedback
- Notification API for background alerts

## Technologies

- React 18 + TypeScript
- Vite build system
- Tailwind CSS for styling
- Moment.js for date handling
- Lucide React for icons
- Web APIs: Wake Lock, Audio, Vibration, Notifications