import React from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import TimerDisplay from './components/timer/TimerDisplay';
import TimerControls from './components/timer/TimerControls';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Layout>
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
