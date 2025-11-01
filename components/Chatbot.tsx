import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message } from '../types';
import { getBotResponse } from '../services/geminiService';
import { CarIcon, IndustryIcon, JobsIcon, SendIcon, BackIcon, HomeIcon, DevelopmentsIcon, ImproveIcon, MapPinIcon } from './Icons';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import LanguageSwitcher from './LanguageSwitcher';


interface ChatbotProps {
  onReturnHome: () => void;
  onViewMap: () => void;
}

const IMAGE_URLS: Record<string, string> = {
  AUTO_CLUSTER: 'https://img.etimg.com/thumb/width-420,height-315,imgsize-38580,resizemode-75,msid-12019660/south/auto-cluster-hubli-dharwad-to-rev-up-entrepreneurism-smes-in-the-region/new-section/auto-cluster.jpg',
  SHOWROOM: 'https://content.jdmagicbox.com/comp/hubli/k5/0836px836.x836.161015131348.f4k5/catalogue/nexa-revankar-gokul-road-hubli-car-dealers-maruti-suzuki-hg02fo60st.jpg',
  EV_CHARGING: 'https://akm-img-a-in.tosshub.com/businesstoday/images/story/202210/charging-station-4636710_1280-sixteen_nine.jpg',
  MANUFACTURING: 'https://content.jdmagicbox.com/v2/comp/hubli/dc/0836px836.x836.100519195835.x5z3dc/catalogue/neo-valves-industries-tarihal-hubli-hydraulic-valve-dealers-xuwkybk56c.jpg',
  FLAG: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Flag_of_Karnataka.png',
  NIDEC_PLANT: 'https://etimg.etb2bimg.com/thumb/msid-121584218,imgsize-63712,width-1200,height=627,overlay-etmanufacturing,resizemode-75/news/hi-tech/nidec-launches-600-cr-manufacturing-plant-in-karnatakas-hubballi.jpg'
};


const QuickReplyButton: React.FC<{ text: string; icon: React.ReactNode; onClick: (text: string) => void }> = ({ text, icon, onClick }) => (
  <button
    onClick={() => onClick(text)}
    className="flex items-center gap-2 text-left bg-white/80 backdrop-blur-sm border border-yellow-400 text-gray-800 px-4 py-2 rounded-full hover:bg-yellow-100 transition-all duration-200 w-full md:w-auto text-sm shadow-md hover:shadow-lg"
  >
    {icon}
    <span className="font-medium">{text}</span>
  </button>
);


const Chatbot: React.FC<ChatbotProps> = ({ onReturnHome, onViewMap }) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const initialBotGreeting = t.initialBotGreeting;

  useEffect(() => {
    setMessages([{ id: 'initial-greeting', sender: 'bot', text: initialBotGreeting }]);
    setHasInteracted(false);
  }, [initialBotGreeting]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = useCallback(async (messageText: string) => {
    const trimmedMessage = messageText.trim();
    if (trimmedMessage === '' || isLoading) return;

    setHasInteracted(true);
    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: trimmedMessage };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    const typingIndicator: Message = { id: 'typing', sender: 'bot', text: '...', isTyping: true };
    setMessages(prev => [...prev, typingIndicator]);

    const botResponse = await getBotResponse(trimmedMessage, newMessages, language);
    
    const botMessage: Message = { 
      id: (Date.now() + 1).toString(), 
      sender: 'bot', 
      text: botResponse.text,
      suggestions: botResponse.suggestions,
    };
    
    if (botResponse.imageTag && IMAGE_URLS[botResponse.imageTag]) {
        botMessage.imageUrl = IMAGE_URLS[botResponse.imageTag];
        const captionKey = `imgCaption_${botResponse.imageTag.toLowerCase()}` as keyof typeof t;
        botMessage.imageCaption = t[captionKey];
    }

    setMessages(prev => [...prev.filter(m => !m.isTyping), botMessage]);
    setIsLoading(false);
  }, [isLoading, messages, language, t]);
  
  const handleQuickReplyClick = (text: string) => {
    handleSendMessage(text);
  };

  const handleReset = () => {
    setMessages([{ id: 'initial-greeting-reset', sender: 'bot', text: initialBotGreeting }]);
    setHasInteracted(false);
  };

  const renderMessage = (msg: Message) => {
    const isBot = msg.sender === 'bot';
    if (msg.isTyping) {
      return (
         <div key={msg.id} className="flex justify-start">
            <div className="bg-gray-200 rounded-lg px-4 py-2 max-w-xs md:max-w-md">
                <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
      );
    }
    
    return (
      <div key={msg.id} className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
        <div className={`relative rounded-2xl max-w-sm md:max-lg shadow-md ${isBot ? 'bg-white text-gray-800 bubble-bot' : 'bg-red-600 text-white bubble-user'}`}>
           {msg.imageUrl && (
            <figure className="overflow-hidden rounded-t-2xl">
              <img src={msg.imageUrl} alt={msg.imageCaption} className="w-full object-cover" />
              {msg.imageCaption && (
                 <figcaption className="p-2 text-xs text-center bg-black/50 text-white font-semibold">
                    {msg.imageCaption}
                 </figcaption>
              )}
            </figure>
           )}
           <p className="whitespace-pre-wrap p-4">{msg.text}</p>
        </div>
        {isBot && msg.suggestions && (
          <div className="flex flex-wrap gap-2 mt-3 max-w-sm md:max-lg">
            {msg.suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleQuickReplyClick(suggestion)}
                className="suggestion-button"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col w-full h-full bg-yellow-50 animate-fade-in">
        <header className="flex items-center justify-between p-4 bg-red-600 text-white shadow-lg z-10">
            <h2 className="text-xl font-bold">{t.chatbotTitle} 🤖</h2>
            <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <button onClick={onViewMap} className="p-2 rounded-full hover:bg-red-700 transition-colors" title={t.mapButtonTitle}><MapPinIcon /></button>
                <button onClick={handleReset} className="p-2 rounded-full hover:bg-red-700 transition-colors" title={t.backButtonTitle}><BackIcon /></button>
                <button onClick={onReturnHome} className="p-2 rounded-full hover:bg-red-700 transition-colors" title={t.homeButtonTitle}><HomeIcon /></button>
            </div>
        </header>
      <div ref={chatContainerRef} className="flex-grow p-6 space-y-6 overflow-y-auto custom-scrollbar">
        {messages.map(renderMessage)}
      </div>

       {!hasInteracted && (
         <div className="p-4 border-t border-yellow-200">
            <p className="text-sm text-gray-600 mb-2 font-semibold text-center">{t.quickRepliesTitle}</p>
            <div className="flex flex-wrap gap-2 justify-center">
                <QuickReplyButton text={t.quickReply1} icon={<IndustryIcon />} onClick={handleQuickReplyClick} />
                <QuickReplyButton text={t.quickReply2} icon={<CarIcon />} onClick={handleQuickReplyClick} />
                <QuickReplyButton text={t.quickReply3} icon={<JobsIcon />} onClick={handleQuickReplyClick} />
                <QuickReplyButton text={t.quickReply4} icon={<DevelopmentsIcon />} onClick={handleQuickReplyClick} />
                <QuickReplyButton text={t.quickReply5} icon={<ImproveIcon />} onClick={handleQuickReplyClick} />
            </div>
        </div>
      )}

      <footer className="p-4 border-t border-yellow-200 bg-white/70 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
            placeholder={t.inputPlaceholder}
            className="flex-grow w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-shadow"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={isLoading || inputValue.trim() === ''}
            className="bg-yellow-400 text-red-700 p-3 rounded-full hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110"
          >
           <SendIcon />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Chatbot;