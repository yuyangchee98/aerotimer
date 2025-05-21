import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import TimerDisplay from './components/timer/TimerDisplay';
import TimerControls from './components/timer/TimerControls';
import AirportSelector from './components/airports/AirportSelector';
import { Airport } from './types/airport';
import { useFlightData } from './hooks/useFlightData';

const AppContent: React.FC = () => {
  const [origin, setOrigin] = useState<Airport | null>(null);
  const [destination, setDestination] = useState<Airport | null>(null);
  const { setFlightRoute } = useFlightData();

  // Update flight route when airports change
  useEffect(() => {
    setFlightRoute(origin, destination);
  }, [origin, destination, setFlightRoute]);

  return (
    <Layout>
      {/* Airport Selection */}
      <AirportSelector
        origin={origin}
        destination={destination}
        onOriginChange={setOrigin}
        onDestinationChange={setDestination}
      />
      
      {/* Timer Section */}
      <div className="space-y-8">
        <TimerDisplay />
        <TimerControls />
      </div>
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
