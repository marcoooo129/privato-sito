import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage, Product } from '../types';

interface AIStylistProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const AIStylist: React.FC<AIStylistProps> = ({ isOpen, onClose, products }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: 'Ciao! I am Luca, your personal stylist at Luce & Ombra. What is the occasion you are shopping for today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const modelMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '', isStreaming: true }]);

    try {
      // Pass the current products list to the AI service
      const stream = await sendMessageToGemini(userMsg.text, products);
      let fullText = "";
      
      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === modelMsgId ? { ...msg, text: fullText } : msg
          )
        );
        scrollToBottom();
      }
      
       setMessages(prev => 
          prev.map(msg => 
            msg.id === modelMsgId ? { ...msg, isStreaming: false } : msg
          )
        );

    } catch (error) {
       console.error(error);
       setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'Scusa, I lost my train of thought.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      
      {/* Panel */}
      <div className="relative w-full md:w-[450px] bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
          <div>
            <h3 className="font-serif text-xl text-stone-900">Luca AI Stylist</h3>
            <p className="text-xs text-stone-500 tracking-wider uppercase">Your Personal Assistant</p>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-900">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] p-4 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-stone-900 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl' 
                    : 'bg-white border border-stone-200 text-stone-800 rounded-tl-xl rounded-tr-xl rounded-br-xl shadow-sm'
                }`}
              >
                 {msg.role === 'model' && (
                   <span className="block text-[10px] text-stone-400 uppercase tracking-widest mb-1">Luca</span>
                 )}
                 <div className="whitespace-pre-wrap">{msg.text}</div>
                 {msg.isStreaming && <span className="inline-block w-1.5 h-3 ml-1 bg-stone-400 animate-pulse"/>}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-stone-100">
          <div className="flex items-center bg-stone-50 border border-stone-200 rounded-full px-4 py-2 focus-within:ring-1 focus-within:ring-gold-400 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for advice..."
              className="flex-1 bg-transparent border-none focus:outline-none text-sm text-stone-800 placeholder-stone-400"
              disabled={isLoading}
            />
            <button 
              onClick={handleSend} 
              disabled={isLoading}
              className={`ml-2 p-2 rounded-full ${isLoading ? 'bg-stone-200' : 'bg-stone-900 hover:bg-gold-500'} text-white transition-colors`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A2.001 2.001 0 005.694 10.25l5.093 1.274a.498.498 0 010 .954l-5.093 1.274a2.002 2.002 0 00-1.996 2.086l1.414 4.925a.75.75 0 001.35.34l12.42-7.887a.75.75 0 000-1.235L4.455 2.628z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};