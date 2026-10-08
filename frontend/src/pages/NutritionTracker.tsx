import { useState, useEffect } from 'react';
import { Apple, Plus, Utensils } from 'lucide-react';

interface NutritionRecord {
  id: string;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  date: string;
}

export default function NutritionTracker() {
  const [records, setRecords] = useState<NutritionRecord[]>([]);
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://copilet-3.onrender.com/api/nutrition', {
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
      const res = await fetch('https://copilet-3.onrender.com/api/nutrition', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ calories, protein, carbs, fat })
      });
      const data = await res.json();
      
      if (data.success) {
        setCalories(''); setProtein(''); setCarbs(''); setFat('');
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
        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
          <Apple className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Nutrition Tracking</h1>
          <p className="text-slate-500">Monitor your daily macros and calories.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-1 h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" /> Log Macros
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Total Calories (kcal)</label>
              <input 
                type="number" required
                className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={calories} onChange={(e) => setCalories(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-medium text-slate-500">Protein (g)</label>
                <input 
                  type="number"
                  className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  value={protein} onChange={(e) => setProtein(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Carbs (g)</label>
                <input 
                  type="number"
                  className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  value={carbs} onChange={(e) => setCarbs(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500">Fat (g)</label>
                <input 
                  type="number"
                  className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  value={fat} onChange={(e) => setFat(e.target.value)}
                />
              </div>
            </div>
            <button 
              type="submit" disabled={isLoading}
              className="w-full h-11 bg-primary text-white font-medium rounded-md hover:bg-primary/90 disabled:opacity-70 transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save Nutrition'}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-2">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Utensils className="h-5 w-5 text-green-500" /> Recent History
          </h2>
          
          {isFetching ? (
            <div className="text-center py-12 text-slate-500">Loading records...</div>
          ) : records.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No nutrition records yet.
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((rec) => (
                <div key={rec.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400 font-bold text-center w-16">
                      {rec.calories || 0}<br/><span className="text-[10px] font-normal uppercase">kcal</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {rec.protein || 0}g P • {rec.carbs || 0}g C • {rec.fat || 0}g F
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(rec.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
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
