
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import { LanguageIcon } from './Icons';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'kn' : 'en';
    setLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors text-sm font-semibold"
      title="Switch Language"
    >
      <LanguageIcon />
      <span>{translations[language].languageSwitcher}</span>
    </button>
  );
};

export default LanguageSwitcher;
