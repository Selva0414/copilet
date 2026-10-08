import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Save, Shield } from 'lucide-react';

export default function Settings() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    height: '',
    weight: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch current profile (mocked or real)
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        const nameParts = user.name ? user.name.split(' ') : [];
        setProfile({
          ...profile,
          firstName: nameParts[0] || '',
          lastName: nameParts[1] || ''
        });
      } catch (e) {}
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock save
    setTimeout(() => {
      setIsLoading(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
          <SettingsIcon className="h-8 w-8 text-slate-700 dark:text-slate-300" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-slate-500">Manage your account and profile preferences.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-2">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Personal Information
          </h2>
          
          {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <input 
                  type="text" name="firstName"
                  className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  value={profile.firstName} onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <input 
                  type="text" name="lastName"
                  className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  value={profile.lastName} onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Age</label>
                <input 
                  type="number" name="age"
                  className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  value={profile.age} onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Gender</label>
                <select 
                  name="gender"
                  className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  value={profile.gender} onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <option value="male" className="dark:bg-slate-800">Male</option>
                  <option value="female" className="dark:bg-slate-800">Female</option>
                  <option value="other" className="dark:bg-slate-800">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Height (cm)</label>
                <input 
                  type="number" name="height"
                  className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  value={profile.height} onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Weight (kg)</label>
                <input 
                  type="number" name="weight"
                  className="w-full h-11 px-3 py-2 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  value={profile.weight} onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" disabled={isLoading}
                className="h-11 px-6 bg-primary text-white font-medium rounded-md hover:bg-primary/90 disabled:opacity-70 transition-colors flex items-center gap-2"
              >
                {isLoading ? 'Saving...' : <><Save className="h-4 w-4" /> Save Profile</>}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 md:col-span-1 h-fit">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-500" /> Security
          </h2>
          <div className="space-y-4">
            <button className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <span className="block font-medium">Change Password</span>
              <span className="text-xs text-slate-500">Update your account password</span>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <span className="block font-medium">Two-Factor Auth</span>
              <span className="text-xs text-slate-500">Add an extra layer of security</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
