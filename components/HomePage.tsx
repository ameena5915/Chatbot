import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import LanguageSwitcher from './LanguageSwitcher';
import { ChatIcon } from './Icons';


interface HomePageProps {
  onStartChat: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartChat }) => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4" style={{ background: 'linear-gradient(160deg, #FFC107, #F44336)' }}>
       <div className="absolute top-6 right-6 z-10">
          <LanguageSwitcher />
       </div>

      <div className="text-center text-white animate-fade-in-up">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.4)'}}>
            {t.homeTitle}
        </h1>
        <h2 className="mt-4 text-2xl md:text-3xl font-semibold opacity-90">
            {t.homeSubtitle}
        </h2>

        <div className="mt-12 bg-white/10 backdrop-blur-sm p-8 rounded-2xl max-w-3xl mx-auto border border-white/20">
            <p className="text-lg text-white/90">
            {t.homeDescription}
            </p>
            <p className="mt-6 text-xl font-medium text-yellow-300">
            {t.homeGreeting}
            </p>
        </div>
        
        <button
          onClick={onStartChat}
          className="mt-12 inline-flex items-center gap-4 px-10 py-5 bg-yellow-400 text-red-800 font-bold text-xl rounded-full shadow-2xl hover:bg-yellow-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-300 ease-in-out animate-pulse-bright"
          style={{ animationDelay: '0.3s' }}
        >
          <ChatIcon />
          {t.startChat}
        </button>
      </div>
    </div>
  );
};

export default HomePage;