import { useState, useEffect } from 'react';
import { Pill, Plus, Clock } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
}

export default function Medications() {
  const [meds, setMeds] = useState<Medication[]>([]);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetchMeds = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/medications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMeds(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchMeds();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/medications', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, dosage, frequency })
      });
      const data = await res.json();
      
      if (data.success) {
        setName(''); setDosage(''); setFrequency('');
        fetchMeds();
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
        <div className="bg-teal-100 dark:bg-teal-900/30 p-3 rounded-xl border border-teal-200 dark:border-teal-800">
          <Pill className="h-8 w-8 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Medications</h1>
          <p className="text-slate-500">Track your prescriptions and daily supplements.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-1 h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" /> Add New
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Medication Name</label>
              <input 
                type="text" required placeholder="e.g. Vitamin D3"
                className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={name} onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Dosage</label>
              <input 
                type="text" required placeholder="e.g. 2000 IU"
                className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={dosage} onChange={(e) => setDosage(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Frequency</label>
              <input 
                type="text" required placeholder="e.g. Once daily with food"
                className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={frequency} onChange={(e) => setFrequency(e.target.value)}
              />
            </div>
            <button 
              type="submit" disabled={isLoading}
              className="w-full h-11 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 disabled:opacity-70 transition-colors"
            >
              {isLoading ? 'Saving...' : 'Add Medication'}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-2">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-teal-500" /> Current Regimen
          </h2>
          
          {isFetching ? (
            <div className="text-center py-12 text-slate-500">Loading medications...</div>
          ) : meds.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center text-slate-500">
              <Pill className="h-12 w-12 text-slate-300 mb-3" />
              <p>No active medications.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {meds.map((med) => (
                <div key={med.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 text-teal-500">
                      <Pill className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{med.name}</h3>
                      <p className="text-sm font-medium text-slate-500">{med.dosage}</p>
                    </div>
                  </div>
                  <div className="bg-teal-100 dark:bg-teal-900/30 px-3 py-1.5 rounded-lg text-sm font-medium text-teal-700 dark:text-teal-400 text-center">
                    {med.frequency}
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
