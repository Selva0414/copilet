import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AiCopilot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi there! I am SISU health AI. How can I help you analyze your health trends or answer questions today?' }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://copilet-3.onrender.com/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessages(prev => [...prev, data.data.aiMessage]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting to the server right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center gap-3 mb-6 shrink-0">
        <div className="bg-primary/10 p-3 rounded-xl border border-primary/20">
          <Bot className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">AI Copilot <Sparkles className="h-5 w-5 text-yellow-500" /></h1>
          <p className="text-slate-500">Your personal intelligent health assistant.</p>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden">
        
        {/* Chat window */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900/20">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' : 'bg-primary text-white'}`}>
                {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'}`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center shadow-sm bg-primary text-white">
                <Bot className="h-5 w-5" />
              </div>
              <div className="max-w-[80%] rounded-2xl p-4 shadow-sm bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-tl-none flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input 
              type="text" 
              placeholder="Ask about your health data..."
              className="flex-1 h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
              value={input} onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit" disabled={!input.trim() || isLoading}
              className="h-12 px-6 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              Send <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}
