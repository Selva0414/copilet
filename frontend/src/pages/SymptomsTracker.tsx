import { useState, useEffect } from 'react';
import { Activity, Plus, Stethoscope } from 'lucide-react';

interface Symptom {
  id: string;
  name: string;
  severity: string;
  duration: string;
  notes: string | null;
  date: string;
}

export default function SymptomsTracker() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [name, setName] = useState('');
  const [severity, setSeverity] = useState('mild');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetchSymptoms = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/symptoms', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSymptoms(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/symptoms', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, severity, duration, notes })
      });
      const data = await res.json();
      
      if (data.success) {
        setName('');
        setDuration('');
        setNotes('');
        setSeverity('mild');
        fetchSymptoms();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'severe': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'moderate': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
      default: return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-rose-100 dark:bg-rose-900/30 p-3 rounded-xl">
          <Stethoscope className="h-8 w-8 text-rose-600 dark:text-rose-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Symptom Tracker</h1>
          <p className="text-slate-500">Log your symptoms to share with your doctor.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-1">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" /> New Entry
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Symptom Name</label>
              <input 
                type="text" required placeholder="e.g. Headache"
                className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={name} onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Severity</label>
              <select 
                className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={severity} onChange={(e) => setSeverity(e.target.value)}
              >
                <option value="mild" className="dark:bg-slate-800">Mild</option>
                <option value="moderate" className="dark:bg-slate-800">Moderate</option>
                <option value="severe" className="dark:bg-slate-800">Severe</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Duration</label>
              <input 
                type="text" required placeholder="e.g. 2 hours, since morning"
                className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={duration} onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Notes (optional)</label>
              <textarea 
                rows={3} placeholder="Triggers, relief factors..."
                className="w-full px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={notes} onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <button 
              type="submit" disabled={isLoading}
              className="w-full h-11 bg-primary text-white font-medium rounded-md hover:bg-primary/90 disabled:opacity-70 transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save Symptom'}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-2">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-rose-500" /> Logged Symptoms
          </h2>
          
          {isFetching ? (
            <div className="text-center py-12 text-slate-500">Loading symptoms...</div>
          ) : symptoms.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No symptoms logged yet. You're feeling great!
            </div>
          ) : (
            <div className="space-y-3">
              {symptoms.map((symptom) => (
                <div key={symptom.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{symptom.name}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${getSeverityColor(symptom.severity)}`}>
                      {symptom.severity}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    <span className="font-medium">Duration:</span> {symptom.duration}
                  </div>
                  {symptom.notes && (
                    <div className="text-sm text-slate-500 italic bg-white dark:bg-slate-900 p-2 rounded-md border border-slate-100 dark:border-slate-700">
                      "{symptom.notes}"
                    </div>
                  )}
                  <div className="text-xs text-slate-400 mt-3 text-right">
                    Logged on {new Date(symptom.date).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
