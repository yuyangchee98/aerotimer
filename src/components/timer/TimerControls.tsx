import React from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { useTimer } from '../../hooks/useTimer';

const TimerControls: React.FC = () => {
  const { timer, actions } = useTimer();

  const handlePlayPause = () => {
    if (timer.isRunning) {
      actions.pauseTimer();
    } else {
      actions.startTimer();
    }
  };

  const handleReset = () => {
    actions.resetTimer();
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      {/* Play/Pause Button */}
      <button
        onClick={handlePlayPause}
        disabled={timer.isComplete}
        className={`
          flex items-center justify-center w-16 h-16 rounded-full transition-all
          ${timer.isComplete 
            ? 'bg-gray-500 cursor-not-allowed' 
            : 'bg-white text-blue-900 hover:bg-blue-50 hover:scale-105 active:scale-95'
          }
          disabled:opacity-50 shadow-lg
        `}
      >
        {timer.isRunning ? (
          <Pause size={24} />
        ) : (
          <Play size={24} className="ml-1" />
        )}
      </button>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="
          flex items-center justify-center w-12 h-12 rounded-full 
          bg-white/20 text-white hover:bg-white/30 transition-all
          hover:scale-105 active:scale-95 backdrop-blur-sm
        "
      >
        <Square size={16} />
      </button>
    </div>
  );
};

export default TimerControls;
