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

const AppContent: React.FC = () => {
  const [origin, setOrigin] = useState<Airport | null>(null);
  const [destination, setDestination] = useState<Airport | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const { setFlightRoute } = useFlightData();
  const { state } = useAppContext();

  // Update flight route when airports change
  useEffect(() => {
    setFlightRoute(origin, destination);
  }, [origin, destination]); // Remove setFlightRoute from dependencies

  // Show completion modal when timer completes
  useEffect(() => {
    if (state.timer.isComplete && state.flight.route) {
      setShowCompletionModal(true);
    }
  }, [state.timer.isComplete, state.flight.route]);

  const handleCloseModal = () => {
    setShowCompletionModal(false);
  };

  return (
    <Layout>
      {/* Airport Selection */}
      <AirportSelector
        origin={origin}
        destination={destination}
        onOriginChange={setOrigin}
        onDestinationChange={setDestination}
      />
      
      {/* Globe Visualization */}
      <FlightMap />
      
      {/* Timer Section */}
      <div className="space-y-8">
        <TimerDisplay />
        <TimerControls />
      </div>

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
