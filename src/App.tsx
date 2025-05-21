import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import TimerDisplay from './components/timer/TimerDisplay';
import TimerControls from './components/timer/TimerControls';
import AirportSelector from './components/airports/AirportSelector';
import { Airport } from './types/airport';

const App: React.FC = () => {
  const [origin, setOrigin] = useState<Airport | null>(null);
  const [destination, setDestination] = useState<Airport | null>(null);

  return (
    <AppProvider>
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
    </AppProvider>
  );
};

export default App;
