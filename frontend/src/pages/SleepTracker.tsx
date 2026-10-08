import { useState, useEffect } from 'react';
import { Moon, Plus, Activity } from 'lucide-react';

interface SleepRecord {
  id: string;
  duration: number;
  quality: string;
  date: string;
}

export default function SleepTracker() {
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [duration, setDuration] = useState('8');
  const [quality, setQuality] = useState('good');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://copilet-3.onrender.com/api/sleep', {
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
      const res = await fetch('https://copilet-3.onrender.com/api/sleep', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ duration, quality })
      });
      const data = await res.json();
      
      if (data.success) {
        // Refresh records
        fetchRecords();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-xl">
          <Moon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Sleep Tracking</h1>
          <p className="text-slate-500">Monitor your rest and recovery over time.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Log Sleep Form */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-1">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" /> Log Sleep
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Duration (hours)</label>
              <input 
                type="number" step="0.5" required
                className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={duration} onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Sleep Quality</label>
              <select 
                className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={quality} onChange={(e) => setQuality(e.target.value)}
              >
                <option value="excellent" className="dark:bg-slate-800">Excellent</option>
                <option value="good" className="dark:bg-slate-800">Good</option>
                <option value="fair" className="dark:bg-slate-800">Fair</option>
                <option value="poor" className="dark:bg-slate-800">Poor</option>
              </select>
            </div>
            <button 
              type="submit" disabled={isLoading}
              className="w-full h-11 bg-primary text-white font-medium rounded-md hover:bg-primary/90 disabled:opacity-70 transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save Record'}
            </button>
          </form>
        </div>

        {/* Sleep History */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-2">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-500" /> Recent History
          </h2>
          
          {isFetching ? (
            <div className="text-center py-12 text-slate-500">Loading records...</div>
          ) : records.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No sleep records yet. Start logging your sleep!
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400 font-bold">
                      {record.duration}h
                    </div>
                    <div>
                      <p className="font-medium capitalize">{record.quality} Quality</p>
                      <p className="text-xs text-slate-500">
                        {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
