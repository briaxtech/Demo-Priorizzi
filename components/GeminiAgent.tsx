import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { useLanguage } from '../context/LanguageContext';

const SYSTEM_INSTRUCTION = `You are Alex, the Senior Virtual Consultant at Many BrIAx (Healthcare Financial Management).

**CORE BEHAVIOR:**
- You are a VOICE agent. Keep responses CONCISE, WARM, and SPOKEN-STYLE (short sentences).
- **DETECT** the user's language from their audio and reply in the SAME language (Portuguese, English, or Spanish).
- Do NOT list options with bullet points. Speak naturally.

**KNOWLEDGE:**
- Services: Free Financial Check-up, Consulting, Outsourced CFO.
- Goal: Help clinics multiply profits in 90 days.
- Contact: contato@manybriax.com.br

**OBJECTIVE:**
- Empathize with financial stress.
- Briefly explain value.
- Encourage scheduling the Free Check-up.
`;

// Audio Utils for Live API
function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function floatTo16BitPCM(float32Array: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < float32Array.length; i++) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  return buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const GeminiAgent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'listening' | 'speaking'>('disconnected');
  const [volume, setVolume] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { t } = useLanguage();
  
  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);
  const isMutedRef = useRef(false);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Cleanup function
  const disconnect = () => {
    setIsActive(false);
    setStatus('disconnected');
    setIsMuted(false);
    isMutedRef.current = false;
    // Note: We don't clear error here automatically so user can see what happened

    stopAllAudio();

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (inputSourceRef.current) {
        inputSourceRef.current.disconnect();
        inputSourceRef.current = null;
    }
    if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    sessionRef.current = null;
  };

  const stopAllAudio = () => {
    audioSourcesRef.current.forEach(source => {
        try {
            source.stop();
        } catch (e) {
            // Ignore errors
        }
    });
    audioSourcesRef.current.clear();
    
    if (audioContextRef.current) {
        nextStartTimeRef.current = audioContextRef.current.currentTime;
    }
  };

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    isMutedRef.current = newState;
  };

  const startSession = async () => {
    try {
      setError(null);
      setStatus('connecting');
      setIsActive(true);

      // 1. Setup Audio Context
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass({ sampleRate: 24000 });
      audioContextRef.current = audioContext;
      nextStartTimeRef.current = audioContext.currentTime;

      // 2. Get Microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: {
        sampleRate: 16000,
        channelCount: 1,
        echoCancellation: true,
        autoGainControl: true,
        noiseSuppression: true
      }});
      streamRef.current = stream;

      // 3. Connect to Gemini Live API
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        callbacks: {
            onopen: () => {
                setStatus('listening');
                console.log("Gemini Live Session Opened");
            },
            onmessage: async (message: LiveServerMessage) => {
                const interrupted = message.serverContent?.interrupted;
                if (interrupted) {
                    console.log("Interrupted by user");
                    stopAllAudio();
                    setStatus('listening');
                    return;
                }

                const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                
                if (base64Audio) {
                    setStatus('speaking');
                    
                    const pcmData = base64ToUint8Array(base64Audio);
                    const dataInt16 = new Int16Array(pcmData.buffer);
                    const float32 = new Float32Array(dataInt16.length);
                    for(let i=0; i<dataInt16.length; i++) {
                        float32[i] = dataInt16[i] / 32768.0;
                    }

                    const audioBuffer = audioContext.createBuffer(1, float32.length, 24000);
                    audioBuffer.getChannelData(0).set(float32);

                    const source = audioContext.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(audioContext.destination);
                    
                    audioSourcesRef.current.add(source);

                    const startTime = Math.max(nextStartTimeRef.current, audioContext.currentTime);
                    source.start(startTime);
                    nextStartTimeRef.current = startTime + audioBuffer.duration;

                    source.onended = () => {
                        audioSourcesRef.current.delete(source);
                        if (audioContext.currentTime >= nextStartTimeRef.current - 0.1) {
                            setStatus('listening');
                        }
                    };
                }
            },
            onclose: (event) => {
                console.log("Session closed", event);
                disconnect();
            },
            onerror: (err) => {
                console.error("Session error", err);
                setError("Connection failed. Please check if the 'Generative Language API' is enabled for your API Key in Google Cloud Console.");
                disconnect();
            }
        }
      });

      sessionRef.current = sessionPromise;

      // 4. Setup Audio Input (Mic -> Gemini)
      const inputContext = new AudioContextClass({ sampleRate: 16000 });
      const micSource = inputContext.createMediaStreamSource(stream);
      const processor = inputContext.createScriptProcessor(4096, 1, 1);
      
      processor.onaudioprocess = (e) => {
        if (!isActive) return;

        if (isMutedRef.current) {
          setVolume(0);
          return;
        }

        const inputData = e.inputBuffer.getChannelData(0);
        
        // Visualizer volume calculation
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
            sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        
        if (status === 'listening' && rms > 0.01) {
             setVolume(Math.min(rms * 5, 1));
        } else if (status === 'speaking') {
             setVolume(0.2);
        } else if (rms <= 0.01) {
            setVolume(0);
        }

        const pcm16 = floatTo16BitPCM(inputData);
        const base64 = arrayBufferToBase64(pcm16);

        sessionPromise.then(session => {
            session.sendRealtimeInput({
                media: {
                    mimeType: 'audio/pcm;rate=16000',
                    data: base64
                }
            });
        }).catch(e => {
            console.error("Error sending input", e);
        });
      };

      micSource.connect(processor);
      const gainNode = inputContext.createGain();
      gainNode.gain.value = 0;
      processor.connect(gainNode);
      gainNode.connect(inputContext.destination);
      
      inputSourceRef.current = micSource;
      processorRef.current = processor;

    } catch (error: any) {
      console.error("Failed to start voice session:", error);
      setError(error.message || "Failed to start session");
      disconnect();
    }
  };

  const toggleOpen = () => {
    if (isOpen) {
      setIsOpen(false);
      disconnect();
    } else {
      setIsOpen(true);
      setError(null);
      setTimeout(() => {
          startSession();
      }, 300);
    }
  };

  const retryConnection = () => {
      disconnect();
      startSession();
  }

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
                     <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span>{t.agent.launcher_cta}</span>
            </button>
          </div>
        </div>
      )}

      {/* VOICE INTERFACE MODAL */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl z-50 overflow-hidden border border-gray-100 flex flex-col h-[500px] animate-fade-in-up font-sans">
          
          {/* Header */}
          <div className="bg-white p-4 flex items-center justify-between absolute top-0 left-0 right-0 z-10">
            <div className="flex items-center">
              <div className="relative mr-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold">
                  A
                </div>
              </div>
              <div>
                <h3 className="text-gray-900 font-bold text-sm">Alex (Voice)</h3>
              </div>
            </div>
            <button 
              onClick={toggleOpen}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Visualizer / Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-emerald-50/50 to-white relative">
            
            {error ? (
                <div className="px-8 text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h4 className="text-gray-900 font-semibold mb-2">Connection Failed</h4>
                    <p className="text-sm text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={retryConnection}
                        className="bg-gray-900 text-white px-6 py-2 rounded-full text-sm hover:bg-black transition-colors"
                    >
                        Retry
                    </button>
                </div>
            ) : (
                <>
                    {/* Status Text */}
                    <div className="absolute top-20 text-center w-full px-4">
                        <p className="text-emerald-800 font-medium text-sm tracking-wide uppercase opacity-80">
                            {status === 'connecting' && 'Connecting...'}
                            {status === 'listening' && (isMuted ? 'Microphone Muted' : 'Listening...')}
                            {status === 'speaking' && 'Alex Speaking...'}
                            {status === 'disconnected' && 'Offline'}
                        </p>
                    </div>

                    {/* The Orb */}
                    <div className="relative flex items-center justify-center">
                        {/* Outer Glow Rings */}
                        <div 
                            className="absolute rounded-full bg-emerald-400 opacity-20 transition-all duration-150 ease-out"
                            style={{ 
                                width: `${100 + volume * 150}px`, 
                                height: `${100 + volume * 150}px` 
                            }}
                        ></div>
                        <div 
                            className="absolute rounded-full bg-emerald-500 opacity-30 transition-all duration-200 ease-out"
                            style={{ 
                                width: `${80 + volume * 100}px`, 
                                height: `${80 + volume * 100}px` 
                            }}
                        ></div>

                        {/* Core Orb */}
                        <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg flex items-center justify-center z-10 transition-transform duration-300 ${status === 'speaking' ? 'scale-110' : 'scale-100'}`}>
                            {status === 'connecting' ? (
                                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : isMuted ? (
                                <svg className="w-8 h-8 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                                </svg>
                            ) : (
                                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            )}
                        </div>
                    </div>
                </>
            )}
          </div>

          {/* Controls Footer */}
          <div className="p-6 bg-white flex justify-center items-center gap-4">
              {status === 'disconnected' && !error ? (
                  <button 
                    onClick={startSession}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-emerald-700 transition-all transform hover:scale-105 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Start Conversation
                  </button>
              ) : error ? (
                   <button 
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-800 font-medium text-sm"
                  >
                    Close
                  </button>
              ) : (
                  <>
                    <button 
                        onClick={toggleMute}
                        disabled={status === 'connecting'}
                        className={`p-3 rounded-full transition-colors border ${isMuted ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                        title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
                    >
                         {isMuted ? (
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                             </svg>
                         ) : (
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                             </svg>
                         )}
                    </button>

                    <button 
                        onClick={disconnect}
                        className="bg-red-50 text-red-600 border border-red-100 px-6 py-3 rounded-full font-semibold hover:bg-red-100 transition-colors flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        End Call
                    </button>
                  </>
              )}
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiAgent;