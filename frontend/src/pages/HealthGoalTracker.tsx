import { useState, useEffect } from 'react';
import { Target, Plus, CheckCircle2, TrendingUp } from 'lucide-react';

interface HealthGoal {
  id: string;
  title: string;
  target: string;
  current: string | null;
  type: string;
  startDate: string;
  endDate: string | null;
  status: string;
}

export default function HealthGoalTracker() {
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [type, setType] = useState('fitness');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://copilet-3.onrender.com/api/goals', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setGoals(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://copilet-3.onrender.com/api/goals', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, target, current, type })
      });
      const data = await res.json();
      
      if (data.success) {
        setTitle(''); setTarget(''); setCurrent('');
        fetchGoals();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressPercentage = (currentVal: string | null, targetVal: string) => {
    if (!currentVal) return 0;
    const c = parseFloat(currentVal);
    const t = parseFloat(targetVal);
    if (isNaN(c) || isNaN(t) || t === 0) return 0;
    return Math.min(Math.round((c / t) * 100), 100);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <Target className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Health Goals</h1>
          <p className="text-slate-500">Set, track, and crush your wellness milestones.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-1 h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" /> New Goal
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Goal Title</label>
              <input 
                type="text" required placeholder="e.g. Lose 10 lbs"
                className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={title} onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Goal Type</label>
              <select 
                className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={type} onChange={(e) => setType(e.target.value)}
              >
                <option value="fitness" className="dark:bg-slate-800">Fitness</option>
                <option value="nutrition" className="dark:bg-slate-800">Nutrition</option>
                <option value="mental" className="dark:bg-slate-800">Mental Health</option>
                <option value="habit" className="dark:bg-slate-800">Daily Habit</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-500">Current</label>
                <input 
                  type="text" placeholder="e.g. 0"
                  className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  value={current} onChange={(e) => setCurrent(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">Target</label>
                <input 
                  type="text" required placeholder="e.g. 10"
                  className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  value={target} onChange={(e) => setTarget(e.target.value)}
                />
              </div>
            </div>
            <button 
              type="submit" disabled={isLoading}
              className="w-full h-11 bg-primary text-white font-medium rounded-md hover:bg-primary/90 disabled:opacity-70 transition-colors"
            >
              {isLoading ? 'Saving...' : 'Set Goal'}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" /> Active Goals
            </h2>
          </div>
          
          {isFetching ? (
            <div className="text-center py-12 text-slate-500">Loading goals...</div>
          ) : goals.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center text-slate-500">
              <Target className="h-12 w-12 text-slate-300 mb-3" />
              <p>No goals set. Aim for something great today!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {goals.map((goal) => {
                const percent = getProgressPercentage(goal.current, goal.target);
                return (
                  <div key={goal.id} className="p-5 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-emerald-200 transition-colors group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{goal.title}</h3>
                        <span className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-md mt-1 inline-block">
                          {goal.type}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          {goal.current || 0} / {goal.target}
                        </span>
                        <div className="text-xs text-slate-400 mt-1">Target</div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-4 overflow-hidden">
                      <div className="bg-emerald-500 h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${percent}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                      <span>{percent}% Complete</span>
                      {percent >= 100 && <span className="text-emerald-500 flex items-center font-bold"><CheckCircle2 className="w-3 h-3 mr-1" /> Goal Reached!</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
