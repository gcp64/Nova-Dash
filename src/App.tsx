import { useState, useEffect, useRef } from 'react';
import { Terminal, Code2, Zap, Box, Send, Command, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

const Dashboard = () => {
  const [logs, setLogs] = useState<{ time: string, text: string, type: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLogs([
      { time: new Date().toLocaleTimeString('ar-IQ', { hour12: false }), text: 'نظام Nova-Dash جاهز للعمل. الإصدار 1.0.0', type: 'system' },
      { time: new Date().toLocaleTimeString('ar-IQ', { hour12: false }), text: 'تمت تهيئة الاتصال بـ DeepSeek بنجاح.', type: 'system' }
    ]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (text: string, type: 'system' | 'agent' | 'user' | 'error') => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString('ar-IQ', { hour12: false }), text, type }]);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userPrompt = input;
    setInput('');
    addLog(userPrompt, 'user');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt })
      });

      if (!response.ok) {
        let errorMsg = 'فشل الاتصال بالخادم.';
        try {
           const errData = await response.json();
           if (errData.error?.includes('Insufficient Balance')) {
             errorMsg = 'الرصيد غير كافٍ في مفتاح DeepSeek API الخاص بك. يرجى شحن الحساب.';
           } else {
             errorMsg = errData.error || errorMsg;
           }
        } catch(e) {}
        throw new Error(errorMsg);
      }
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      let aiResponse = '';
      let isFirstChunk = true;

      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        aiResponse += chunk;
        
        setLogs(prev => {
          const newLogs = [...prev];
          if (isFirstChunk) {
             newLogs.push({ time: new Date().toLocaleTimeString('ar-IQ', { hour12: false }), text: chunk, type: 'agent' });
             isFirstChunk = false;
          } else {
             newLogs[newLogs.length - 1] = { ...newLogs[newLogs.length - 1], text: aiResponse };
          }
          return newLogs;
        });
      }
      
      addLog('تمت المعالجة.', 'system');
    } catch (error: any) {
      addLog(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen p-4 md:p-8 flex flex-col gap-6 text-right font-sans bg-[#050505]">
      {/* Minimal Header */}
      <header className="flex justify-between items-center mb-4 border-b border-dev-700/50 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-dev-100 rounded flex items-center justify-center shadow-sm">
            <Command className="text-dev-900 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-dev-100 tracking-tight">
              نوفا داش
            </h1>
            <p className="text-xs text-dev-500 font-mono mt-1 uppercase tracking-widest">بيئة المطور</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-dev-700/30 bg-dev-800/50">
            <div className="w-2 h-2 rounded-full bg-dev-100 animate-pulse"></div>
            <span className="text-xs font-mono text-dev-300">متصل (Connected)</span>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Right Column - Stats & Input */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Minimal Stats */}
          <div className="panel p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-dev-300 uppercase tracking-widest">مؤشرات الأداء</h2>
              <Activity className="text-dev-500 w-4 h-4" />
            </div>
            
            <div className="grid grid-cols-2 gap-px bg-dev-700/50 rounded-lg overflow-hidden border border-dev-700/50">
              <div className="bg-dev-900 p-5">
                <div className="text-dev-500 text-xs mb-2 flex items-center gap-2">
                  <Code2 className="w-3.5 h-3.5" />
                  أسطر الكود
                </div>
                <div className="text-2xl font-mono text-dev-100">14,204</div>
              </div>
              
              <div className="bg-dev-900 p-5">
                <div className="text-dev-500 text-xs mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  المهام
                </div>
                <div className="text-2xl font-mono text-dev-100">89</div>
              </div>

              <div className="bg-dev-900 p-5 col-span-2">
                <div className="text-dev-500 text-xs mb-2 flex items-center gap-2">
                  <Box className="w-3.5 h-3.5" />
                  استهلاك الذاكرة
                </div>
                <div className="text-2xl font-mono text-dev-100">142 <span className="text-sm text-dev-500">MB</span></div>
              </div>
            </div>
          </div>

          {/* Input Panel */}
          <div className="panel p-6 flex-1 flex flex-col">
            <h2 className="text-sm font-medium text-dev-300 uppercase tracking-widest mb-4">موجه الأوامر (Prompt)</h2>
            <div className="flex-1 flex flex-col gap-4">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="اكتب مهمتك البرمجية هنا..."
                className="flex-1 w-full bg-dev-800/30 border border-dev-700/50 rounded-lg p-4 text-dev-100 focus:outline-none focus:border-dev-500 transition-colors resize-none placeholder-dev-600 text-sm leading-relaxed"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-full py-3 px-4 bg-dev-100 text-dev-900 rounded-lg font-medium hover:bg-dev-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {isLoading ? 'جاري المعالجة...' : 'تنفيذ المهمة'}
                {!isLoading && <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
        </div>

        {/* Left Column - Terminal */}
        <div className="lg:col-span-8 panel flex flex-col relative overflow-hidden bg-[#0A0A0A]">
          
          <div className="px-5 py-3 border-b border-dev-700/50 flex items-center justify-between bg-dev-900">
            <div className="flex items-center gap-2">
              <Terminal className="text-dev-500 w-4 h-4" />
              <h2 className="font-mono text-xs tracking-widest text-dev-400 uppercase">Output Terminal</h2>
            </div>
          </div>
          
          <div className="flex-1 relative overflow-hidden">
            <div 
              ref={scrollRef}
              className="absolute inset-0 p-6 overflow-y-auto terminal-scrollbar font-mono text-[13px] leading-loose whitespace-pre-wrap text-left"
              dir="ltr"
            >
              {logs.map((log, index) => {
                let textClass = "text-dev-300";
                let prefix = "";
                
                if (log.type === 'system') {
                  textClass = "text-dev-500";
                  prefix = "sys  ❯ ";
                }
                else if (log.type === 'agent') {
                  textClass = "text-dev-100";
                  prefix = "ai   ❯ ";
                }
                else if (log.type === 'user') {
                  textClass = "text-dev-400";
                  prefix = "usr  ❯ ";
                }
                else if (log.type === 'error') {
                  textClass = "text-red-400";
                  prefix = "err  ❯ ";
                }
                
                return (
                  <div key={index} className={`mb-3 flex items-start opacity-0 animate-[fadeIn_0.2s_forwards]`}>
                    <span className="text-dev-600 mr-4 select-none shrink-0">
                      {log.time}
                    </span>
                    <div className="flex items-start">
                      <span className={`${log.type === 'error' ? 'text-red-500' : 'text-dev-600'} mr-2 shrink-0 select-none`}>{prefix}</span>
                      <span className={textClass}>{log.text}</span>
                    </div>
                  </div>
                );
              })}
              {isLoading && (
                <div className="mt-2 flex items-center text-dev-500">
                  <span className="text-dev-600 mr-4 select-none shrink-0">{new Date().toLocaleTimeString('ar-IQ', { hour12: false })}</span>
                  <span className="text-dev-600 mr-2 shrink-0 select-none">ai   ❯ </span>
                  <span className="animate-pulse">▮</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
