import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      {/* Header */}
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          🛫 AeroTimer
        </h1>
        <p className="text-blue-200">
          Flight-themed Pomodoro Timer
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-blue-300 text-sm">
        Choose your route and start your productive flight ✈️
      </footer>
    </div>
  );
};

export default Layout;
