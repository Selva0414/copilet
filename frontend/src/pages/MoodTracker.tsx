import { useState, useEffect } from 'react';
import { Smile, Plus, MessageSquareHeart } from 'lucide-react';

interface MoodRecord {
  id: string;
  mood: string;
  notes: string | null;
  date: string;
}

export default function MoodTracker() {
  const [records, setRecords] = useState<MoodRecord[]>([]);
  const [mood, setMood] = useState('happy');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/mood', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setRecords(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/mood', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ mood, notes })
      });
      const data = await res.json();
      
      if (data.success) {
        setNotes('');
        setMood('happy');
        fetchRecords();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getMoodEmoji = (val: string) => {
    switch (val) {
      case 'fantastic': return '🤩';
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'sad': return '😔';
      case 'stressed': return '😫';
      default: return '🙂';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-xl">
          <Smile className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Mood Tracking</h1>
          <p className="text-slate-500">Log your emotional wellbeing over time.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-1 h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" /> How are you?
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Mood</label>
              <select 
                className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                value={mood} onChange={(e) => setMood(e.target.value)}
              >
                <option value="fantastic" className="dark:bg-slate-800 text-base">🤩 Fantastic</option>
                <option value="happy" className="dark:bg-slate-800 text-base">😊 Happy</option>
                <option value="neutral" className="dark:bg-slate-800 text-base">😐 Neutral</option>
                <option value="sad" className="dark:bg-slate-800 text-base">😔 Sad</option>
                <option value="stressed" className="dark:bg-slate-800 text-base">😫 Stressed</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Journal (optional)</label>
              <textarea 
                rows={4} placeholder="Why do you feel this way?"
                className="w-full px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={notes} onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <button 
              type="submit" disabled={isLoading}
              className="w-full h-11 bg-primary text-white font-medium rounded-md hover:bg-primary/90 disabled:opacity-70 transition-colors"
            >
              {isLoading ? 'Saving...' : 'Log Mood'}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-2">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageSquareHeart className="h-5 w-5 text-yellow-500" /> Recent History
          </h2>
          
          {isFetching ? (
            <div className="text-center py-12 text-slate-500">Loading records...</div>
          ) : records.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No mood records yet.
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((rec) => (
                <div key={rec.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">{getMoodEmoji(rec.mood)}</div>
                    <div>
                      <h3 className="font-bold capitalize">{rec.mood}</h3>
                      <p className="text-xs text-slate-500">
                        {new Date(rec.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  {rec.notes && (
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                      "{rec.notes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
