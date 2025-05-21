import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
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
          flex items-center justify-center w-14 h-14 rounded-full transition-all
          ${timer.isComplete 
            ? 'bg-gray-500/50 cursor-not-allowed text-white/50' 
            : 'bg-white/90 text-blue-900 hover:bg-white hover:scale-105 active:scale-95'
          }
          disabled:opacity-50 shadow-lg backdrop-blur-sm
        `}
        title={`${timer.isRunning ? 'Pause Flight (Space)' : 'Start Flight (Space)'} • Press F to toggle flight following`}
      >
        {timer.isRunning ? (
          <Pause size={20} />
        ) : (
          <Play size={20} className="ml-0.5" />
        )}
      </button>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="
          flex items-center justify-center w-12 h-12 rounded-full 
          bg-white/20 text-white hover:bg-white/30 transition-all
          hover:scale-105 active:scale-95 backdrop-blur-sm border border-white/20
        "
        title="Reset Timer (R)"
      >
        <RotateCcw size={18} />
      </button>
    </div>
  );
};

export default TimerControls;