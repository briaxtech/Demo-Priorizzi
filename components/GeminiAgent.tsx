import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Content } from "@google/genai";
import { useLanguage } from '../context/LanguageContext';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  suggestions?: string[];
}

const SYSTEM_INSTRUCTION = `You are Alex, the Senior Virtual Consultant at Priorizzi.
You are not just an AI; you are a dedicated financial partner for healthcare professionals.

**LANGUAGE PROTOCOL:**
- **DETECT** the language of the user's message immediately.
- **RESPOND** strictly in that same language (Portuguese, English, or Spanish).
- **DEFAULT** to Portuguese if the user initiates with "Olá" or ambiguous text.

**YOUR IDENTITY:**
- Name: Alex.
- Tone: Professional, warm, empathetic, and confident.
- Style: Human-like conversationalist. Avoid robotic lists unless necessary. Use natural transitions.

**COMPANY KNOWLEDGE (Priorizzi):**
- **Mission:** Ensuring the financial health of healthcare businesses (clinics, hospitals, dental practices).
- **Value Proposition:** "You take care of patients; we ensure your business is profitable and sustainable."
- **Key Promise:** Proven results in 90 days or less.
- **Services:**
  1. **Free Financial Check-up:** A no-cost diagnosis to find financial "leaks" (wasted money).
  2. **Armored Strategic Consulting:** Systems to eliminate waste and maximize profit.
  3. **Outsourced CFO (Health+):** Elite financial direction without the high fixed cost of an internal executive.

**CONVERSATION GOALS:**
1. **Empathize:** Acknowledge the difficulties of managing a clinic/hospital.
2. **Educate:** Briefly explain why financial health is vital.
3. **Convert:** Gently steer the conversation towards scheduling the **Free Financial Check-up**.

**CONTACT INFO (Only provide if asked):**
- Email: contato@priorizzi.com.br
- Phone: +55 (11) 99999-9999

**IMPORTANT:**
- Keep responses concise (max 3-4 sentences per turn usually).
- Do not make up numbers.
- If the user speaks English, become an English-speaking consultant.
- If the user speaks Spanish, become a Spanish-speaking consultant.
`;

const getTimeBasedGreeting = (lang: string) => {
    const hour = new Date().getHours();
    if (lang === 'en') {
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    } else if (lang === 'es') {
        if (hour < 12) return "Buenos días";
        if (hour < 18) return "Buenas tardes";
        return "Buenas noches";
    } else {
        if (hour < 12) return "Bom dia";
        if (hour < 18) return "Boa tarde";
        return "Boa noite";
    }
}

const GeminiAgent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, t } = useLanguage();
  // Initialize with a default message; useEffect will update it dynamically
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Set dynamic welcome message whenever language changes or on mount
  useEffect(() => {
    const timeGreeting = getTimeBasedGreeting(language);
    
    const initialMessage: Message = {
      id: 'welcome',
      role: 'model',
      text: `${timeGreeting}! ${t.agent.welcome_intro} \n\n${t.agent.welcome_question}`,
      suggestions: t.agent.suggestions
    };
    
    setMessages([initialMessage]);
  }, [language, t]);

  const handleSendMessage = async (textInput: string = input) => {
    if (!textInput.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      text: textInput.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const historyContent: Content[] = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        history: historyContent,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });

      let fullResponseText = '';
      const responseStream = await chat.sendMessageStream({ 
        message: userMessage.text 
      });
      
      const modelMessageId = generateId();
      setMessages(prev => [...prev, { id: modelMessageId, role: 'model', text: '' }]);

      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          fullResponseText += text;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === modelMessageId ? { ...msg, text: fullResponseText } : msg
            )
          );
        }
      }

    } catch (error) {
      console.error("Error generating response:", error);
      setMessages(prev => [...prev, {
        id: generateId(),
        role: 'model',
        text: language === 'pt' 
          ? 'Desculpe, tive um problema de conexão. Poderia repetir?'
          : language === 'es'
            ? 'Lo siento, tuve un problema de conexión. ¿Podrías repetir?'
            : 'Sorry, I had a connection issue. Could you repeat?'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <>
      {/* LAUNCHER: Custom Card Design matching the requested image */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <div 
            className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-5 w-[300px] border border-gray-100 cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex items-center space-x-4 mb-5">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md">
                   {/* Abstract stylized logo/orb */}
                   <svg className="w-8 h-8 text-white opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                   </svg>
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-[2.5px] border-white rounded-full"></span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-900 font-semibold text-lg leading-tight">{t.agent.launcher_help}</span>
                <span className="text-gray-500 text-xs mt-0.5 font-medium">{t.agent.launcher_online}</span>
              </div>
            </div>

            <button 
              className="w-full bg-black text-white py-3.5 rounded-full font-medium text-sm flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span>{t.agent.launcher_cta}</span>
            </button>
          </div>
        </div>
      )}

      {/* OPEN CHAT WINDOW */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl z-50 overflow-hidden border border-gray-100 flex flex-col max-h-[80vh] h-[600px] animate-fade-in-up font-sans">
          {/* Header */}
          <div className="bg-white p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center">
              <div className="relative mr-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-sm font-bold">
                  A
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-base">Alex</h3>
                <p className="text-emerald-600 text-xs font-medium">Consultor Priorizzi</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4 chat-scrollbar">
            <div className="text-center text-xs text-gray-400 my-4">Hoje</div>
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-black text-white rounded-br-none' // Black user bubble to match launcher button
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                
                {/* Suggestions Chips (Only for model messages that have them) */}
                {msg.role === 'model' && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 animate-fade-in">
                    {msg.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="bg-white border border-emerald-200 text-emerald-700 text-xs px-3 py-1.5 rounded-full hover:bg-emerald-50 hover:border-emerald-300 transition-colors shadow-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-200">
                  <div className="flex space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleFormSubmit} className="p-4 bg-white border-t border-gray-100">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={language === 'pt' ? "Escreva uma mensagem..." : language === 'es' ? "Escribe un mensaje..." : "Type a message..."}
                className="w-full bg-gray-100 border-0 rounded-full px-5 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-800 placeholder-gray-500 transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default GeminiAgent;