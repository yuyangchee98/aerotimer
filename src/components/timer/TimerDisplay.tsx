import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { formatFlightDuration, formatDistance } from '../../utils/flightPath';

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
    <div className="text-center space-y-3 md:space-y-4 w-full max-w-80 md:min-w-80">
      {/* Flight Route Info - Compact */}
      {flight.route && (
        <div className="text-white">
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="text-center">
              <div className="font-bold text-lg">{flight.route.origin?.iata || flight.route.origin?.icao}</div>
              <div className="text-xs text-blue-200">{flight.route.origin?.city}</div>
            </div>
            <div className="flex-1 mx-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="flex-1 h-px bg-blue-300"></div>
                <span className="text-blue-200 text-lg">✈</span>
                <div className="flex-1 h-px bg-blue-300"></div>
              </div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{flight.route.destination?.iata || flight.route.destination?.icao}</div>
              <div className="text-xs text-blue-200">{flight.route.destination?.city}</div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 text-xs text-blue-200">
            <span>{formatDistance(flight.route.distance)}</span>
            <span>{formatFlightDuration(flight.route.duration)}</span>
            <span>{Math.round(flight.route.progress * 100)}% complete</span>
          </div>
        </div>
      )}

      {/* Timer Display - More prominent */}
      <div className="space-y-3">
        <div className={`text-4xl md:text-6xl font-mono font-bold transition-colors ${
          timer.isComplete ? 'text-green-400' : 
          timer.remainingTime < 300 ? 'text-yellow-400' : 
          'text-white'
        }`}>
          {formatTime(timer.remainingTime)}
        </div>

        {/* Progress Bar - Compact */}
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              timer.isComplete ? 'bg-green-400' : 'bg-blue-400'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Status - Compact */}
        <div className="text-sm text-blue-200">
          {timer.isComplete ? 'Flight Complete!' : 
           timer.isRunning ? 'In Flight' :
           timer.isPaused ? 'Flight Paused' : 
           flight.route ? 'Ready for Takeoff' : 'Select Route'}
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;