import { useState, useEffect } from 'react';
import { FileText, Plus, Upload, Download, FileType2 } from 'lucide-react';

interface HealthRecord {
  id: string;
  title: string;
  type: string;
  fileUrl: string;
  date: string;
}

export default function HealthRecords() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('lab_result');
  const [fileUrl, setFileUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/records', {
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
      const res = await fetch('http://localhost:5000/api/records', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, type, fileUrl })
      });
      const data = await res.json();
      
      if (data.success) {
        setTitle('');
        setType('lab_result');
        setFileUrl('');
        fetchRecords();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRecordIcon = (recordType: string) => {
    switch (recordType) {
      case 'lab_result': return <FileType2 className="text-blue-500 h-6 w-6" />;
      case 'prescription': return <FileText className="text-green-500 h-6 w-6" />;
      case 'imaging': return <FileType2 className="text-purple-500 h-6 w-6" />;
      default: return <FileText className="text-slate-500 h-6 w-6" />;
    }
  };

  const getRecordBg = (recordType: string) => {
    switch (recordType) {
      case 'lab_result': return 'bg-blue-100 dark:bg-blue-900/30';
      case 'prescription': return 'bg-green-100 dark:bg-green-900/30';
      case 'imaging': return 'bg-purple-100 dark:bg-purple-900/30';
      default: return 'bg-slate-100 dark:bg-slate-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
          <FileText className="h-8 w-8 text-slate-700 dark:text-slate-300" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Health Records</h1>
          <p className="text-slate-500">Securely store and manage your medical documents.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-1 h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" /> Upload Record
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Document Title</label>
              <input 
                type="text" required placeholder="e.g. Annual Blood Work"
                className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={title} onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Record Type</label>
              <select 
                className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                value={type} onChange={(e) => setType(e.target.value)}
              >
                <option value="lab_result" className="dark:bg-slate-800">Lab Result</option>
                <option value="prescription" className="dark:bg-slate-800">Prescription</option>
                <option value="imaging" className="dark:bg-slate-800">Imaging / Scan</option>
                <option value="clinical_note" className="dark:bg-slate-800">Clinical Note</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">File URL / Reference</label>
              <input 
                type="text" placeholder="https://..."
                className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                value={fileUrl} onChange={(e) => setFileUrl(e.target.value)}
              />
              <p className="text-xs text-slate-400 mt-1">In this demo, enter a link to an external file.</p>
            </div>
            <button 
              type="submit" disabled={isLoading}
              className="w-full h-11 bg-primary text-white font-medium rounded-md hover:bg-primary/90 disabled:opacity-70 transition-colors mt-2"
            >
              {isLoading ? 'Saving...' : 'Save Record'}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-600 dark:text-slate-400" /> My Documents
            </h2>
          </div>
          
          {isFetching ? (
            <div className="text-center py-12 text-slate-500">Loading documents...</div>
          ) : records.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center text-slate-500">
              <FileText className="h-12 w-12 text-slate-300 mb-3" />
              <p>No records found. Upload your first document.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {records.map((rec) => (
                <div key={rec.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-primary/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${getRecordBg(rec.type)}`}>
                      {getRecordIcon(rec.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{rec.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{rec.type.replace('_', ' ')}</span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="text-xs text-slate-500">
                          {new Date(rec.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="View Document">
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
