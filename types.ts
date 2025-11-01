export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  isTyping?: boolean;
  imageUrl?: string;
  imageCaption?: string;
  suggestions?: string[];
}