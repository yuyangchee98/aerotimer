import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import TimerDisplay from './components/timer/TimerDisplay';
import TimerControls from './components/timer/TimerControls';
import CompletionModal from './components/timer/CompletionModal';
import AirportSelector from './components/airports/AirportSelector';
import FlightMap from './components/globe/FlightMap';
import { Airport } from './types/airport';
import { useFlightData } from './hooks/useFlightData';
import { useAppContext } from './context/AppContext';
import { useTimer } from './hooks/useTimer';

const AppContent: React.FC = () => {
  const [origin, setOrigin] = useState<Airport | null>(null);
  const [destination, setDestination] = useState<Airport | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);
  const { setFlightRoute } = useFlightData();
  const { state } = useAppContext();
  const { actions: timerActions } = useTimer();

  // Update flight route when airports change
  useEffect(() => {
    setFlightRoute(origin, destination);
  }, [origin, destination]);

  // Show completion modal when timer completes
  useEffect(() => {
    if (state.timer.isComplete && state.flight.route) {
      setShowCompletionModal(true);
    }
  }, [state.timer.isComplete, state.flight.route]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Prevent shortcuts when typing in inputs
      if (event.target && (event.target as HTMLElement).tagName === 'INPUT') {
        return;
      }

      switch (event.key) {
        case 'Escape':
        case 'h':
        case 'H':
          setShowOverlays(prev => !prev);
          break;
        case ' ': // Spacebar
          event.preventDefault();
          if (state.timer.isRunning) {
            timerActions.pauseTimer();
          } else if (!state.timer.isComplete) {
            timerActions.startTimer();
          }
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          timerActions.resetTimer();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [state.timer.isRunning, state.timer.isComplete, timerActions]);

  const handleCloseModal = () => {
    setShowCompletionModal(false);
  };

  return (
    <Layout>
      {/* Globe Background - Always rendered */}
      <FlightMap />
      
      {/* Overlays - Conditionally shown */}
      {showOverlays && (
        <>
          {/* Mobile: Stack vertically, Desktop: Separate positions */}
          <div className="md:hidden absolute top-4 left-4 right-4 z-10 space-y-4">
            {/* Mobile stacked layout */}
            <div className="bg-black/30 backdrop-blur-md rounded-lg border border-white/20 p-3">
              <AirportSelector
                origin={origin}
                destination={destination}
                onOriginChange={setOrigin}
                onDestinationChange={setDestination}
              />
            </div>
            <div className="bg-black/30 backdrop-blur-md rounded-lg border border-white/20 p-4">
              <TimerDisplay />
            </div>
          </div>

          {/* Desktop: Separate positioned overlays */}
          <div className="hidden md:block">
            {/* Airport Selection - Top Left */}
            <div className="absolute top-4 left-4 z-10 max-w-md lg:max-w-sm xl:max-w-md">
              <div className="bg-black/30 backdrop-blur-md rounded-lg border border-white/20 p-3 lg:p-4">
                <AirportSelector
                  origin={origin}
                  destination={destination}
                  onOriginChange={setOrigin}
                  onDestinationChange={setDestination}
                />
              </div>
            </div>

            {/* Timer Display - Top Center */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-black/30 backdrop-blur-md rounded-lg border border-white/20 p-4 lg:p-6">
                <TimerDisplay />
              </div>
            </div>
          </div>

          {/* Timer Controls - Bottom Center */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 md:bottom-8">
            <div className="bg-black/30 backdrop-blur-md rounded-lg border border-white/20 p-3 lg:p-4">
              <TimerControls />
            </div>
          </div>
        </>
      )}

      {/* Toggle UI Button */}
      <button
        onClick={() => setShowOverlays(prev => !prev)}
        className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md rounded-full p-2 md:p-3 border border-white/20 text-white hover:bg-black/70 transition-colors"
        title="Toggle UI (H)"
      >
        {showOverlays ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>

      {/* Keyboard Hint */}
      {!showOverlays && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-black/50 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 text-white text-sm text-center">
            <div>Press H or ESC to show controls</div>
            <div className="text-xs opacity-70 mt-1">F: Toggle flight follow • Space: Play/Pause • R: Reset</div>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      <CompletionModal 
        isOpen={showCompletionModal}
        onClose={handleCloseModal}
      />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;