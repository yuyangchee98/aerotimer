import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { formatFlightDuration, formatDistance } from '../../utils/flightPath';
import { X, RotateCcw } from 'lucide-react';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CompletionModal: React.FC<CompletionModalProps> = ({ isOpen, onClose }) => {
  const { state, actions } = useAppContext();
  const { flight } = state;

  if (!isOpen || !flight.route) return null;

  const handleStartNewFlight = () => {
    actions.resetTimer();
    onClose();
  };

  const handleKeepRoute = () => {
    actions.resetTimer();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Celebration */}
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Flight Complete!
        </h2>
        <p className="text-gray-600 mb-6">
          Welcome to your destination!
        </p>

        {/* Flight Summary */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-center">
              <div className="font-bold text-lg text-blue-900">
                {flight.route.origin?.iata || flight.route.origin?.icao}
              </div>
              <div className="text-sm text-blue-600">
                {flight.route.origin?.city}
              </div>
            </div>
            <div className="flex-1 mx-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="flex-1 h-px bg-blue-300"></div>
                <span className="text-blue-600 text-xl">✈</span>
                <div className="flex-1 h-px bg-blue-300"></div>
              </div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-blue-900">
                {flight.route.destination?.iata || flight.route.destination?.icao}
              </div>
              <div className="text-sm text-blue-600">
                {flight.route.destination?.city}
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 text-sm text-blue-700">
            <span>📏 {formatDistance(flight.route.distance)}</span>
            <span>⏱️ {formatFlightDuration(flight.route.duration)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={handleKeepRoute}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw size={18} />
            <span>Fly This Route Again</span>
          </button>
          
          <button
            onClick={handleStartNewFlight}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Choose New Destination
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Great work on your focused session! 🚀
        </p>
      </div>
    </div>
  );
};

export default CompletionModal;
