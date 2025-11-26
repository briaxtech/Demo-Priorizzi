import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { useLanguage } from '../context/LanguageContext';

// Configuración del comportamiento del bot para ser HUMANO y CONCISO
const SYSTEM_INSTRUCTION = `You are Alex, a senior consultant at Many BrIAx. You are chatting with a potential client on the website.

**CRITICAL RULES FOR REALISM (MUST FOLLOW):**
1.  **EXTREME BREVITY:** Write like a human on a chat app (WhatsApp/Slack). Maximum 1 or 2 short sentences per message. NEVER write long paragraphs.
2.  **NO ROBOTIC FILLERS:** Never say "How can I assist you?", "Certainly!", "I understand". Just answer directly.
3.  **NO LISTS:** NEVER use bullet points. Conversational text only.
4.  **LOWERCASE IS OK:** You can occasionally start sentences with lowercase or skip punctuation to look more human.
5.  **LANGUAGE:** Detect the user's language (Spanish or English) and stick to it.

**YOUR GOAL:**
Identify if they have financial leaks in their clinic/hospital and casually suggest the "Free Financial Check-up". Don't push hard. Just suggest it as a logical next step.

**EXAMPLE (Spanish):**
User: "Hola, quiero saber precios."
You: "Hola. Depende del tamaño de tu clínica. ¿Sientes que estás perdiendo margen últimamente?"

**EXAMPLE (English):**
User: "How does it work?"
You: "We basically find where you're losing money in 48h. Usually, it's hidden costs. Want to try a quick free check-up?"
`;

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const GeminiAgent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { t } = useLanguage();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);

  // Generador de ID único simple
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Inicializar chat al abrir
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Mensaje de bienvenida inicial (simulado)
      const initialMsg: Message = {
        id: generateId(),
        role: 'model',
        text: t.agent.welcome_question // "Ready to find out where your clinic is losing money? Talk to me."
      };
      setMessages([initialMsg]);
    }
  }, [isOpen, t]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const initChat = () => {
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API Key missing");
      }

      const ai = new GoogleGenAI({ apiKey });
      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview', // Usando modelo avanzado para mejor razonamiento
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7, // Un poco de creatividad para sonar humano
        },
        history: [
            {
                role: 'user',
                parts: [{ text: "Start the conversation comfortably." }]
            },
            {
                role: 'model',
                parts: [{ text: t.agent.welcome_question }]
            }
        ]
      });
      chatSessionRef.current = chat;
    } catch (err) {
      console.error("Error initializing chat", err);
      setError("Config error");
    }
  };

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || inputValue.trim();
    if (!textToSend) return;

    if (!chatSessionRef.current) {
      initChat();
    }

    // 1. Agregar mensaje del usuario
    const userMsg: Message = { id: generateId(), role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    setError(null);

    try {
        // 2. Enviar a Gemini (Stream)
        if (!chatSessionRef.current) throw new Error("Chat not initialized");

        const result = await chatSessionRef.current.sendMessageStream({ message: textToSend });
        
        const botMsgId = generateId();
        let fullText = '';
        
        // Agregar burbuja del bot vacía inicialmente
        setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '' }]);

        for await (const chunk of result) {
            const chunkText = (chunk as GenerateContentResponse).text;
            if (chunkText) {
                fullText += chunkText;
                setMessages(prev => 
                    prev.map(msg => 
                        msg.id === botMsgId ? { ...msg, text: fullText } : msg
                    )
                );
            }
        }
    } catch (err: any) {
        console.error("Chat error:", err);
        let errorMsg = "Sorry, connection issue.";
        if (err.message?.includes("403")) errorMsg = "API Key Error (Check Console)";
        
        setMessages(prev => [...prev, { id: generateId(), role: 'model', text: errorMsg }]);
    } finally {
        setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!chatSessionRef.current && !isOpen) {
        initChat(); // Pre-load chat when opening
    }
  };

  return (
    <>
      {/* LAUNCHER */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <div 
            className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-5 w-[300px] border border-gray-100 cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={toggleOpen}
          >
            <div className="flex items-center space-x-4 mb-5">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md">
                   <svg className="w-8 h-8 text-white opacity-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
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
              <span>{t.agent.launcher_cta}</span>
            </button>
          </div>
        </div>
      )}

      {/* CHAT INTERFACE */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-100 flex flex-col h-[550px] animate-fade-in-up font-sans">
          
          {/* Header */}
          <div className="bg-white p-4 flex items-center justify-between border-b border-gray-100 shadow-sm z-10">
            <div className="flex items-center">
              <div className="relative mr-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold border border-emerald-200">
                  A
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-sm">Alex</h3>
                <p className="text-xs text-emerald-600 font-medium">Senior Consultant</p>
              </div>
            </div>
            <button 
              onClick={toggleOpen}
              className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 bg-gray-50 p-4 overflow-y-auto chat-scrollbar flex flex-col space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-black text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                 <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
             {/* Suggestions: Changed to flex-wrap to avoid ugly scrollbars */}
             {messages.length < 3 && t.agent.suggestions && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {t.agent.suggestions.map((sug, i) => (
                        <button 
                            key={i}
                            onClick={() => handleSendMessage(sug)}
                            className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors border border-emerald-100"
                        >
                            {sug}
                        </button>
                    ))}
                </div>
             )}

             <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe un mensaje..."
                  className="w-full bg-gray-100 text-gray-900 placeholder-gray-500 pl-4 pr-12 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white transition-all text-sm border-transparent border focus:border-emerald-200"
                />
                <button 
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-1.5 bg-black text-white p-2 rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
             </div>
             <div className="text-center mt-2">
                 <p className="text-[10px] text-gray-400">Powered by Gemini 3.0</p>
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiAgent;