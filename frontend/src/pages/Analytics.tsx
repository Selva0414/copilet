import { useState, useEffect } from 'react';
import { BarChart as BarChartIcon, TrendingUp, Moon } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

interface SleepData {
  id: string;
  duration: number;
  date: string;
}

interface ActivityData {
  id: string;
  steps: number;
  date: string;
}

export default function Analytics() {
  const [sleepData, setSleepData] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const [sleepRes, activityRes] = await Promise.all([
          fetch('https://copilet-3.onrender.com/api/sleep', { headers }),
          fetch('https://copilet-3.onrender.com/api/activity', { headers })
        ]);
        
        const sleepJson = await sleepRes.json();
        const activityJson = await activityRes.json();
        
        if (sleepJson.success) {
          // Format for chart (reverse to show chronological left-to-right)
          const formatted = sleepJson.data.reverse().map((d: SleepData) => ({
            name: new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' }),
            Hours: d.duration
          }));
          setSleepData(formatted);
        }
        
        if (activityJson.success) {
          const formatted = activityJson.data.reverse().map((d: ActivityData) => ({
            name: new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' }),
            Steps: d.steps
          }));
          setActivityData(formatted);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
          <BarChartIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Health Analytics</h1>
          <p className="text-slate-500">Visualize your wellness trends over time.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-slate-500">
          Loading your analytics...
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Sleep Chart */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Moon className="h-5 w-5 text-indigo-500" /> Sleep Trends (Last 7 Days)
            </h2>
            {sleepData.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sleepData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Line type="monotone" dataKey="Hours" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                Not enough sleep data to generate chart.
              </div>
            )}
          </div>

          {/* Activity Chart */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" /> Daily Steps
            </h2>
            {activityData.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: '#f1f5f9', opacity: 0.5 }}
                    />
                    <Bar dataKey="Steps" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                Not enough activity data to generate chart.
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
}
