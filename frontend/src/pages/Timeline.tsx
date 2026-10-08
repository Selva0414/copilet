import { useState, useEffect } from 'react';
import { Clock, Activity, Moon, Smile, Heart } from 'lucide-react';

interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
}

export default function Timeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Simulating fetching a unified timeline
    const generateMockTimeline = () => {
      setTimeout(() => {
        setEvents([
          {
            id: '1', type: 'sleep', title: 'Sleep Logged', description: '7.5 hours • Good quality', date: new Date().toISOString()
          },
          {
            id: '2', type: 'activity', title: 'Activity Logged', description: '12,400 steps • 450 kcal', date: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: '3', type: 'mood', title: 'Mood Logged', description: 'Happy 😊 • "Great workout today!"', date: new Date(Date.now() - 7200000).toISOString()
          },
          {
            id: '4', type: 'symptom', title: 'Symptom Logged', description: 'Headache • Mild', date: new Date(Date.now() - 86400000).toISOString()
          }
        ]);
        setIsLoading(false);
      }, 800);
    };

    generateMockTimeline();
  }, []);

  const generateAITimeline = async () => {
    setIsGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      // Get goals first
      const goalsRes = await fetch('https://copilet-3.onrender.com/api/goals', { headers });
      const goalsData = await goalsRes.json();
      let goalsText = "be healthier";
      if (goalsData.success && goalsData.data.length > 0) {
        goalsText = goalsData.data.map((g: any) => g.title).join(', ');
      }

      // Ask AI for a timeline
      const prompt = `Create a 3-step daily timeline to help me achieve my goals: ${goalsText}. Format exactly as 'TIME - TITLE: DESCRIPTION'. Keep it short.`;
      
      const chatRes = await fetch('https://copilet-3.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: prompt })
      });
      
      const chatData = await chatRes.json();
      const aiResponse = chatData.reply || "";
      
      // Parse AI response into timeline events
      const lines = aiResponse.split('\n').filter((l: string) => l.includes('-'));
      const newEvents = lines.map((line: string, i: number) => {
        const [, rest] = line.split('-');
        const [title, desc] = (rest || '').split(':');
        
        let d = new Date();
        d.setMinutes(d.getMinutes() + (i * 60)); // stagger times

        return {
          id: `ai-${i}`,
          type: 'activity',
          title: title ? title.trim() : 'AI Recommendation',
          description: desc ? desc.trim() : (rest ? rest.trim() : line),
          date: d.toISOString()
        };
      });

      if (newEvents.length > 0) {
        setEvents(prev => [...newEvents, ...prev]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'sleep': return <Moon className="h-5 w-5 text-indigo-500" />;
      case 'activity': return <Activity className="h-5 w-5 text-orange-500" />;
      case 'mood': return <Smile className="h-5 w-5 text-yellow-500" />;
      case 'symptom': return <Heart className="h-5 w-5 text-rose-500" />;
      default: return <Clock className="h-5 w-5 text-slate-500" />;
    }
  };

  const getEventBg = (type: string) => {
    switch (type) {
      case 'sleep': return 'bg-indigo-50 border-indigo-200';
      case 'activity': return 'bg-orange-50 border-orange-200';
      case 'mood': return 'bg-yellow-50 border-yellow-200';
      case 'symptom': return 'bg-rose-50 border-rose-200';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-3 rounded-xl border border-purple-200">
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Your Timeline</h1>
            <p className="text-slate-500">A chronological history of all your health activities.</p>
          </div>
        </div>
        <button 
          onClick={generateAITimeline} 
          disabled={isGenerating}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 flex items-center transition-colors disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : '✨ AI Goal Planner'}
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Loading timeline...</div>
      ) : (
        <div className="relative border-l-2 border-slate-200 ml-4 pl-8 space-y-8 pb-10">
          {events.map((event) => (
            <div key={event.id} className="relative animate-fade-in">
              {/* Timeline dot */}
              <div className={`absolute -left-[41px] top-1 h-10 w-10 rounded-full border-2 flex items-center justify-center bg-white ${getEventBg(event.type)}`}>
                {getEventIcon(event.type)}
              </div>
              
              <div className="glass-panel p-5 rounded-2xl">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg">{event.title}</h3>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md font-medium">
                    {new Date(event.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-600 font-medium">{event.description}</p>
                <div className="text-xs text-slate-400 mt-3">
                  {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>
          ))}
          
          <div className="relative">
             <div className="absolute -left-[35px] top-1 h-7 w-7 rounded-full border-2 border-slate-200 bg-slate-50 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-slate-300"></div>
             </div>
             <p className="text-sm text-slate-400 font-medium pt-2">End of recent history</p>
          </div>
        </div>
      )}
    </div>
  );
}
