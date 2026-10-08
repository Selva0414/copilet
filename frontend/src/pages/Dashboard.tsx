import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import AiCopilot from './AiCopilot.tsx';
import Medications from './Medications.tsx';
import Analytics from './Analytics.tsx';
import HealthRecords from './HealthRecords.tsx';
import SleepTracker from './SleepTracker.tsx';
import SymptomsTracker from './SymptomsTracker.tsx';
import ActivityTracker from './ActivityTracker.tsx';
import NutritionTracker from './NutritionTracker.tsx';
import MoodTracker from './MoodTracker.tsx';
import HealthGoalTracker from './HealthGoalTracker.tsx';
import DoctorPrep from './DoctorPrep.tsx';
import Timeline from './Timeline.tsx';
import EmergencyContacts from './EmergencyContacts.tsx';
import Settings from './Settings.tsx';
import { 
  Activity, 
  Home, 
  Bot, 
  Stethoscope, 
  BarChart, 
  FileText, 
  Pill, 
  Moon, 
  Footprints, 
  Apple, 
  Smile, 
  Target, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b">
          <Activity className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold text-lg">HealthCopilot</span>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3 text-sm font-medium">
            <NavItem to="/dashboard" icon={<Home size={18} />} label="Dashboard" />
            <NavItem to="/dashboard/ai" icon={<Bot size={18} />} label="AI Copilot" />
            <NavItem to="/dashboard/symptoms" icon={<Stethoscope size={18} />} label="Symptoms" />
            <NavItem to="/dashboard/analytics" icon={<BarChart size={18} />} label="Analytics" />
            <NavItem to="/dashboard/records" icon={<FileText size={18} />} label="Health Records" />
            <NavItem to="/dashboard/medications" icon={<Pill size={18} />} label="Medications" />
            
            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tracking</p>
            </div>
            <NavItem to="/dashboard/sleep" icon={<Moon size={18} />} label="Sleep" />
            <NavItem to="/dashboard/activity" icon={<Footprints size={18} />} label="Activity" />
            <NavItem to="/dashboard/nutrition" icon={<Apple size={18} />} label="Nutrition" />
            <NavItem to="/dashboard/mood" icon={<Smile size={18} />} label="Mood" />
            
            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Planning</p>
            </div>
            <NavItem to="/dashboard/goals" icon={<Target size={18} />} label="Goals" />
            <NavItem to="/dashboard/doctor-prep" icon={<Calendar size={18} />} label="Doctor Prep" />
            <NavItem to="/dashboard/timeline" icon={<Clock size={18} />} label="Timeline" />
            
            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</p>
            </div>
            <NavItem to="/dashboard/emergency" icon={<AlertTriangle size={18} className="text-red-500" />} label="Emergency" />
            <NavItem to="/dashboard/settings" icon={<SettingsIcon size={18} />} label="Settings" />
          </nav>
        </div>
        <div className="p-4 border-t">
          <button onClick={handleLogout} className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-700">
            <LogOut size={18} className="mr-3 text-gray-400" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-800 border-b md:hidden">
          <div className="flex items-center">
            <Activity className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold">HealthCopilot</span>
          </div>
          <button onClick={handleLogout} className="text-gray-500"><LogOut size={20} /></button>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/ai" element={<AiCopilot />} />
            <Route path="/medications" element={<Medications />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/records" element={<HealthRecords />} />
            <Route path="/sleep" element={<SleepTracker />} />
            <Route path="/symptoms" element={<SymptomsTracker />} />
            <Route path="/activity" element={<ActivityTracker />} />
            <Route path="/nutrition" element={<NutritionTracker />} />
            <Route path="/mood" element={<MoodTracker />} />
            <Route path="/goals" element={<HealthGoalTracker />} />
            <Route path="/doctor-prep" element={<DoctorPrep />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/emergency" element={<EmergencyContacts />} />
            <Route path="/settings" element={<Settings />} />
            {/* Other routes will go here */}
            <Route path="*" element={<div className="p-4 bg-yellow-50 text-yellow-800 rounded-md">Page under construction</div>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  return (
    <Link to={to} className="group flex items-center px-3 py-2 text-slate-700 rounded-md hover:bg-primary/10 hover:text-primary hover:translate-x-1 transition-all duration-300">
      <span className="mr-3 text-slate-400 group-hover:text-primary group-hover:scale-110 transition-transform duration-300">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function DashboardHome() {
  const [metrics, setMetrics] = useState({
    sleep: 'No data',
    steps: 'No data',
    mood: 'No data'
  });
  const [userFirstName, setUserFirstName] = useState('User');

  useEffect(() => {
    // Parse user name
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const u = JSON.parse(userString);
        if (u.name) setUserFirstName(u.name.split(' ')[0]);
      } catch (e) {}
    }

    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [sleepRes, activityRes, moodRes] = await Promise.all([
          fetch('http://localhost:5000/api/sleep', { headers }),
          fetch('http://localhost:5000/api/activity', { headers }),
          fetch('http://localhost:5000/api/mood', { headers })
        ]);

        const sleepData = await sleepRes.json();
        const activityData = await activityRes.json();
        const moodData = await moodRes.json();

        setMetrics({
          sleep: sleepData.success && sleepData.data.length > 0 ? `${sleepData.data[0].duration}h` : 'No data',
          steps: activityData.success && activityData.data.length > 0 ? activityData.data[0].steps.toLocaleString() : 'No data',
          mood: moodData.success && moodData.data.length > 0 ? moodData.data[0].mood : 'No data'
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold">Good Morning, {userFirstName} 👋</h1>
      <p className="text-gray-500">Here is your health overview for today.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard title="Heart Rate" value="72 BPM" icon="❤️" color="bg-red-50 text-red-600" />
        <MetricCard title="Sleep" value={metrics.sleep} icon="😴" color="bg-indigo-50 text-indigo-600" />
        <MetricCard title="Steps" value={metrics.steps} icon="🚶" color="bg-green-50 text-green-600" />
        <MetricCard title="Water" value="1.8 L" icon="💧" color="bg-blue-50 text-blue-600" />
        <MetricCard title="Weight" value="68.5 kg" icon="⚖️" color="bg-orange-50 text-orange-600" />
        <MetricCard title="Mood" value={metrics.mood} icon="😊" color="bg-yellow-50 text-yellow-600" />
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border mt-6">
        <h2 className="text-xl font-bold mb-4">Today's Progress</h2>
        <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 mb-2">
          <div className="bg-primary h-4 rounded-full" style={{ width: '82%' }}></div>
        </div>
        <p className="text-sm text-gray-500 text-right">82% Wellness Score</p>
        <p className="text-xs text-gray-400 mt-2 italic">Note: The wellness score is an informational indicator, not a medical diagnosis.</p>
      </div>

      <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 mt-6 flex items-start gap-4">
        <div className="bg-primary/10 p-3 rounded-full shrink-0">
          <Bot className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-lg mb-1">HealthCopilot AI Insights</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Your recorded sleep duration has been more consistent this week. Keep it up!</p>
          <Link to="/dashboard/ai" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
            Chat with AI <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, color }: { title: string, value: string, icon: string, color: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
      <div className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
    </div>
  );
}

import { ArrowRight } from 'lucide-react';
