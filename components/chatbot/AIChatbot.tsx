import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useLanguage } from '../../AppContext';

const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" /></svg>;
const PaperclipIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a3 3 0 10-6 0v4a1 1 0 102 0V7a1 1 0 112 0v4a3 3 0 11-6 0V7a5 5 0 0110 0v4a5 5 0 01-10 0V7a3 3 0 00-3-3z" clipRule="evenodd" /></svg>;
const VoiceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

interface Message {
  sender: 'user' | 'ai';
  text: string;
  image?: string;
  audioUrl?: string;
}

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: t('chatbotGreeting') }
  ]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length === 1 && messages[0].text !== t('chatbotGreeting')) {
        setMessages([{ sender: 'ai', text: t('chatbotGreeting') }]);
    }
  }, [t, messages]);

  useEffect(scrollToBottom, [messages]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioUrl(null);
      const base64 = await blobToBase64(file);
      setImage(base64);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setImage(null);
      setAudioUrl(null);
      audioChunksRef.current = [];
      
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
          if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
          stream.getTracks().forEach(track => track.stop());
      };
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access was denied. Please allow microphone access in your browser settings.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() && !image && !audioUrl) return;

    const audioBlob = audioChunksRef.current.length > 0 ? new Blob(audioChunksRef.current, { type: 'audio/webm' }) : null;

    const userMessage: Message = { sender: 'user', text: input, image: image || undefined, audioUrl: audioUrl || undefined };
    setMessages(prev => [...prev, userMessage]);
    
    setInput('');
    setImage(null);
    setAudioUrl(null);
    audioChunksRef.current = [];
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const parts: any[] = [];
      if (image) {
        const mimeType = image.match(/data:(.*);base64,/)?.[1] || 'image/jpeg';
        const base64Data = image.split(',')[1];
        parts.push({
          inlineData: { mimeType, data: base64Data },
        });
      }

      if (audioBlob) {
        const audioBase64 = await blobToBase64(audioBlob);
        const mimeType = audioBase64.match(/data:(.*);base64,/)?.[1] || 'audio/webm';
        const base64Data = audioBase64.split(',')[1];
        parts.push({
          inlineData: { mimeType, data: base64Data },
        });
      }

      let promptText = input;
      if ((image || audioBlob) && !promptText) {
          promptText = "Analyze the provided media (image and/or audio) and provide guidance.";
      }
      parts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts }],
        config: {
            systemInstruction: "You are an AI veterinary assistant for pig and poultry farmers. Analyze symptoms and information from text, images, or audio to suggest potential issues and advise when to see a vet. If audio is provided, transcribe it first as part of your analysis. Do not give a final diagnosis. Be helpful, clear, and use formatting like lists or bold text to improve readability. Always end with a disclaimer that you are not a substitute for a professional veterinarian.",
        }
      });

      const aiMessage: Message = { sender: 'ai', text: response.text };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("AI chat error:", error);
      const errorMessage: Message = { sender: 'ai', text: t('chatbotError') };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 z-50 transition-transform transform hover:scale-110"
        aria-label="Open AI Chatbot"
      >
        <ChatIcon />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-8 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col z-50 border dark:border-gray-700">
          <header className="bg-green-600 text-white p-4 flex justify-between items-center rounded-t-2xl">
            <h3 className="font-bold">{t('symptomChecker')}</h3>
            <button onClick={() => setIsOpen(false)} aria-label="Close Chatbot"><CloseIcon /></button>
          </header>
          
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-xl max-w-xs ${msg.sender === 'user' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                    {msg.image && <img src={msg.image} alt="User upload" className="rounded-lg mb-2" />}
                    {msg.audioUrl && <audio controls src={msg.audioUrl} className="w-full mb-2" />}
                    {msg.text && <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />}
                  </div>
                </div>
              ))}
              {isLoading && (
                  <div className="flex justify-start">
                      <div className="p-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800">
                          <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse"></div>
                              <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                              <div className="w-2 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                          </div>
                      </div>
                  </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <footer className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-2xl">
            {image && (
              <div className="relative mb-2 w-20">
                <img src={image} alt="Preview" className="w-full rounded-lg" />
                <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center">&times;</button>
              </div>
            )}
            {audioUrl && (
                <div className="relative mb-2">
                    <audio src={audioUrl} controls className="w-full" />
                    <button onClick={() => setAudioUrl(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center">&times;</button>
                </div>
            )}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
                placeholder={isRecording ? t('recording') : t('typeMessage')}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                disabled={isLoading || isRecording}
              />
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400" aria-label="Attach Image" disabled={isLoading || isRecording}><PaperclipIcon /></button>
              <button onClick={isRecording ? stopRecording : startRecording} className={`p-2 transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-green-600 dark:hover:text-green-400'}`} aria-label={isRecording ? t('stopRecording') : t('recordAudio')} disabled={isLoading}><VoiceIcon /></button>
              <button onClick={sendMessage} className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 disabled:opacity-50" aria-label="Send Message" disabled={isLoading || isRecording}><SendIcon /></button>
            </div>
          </footer>
        </div>
      )}
    </>
  );
};

export default AIChatbot;