import React, { useState } from 'react';
import HomePage from './components/HomePage';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import { LanguageProvider } from './contexts/LanguageContext';
import Map from './components/Map';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'chat' | 'map'>('home');

  const renderView = () => {
    switch (view) {
      case 'home':
        return <HomePage onStartChat={() => setView('chat')} />;
      case 'chat':
        return <Chatbot onReturnHome={() => setView('home')} onViewMap={() => setView('map')} />;
      case 'map':
        return <Map onReturnToChat={() => setView('chat')} onReturnHome={() => setView('home')} />;
      default:
        return <HomePage onStartChat={() => setView('chat')} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="h-screen flex flex-col bg-gray-50 font-sans">
        <main className="flex-grow flex flex-col items-center justify-center relative overflow-hidden">
          {renderView()}
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default App;