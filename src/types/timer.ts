export interface TimerState {
  duration: number; // in seconds
  remainingTime: number; // in seconds
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
}

export interface TimerActions {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setDuration: (duration: number) => void;
}

export type TimerStatus = 'idle' | 'running' | 'paused' | 'complete';
