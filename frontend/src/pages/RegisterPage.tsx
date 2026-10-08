import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('https://copilet-3.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Could not connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl shadow-primary/5 border border-slate-100 dark:border-slate-700">
        <div className="flex flex-col items-center">
          <div className="bg-primary/10 p-3 rounded-full mb-4">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-center">Create an account</h2>
          <p className="text-sm text-slate-500 mt-2">Start your health journey today</p>
        </div>
        
        {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">{error}</div>}
        
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium leading-none" htmlFor="name">Full Name</label>
              <input 
                id="name" type="text" required 
                className="flex h-11 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                placeholder="John Doe"
                value={name} onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
              <input 
                id="email" type="email" required 
                className="flex h-11 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
              <input 
                id="password" type="password" required 
                className="flex h-11 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-2"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button 
            type="submit" disabled={isLoading}
            className="w-full inline-flex h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
