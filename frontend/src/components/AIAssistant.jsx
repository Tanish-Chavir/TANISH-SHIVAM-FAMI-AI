import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Trash2, 
  Camera, 
  Bot, 
  User, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  X,
  History,
  Zap,
  Leaf
} from 'lucide-react';
import { useLanguage } from '../utils/LanguageContext';

const AIAssistant = () => {
  const { t, lang, currentLang } = useLanguage();
  const [messages, setMessages] = useState([
    { 
      type: 'ai', 
      content: t('ai_greeting'),
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [scanImage, setScanImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Update initial greeting when language changes if no other messages exist
  useEffect(() => {
    if (messages.length === 1 && messages[0].type === 'ai') {
      setMessages([{
        type: 'ai',
        content: t('ai_greeting'),
        time: messages[0].time
      }]);
    }
  }, [lang]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = { type: 'user', content: text, time: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          language: currentLang?.name || 'English',
          history: messages.slice(1).map(m => ({
            role: m.type === 'ai' ? 'model' : 'user',
            parts: [{ text: m.content }]
          }))
        })
      });

      const data = await response.json();
      if (data.text) {
        setMessages(prev => [...prev, { type: 'ai', content: data.text, time: new Date() }]);
      } else {
        throw new Error('No response');
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: "I'm having trouble connecting to my brain right now. Please make sure the backend is running and your API key is set.", 
        time: new Date() 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setScanImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const startScan = async () => {
    if (!scanImage) return;
    setIsScanning(true);
    setScanResult(null);
    
    try {
      const response = await fetch('/api/ai/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: scanImage, language: currentLang?.name || 'English' })
      });

      const data = await response.json();
      if (data.disease) {
        setScanResult(data);
      } else {
        throw new Error('Scan failed');
      }
    } catch (error) {
      console.error(error);
      alert("Failed to scan image. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-[80vh]">
        
        {/* Main Chat Area */}
        <div className="lg:col-span-8 flex flex-col bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] overflow-hidden backdrop-blur-2xl shadow-2xl">
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-800/50 bg-gradient-to-r from-emerald-500/10 to-transparent flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 ring-1 ring-emerald-500/50">
                  <Bot size={28} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#050505] rounded-full animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Agri-Intelligence</h2>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs text-emerald-400/80 font-medium">Powered by Gemini 1.5 Flash</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setMessages([messages[0]])}
              className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
              title={t('clear_chat')}
            >
              <Trash2 size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
            {messages.map((msg, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={i}
                className={`flex ${msg.type === 'ai' ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`flex gap-4 max-w-[85%] ${msg.type === 'ai' ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                    msg.type === 'ai' 
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' 
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {msg.type === 'ai' ? <Sparkles size={20} /> : <User size={20} />}
                  </div>
                  <div className={`group relative p-5 rounded-2xl ${
                    msg.type === 'ai' 
                    ? 'bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-tl-none' 
                    : 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/20 rounded-tr-none'
                  }`}>
                    <div className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                      {msg.content.split('**').map((part, index) => 
                        index % 2 === 1 ? <strong key={index} className="text-emerald-300">{part}</strong> : part
                      )}
                    </div>
                    <div className={`text-[10px] mt-3 font-bold uppercase tracking-wider opacity-40 ${msg.type === 'ai' ? 'text-slate-400' : 'text-emerald-100'}`}>
                      {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/30 flex gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-8 bg-slate-900/60 border-t border-slate-800/50">
            <div className="flex gap-3 mb-4 overflow-x-auto no-scrollbar">
              {['chip_soil', 'chip_pest', 'chip_rice', 'chip_fert'].map(key => (
                <button 
                  key={key}
                  onClick={() => handleSend(t(key))}
                  className="px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all whitespace-nowrap flex items-center gap-2 group"
                >
                  <Zap size={14} className="text-slate-600 group-hover:text-emerald-500 transition-colors" />
                  {t(key)}
                </button>
              ))}
            </div>
            <div className="relative group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('ask_placeholder')}
                className="w-full bg-slate-950/50 border border-slate-800 text-white pl-6 pr-16 py-5 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all text-base placeholder:text-slate-600"
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="absolute right-2.5 top-2.5 p-3.5 rounded-[1.1rem] bg-emerald-500 text-white hover:bg-emerald-400 disabled:opacity-30 disabled:hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
              >
                <Send size={22} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Scanner */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] p-8 backdrop-blur-2xl relative overflow-hidden flex-1 shadow-2xl">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-[80px] rounded-full"></div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 ring-1 ring-emerald-500/30">
                <Camera size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">{t('plant_scanner')}</h3>
                <p className="text-xs text-slate-500 font-medium">{t('instant_detection')}</p>
              </div>
            </div>

            {!scanImage ? (
              <div 
                onClick={() => fileInputRef.current.click()}
                className="aspect-square border-2 border-dashed border-slate-800 rounded-[2rem] flex flex-col items-center justify-center gap-5 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all cursor-pointer group"
              >
                <div className="w-20 h-20 rounded-3xl bg-slate-800/50 flex items-center justify-center text-slate-500 group-hover:text-emerald-400 group-hover:scale-110 transition-all ring-1 ring-slate-700/50">
                  <Camera size={40} />
                </div>
                <div className="text-center">
                  <div className="text-base font-bold text-slate-300">{t('snap_upload')}</div>
                  <div className="text-xs text-slate-500 mt-2">{t('leaf_crop_hint')}</div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-slate-700 shadow-2xl">
                  <img src={scanImage} className="w-full h-full object-cover" alt="To scan" />
                  <button 
                    onClick={() => {setScanImage(null); setScanResult(null);}}
                    className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/60 text-white hover:bg-red-500 transition-all backdrop-blur-md"
                  >
                    <X size={20} />
                  </button>
                  {isScanning && (
                    <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[4px] flex flex-col items-center justify-center">
                      <div className="w-full h-1.5 bg-emerald-500 absolute top-0 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_20px_rgba(16,185,129,1)]" />
                      <Loader2 className="animate-spin text-emerald-400 mb-4" size={48} />
                      <span className="text-xs font-black text-white uppercase tracking-[0.2em] drop-shadow-lg">{t('scanning')}</span>
                    </div>
                  )}
                </div>

                {!scanResult && !isScanning && (
                  <button 
                    onClick={startScan}
                    className="w-full py-5 rounded-2xl bg-emerald-500 text-white font-bold flex items-center justify-center gap-3 hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                  >
                    <Sparkles size={22} /> {t('run_diagnosis')}
                  </button>
                )}

                <AnimatePresence>
                  {scanResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 ring-1 ring-emerald-500/10">
                         <div className="flex justify-between items-center mb-2">
                           <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{t('diagnosis_result')}</span>
                           <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                             <span className="text-[10px] font-bold text-emerald-400">{scanResult.confidence} {t('confidence_match')}</span>
                           </div>
                         </div>
                         <div className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                           {scanResult.disease}
                           <Leaf size={20} className="text-emerald-500" />
                         </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                          {t('recommended_actions')}
                        </div>
                        <div className="space-y-3">
                          {scanResult.treatment.map((step, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 group hover:border-emerald-500/30 transition-all">
                              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ring-1 ring-emerald-500/20">
                                {i + 1}
                              </div>
                              <span className="text-[13px] text-slate-300 leading-relaxed font-medium">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-[2rem] p-6 flex gap-4 backdrop-blur-xl">
            <AlertCircle className="text-amber-500 shrink-0" size={24} />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider">{t('advisory_note')}</h4>
              <p className="text-[11px] text-amber-500/70 leading-relaxed font-medium">
                {t('advisory_text')}
              </p>
            </div>
          </div>
        </div>

      </div>
      
      {/* Dynamic Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-600/5 blur-[100px] rounded-full animate-pulse [animation-delay:2s]"></div>
      </div>
    </div>
  );
};

export default AIAssistant;
