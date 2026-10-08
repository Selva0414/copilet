import { useState, useEffect } from 'react';
import { Footprints, Plus, Activity as ActivityIcon } from 'lucide-react';

interface DailyActivity {
  id: string;
  steps: number;
  calories: number;
  date: string;
}

export default function ActivityTracker() {
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [steps, setSteps] = useState('10000');
  const [calories, setCalories] = useState('2000');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/activity', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setActivities(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/activity', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ steps, calories })
      });
      const data = await res.json();
      
      if (data.success) {
        fetchActivities();
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
        <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl">
          <Footprints className="h-8 w-8 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Activity Tracking</h1>
          <p className="text-slate-500">Log your daily steps and active calories.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-1 h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" /> Log Activity
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Steps</label>
              <input 
                type="number" required
                className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={steps} onChange={(e) => setSteps(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Active Calories Burned</label>
              <input 
                type="number" required
                className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={calories} onChange={(e) => setCalories(e.target.value)}
              />
            </div>
            <button 
              type="submit" disabled={isLoading}
              className="w-full h-11 bg-primary text-white font-medium rounded-md hover:bg-primary/90 disabled:opacity-70 transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save Activity'}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-2">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ActivityIcon className="h-5 w-5 text-orange-500" /> Recent History
          </h2>
          
          {isFetching ? (
            <div className="text-center py-12 text-slate-500">Loading records...</div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No activity records yet. Keep moving!
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((act) => (
                <div key={act.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-orange-600 dark:text-orange-400 font-bold">
                      {act.steps.toLocaleString()}
                    </div>
                    <div>
                      <p className="font-medium">{act.calories} Calories Burned</p>
                      <p className="text-xs text-slate-500">
                        {new Date(act.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
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
