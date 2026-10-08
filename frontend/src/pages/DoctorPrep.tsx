import { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, FileText } from 'lucide-react';

interface Appointment {
  id: string;
  doctorName: string;
  type: string;
  date: string;
  notes: string | null;
}

export default function DoctorPrep() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorName, setDoctorName] = useState('');
  const [type, setType] = useState('checkup');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/appointments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ doctorName, type, date, notes })
      });
      const data = await res.json();
      
      if (data.success) {
        setDoctorName(''); setDate(''); setNotes('');
        fetchAppointments();
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
        <div className="bg-sky-100 dark:bg-sky-900/30 p-3 rounded-xl border border-sky-200 dark:border-sky-800">
          <Calendar className="h-8 w-8 text-sky-600 dark:text-sky-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Doctor Preparation</h1>
          <p className="text-slate-500">Plan and prepare notes for your upcoming appointments.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-1 h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" /> Schedule
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Doctor / Clinic Name</label>
              <input 
                type="text" required placeholder="Dr. Smith"
                className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={doctorName} onChange={(e) => setDoctorName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Visit Type</label>
              <select 
                className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={type} onChange={(e) => setType(e.target.value)}
              >
                <option value="checkup" className="dark:bg-slate-800">Routine Checkup</option>
                <option value="followup" className="dark:bg-slate-800">Follow-up</option>
                <option value="specialist" className="dark:bg-slate-800">Specialist</option>
                <option value="urgent" className="dark:bg-slate-800">Urgent Care</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Date & Time</label>
              <input 
                type="datetime-local" required
                className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={date} onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Questions / Notes</label>
              <textarea 
                rows={3} placeholder="What do you want to ask?"
                className="w-full px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={notes} onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <button 
              type="submit" disabled={isLoading}
              className="w-full h-11 bg-primary text-white font-medium rounded-md hover:bg-primary/90 disabled:opacity-70 transition-colors"
            >
              {isLoading ? 'Saving...' : 'Add Appointment'}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-sky-500" /> Upcoming
            </h2>
          </div>
          
          {isFetching ? (
            <div className="text-center py-12 text-slate-500">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center text-slate-500">
              <Calendar className="h-12 w-12 text-slate-300 mb-3" />
              <p>No upcoming appointments.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {appointments.map((apt) => (
                <div key={apt.id} className="flex flex-col sm:flex-row p-5 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:shadow-md transition-shadow gap-4 group">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex flex-col items-center justify-center min-w-[80px] text-center shadow-sm">
                    <span className="text-xs font-bold text-red-500 uppercase">{new Date(apt.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                    <span className="text-2xl font-black text-slate-800 dark:text-white leading-none my-1">{new Date(apt.date).getDate()}</span>
                    <span className="text-xs font-medium text-slate-500">{new Date(apt.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{apt.doctorName}</h3>
                      <span className="text-xs font-medium uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/30 px-2 py-1 rounded-md">
                        {apt.type}
                      </span>
                    </div>
                    {apt.notes ? (
                      <div className="mt-3 text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700 flex items-start gap-2">
                        <FileText className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                        <p className="italic">"{apt.notes}"</p>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-slate-400 italic">No notes added.</p>
                    )}
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
