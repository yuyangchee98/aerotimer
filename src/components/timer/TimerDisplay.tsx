import React from 'react';
import { useAppContext } from '../../context/AppContext';

const TimerDisplay: React.FC = () => {
  const { state } = useAppContext();
  const { timer, flight } = state;

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercentage = timer.duration > 0 ? ((timer.duration - timer.remainingTime) / timer.duration) * 100 : 0;

  return (
    <div className="text-center space-y-6">
      {/* Flight Route Info */}
      {flight.route && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">{flight.route.origin?.iata || flight.route.origin?.icao}</span>
            <span className="text-blue-200">✈</span>
            <span className="font-medium">{flight.route.destination?.iata || flight.route.destination?.icao}</span>
          </div>
          <div className="text-xs text-blue-200">
            {flight.route.origin?.city} → {flight.route.destination?.city}
          </div>
          <div className="text-xs text-blue-300 mt-1">
            {Math.round(flight.route.distance)} km • {Math.round(flight.route.duration / 60)} min flight
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="space-y-4">
        <div className={`text-8xl font-mono font-bold transition-colors ${
          timer.isComplete ? 'text-green-400' : 
          timer.remainingTime < 300 ? 'text-yellow-400' : 
          'text-white'
        }`}>
          {formatTime(timer.remainingTime)}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              timer.isComplete ? 'bg-green-400' : 'bg-blue-400'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Status */}
        <div className="text-lg text-blue-200">
          {timer.isComplete ? '🎉 Flight Complete!' : 
           timer.isRunning ? '✈️ In Flight' :
           timer.isPaused ? '⏸️ Paused' : 
           '🛫 Ready for Takeoff'}
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;
