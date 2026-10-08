import { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Phone, Users } from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://copilet-3.onrender.com/api/emergency', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setContacts(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://copilet-3.onrender.com/api/emergency', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, relationship, phone })
      });
      const data = await res.json();
      
      if (data.success) {
        setName(''); setRelationship(''); setPhone('');
        fetchContacts();
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
        <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl border border-red-200 dark:border-red-800">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">Emergency Contacts</h1>
          <p className="text-slate-500">Keep critical medical contacts safely stored.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/50 md:col-span-1 h-fit relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-red-500" /> Add Contact
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input 
                type="text" required placeholder="Jane Doe"
                className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500"
                value={name} onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Relationship</label>
              <input 
                type="text" required placeholder="Spouse, Primary Doctor..."
                className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500"
                value={relationship} onChange={(e) => setRelationship(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <input 
                type="tel" required placeholder="+1 (555) 000-0000"
                className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500"
                value={phone} onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <button 
              type="submit" disabled={isLoading}
              className="w-full h-11 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 disabled:opacity-70 transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save Contact'}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-slate-500" /> Saved Contacts
            </h2>
          </div>
          
          {isFetching ? (
            <div className="text-center py-12 text-slate-500">Loading contacts...</div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center text-slate-500">
              <Users className="h-12 w-12 text-slate-300 mb-3" />
              <p>No emergency contacts saved.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex flex-col sm:flex-row justify-between sm:items-center p-5 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{contact.name}</h3>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">{contact.relationship}</p>
                  </div>
                  <a href={`tel:${contact.phone}`} className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                    <Phone className="h-4 w-4" /> {contact.phone}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
