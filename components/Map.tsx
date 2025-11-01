import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import LanguageSwitcher from './LanguageSwitcher';
import { BackIcon, HomeIcon } from './Icons';

interface MapPageProps {
  onReturnToChat: () => void;
  onReturnHome: () => void;
}

const Map: React.FC<MapPageProps> = ({ onReturnToChat, onReturnHome }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const mapUrl = "https://maps.google.com/maps?q=Automobile%20Showrooms%20in%20Hubballi-Dharwad&t=&z=12&ie=UTF8&iwloc=&output=embed";

  return (
    <div className="flex flex-col w-full h-full bg-yellow-50 animate-fade-in">
        <header className="flex items-center justify-between p-4 bg-red-600 text-white shadow-lg z-10">
            <h2 className="text-xl font-bold">{t.mapTitle}</h2>
            <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <button onClick={onReturnToChat} className="p-2 rounded-full hover:bg-red-700 transition-colors" title={t.chatButtonTitle}><BackIcon /></button>
                <button onClick={onReturnHome} className="p-2 rounded-full hover:bg-red-700 transition-colors" title={t.homeButtonTitle}><HomeIcon /></button>
            </div>
        </header>
      <div className="p-6 text-center flex-grow flex flex-col">
        <p className="text-gray-700 max-w-2xl mx-auto font-medium">{t.mapDescription}</p>
        <div className="mt-4 rounded-2xl shadow-xl overflow-hidden border-4 border-yellow-400 flex-grow">
          <iframe
            src={mapUrl}
            className="w-full h-full"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t.mapTitle}
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Map;