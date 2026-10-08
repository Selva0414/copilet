import { Link } from 'react-router-dom';
import { Activity, Shield, Stethoscope, HeartPulse, BrainCircuit, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 selection:bg-primary/20">
      {/* Header */}
      <header className="px-6 lg:px-12 h-20 flex items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
        <Link className="flex items-center gap-2 group" to="/">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
            HealthCopilot <span className="text-primary">AI</span>
          </span>
        </Link>
        <nav className="ml-auto hidden md:flex items-center gap-8">
          <Link className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors" to="#features">Features</Link>
          <Link className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary transition-colors" to="#security">Security</Link>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-700"></div>
          <Link className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors" to="/login">Log in</Link>
          <Link className="text-sm font-medium bg-primary text-white px-5 py-2.5 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all" to="/register">
            Get Started
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 dark:opacity-30 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-400 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
          </div>
          
          <div className="container relative z-10 px-4 md:px-6 mx-auto text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Your intelligent health companion
            </div>
            
            <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6">
              Understand your health.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                Track your wellness.
              </span>
            </h1>
            
            <p className="mx-auto max-w-[700px] text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
              HealthCopilot AI is your personal healthcare assistant. Prepare better for medical visits, decode complex reports, and track your daily wellness with intelligent insights.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-medium text-white shadow-xl shadow-primary/20 transition-all hover:scale-105 hover:bg-primary/90">
                Start for free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link to="#features" className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full border-2 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm px-8 text-base font-medium text-slate-900 dark:text-white transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
                Explore features
              </Link>
            </div>
            
            <div className="mt-14 flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Secure Data</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> AI Insights</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> 100% Private</div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="w-full py-20 bg-white dark:bg-slate-950 relative border-y border-slate-100 dark:border-slate-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything you need for your health journey</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Powerful AI tools seamlessly integrated with daily habit tracking to give you a complete picture of your wellbeing.</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard 
                icon={<BrainCircuit className="h-8 w-8 text-primary" />}
                title="AI Copilot"
                description="Chat naturally with your health assistant to understand your metrics, decode medical jargon, and receive personalized wellness trends."
              />
              <FeatureCard 
                icon={<HeartPulse className="h-8 w-8 text-rose-500" />}
                title="Holistic Tracking"
                description="Beautiful, intuitive dashboards to log your sleep, steps, hydration, nutrition, and daily mood all in one secure place."
              />
              <FeatureCard 
                icon={<Stethoscope className="h-8 w-8 text-teal-500" />}
                title="Doctor Preparation"
                description="Generate intelligent summaries and a targeted list of questions to ask your physician before your next appointment."
              />
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="w-full py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl shadow-primary/5 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-8">
              <div className="shrink-0 bg-primary/10 p-6 rounded-full">
                <Shield className="h-16 w-16 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Uncompromising Privacy & Security</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  Your health data is highly sensitive. We utilize industry-standard encryption, secure authentication, and strict privacy controls. You own your data entirely and can export or permanently delete it at any time.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                  <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> End-to-end Encryption</div>
                  <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Strict Access Control</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-10 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="font-semibold">HealthCopilot AI</span>
          </div>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center md:max-w-md">
            HealthCopilot AI provides general wellness information and is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
          
          <div className="text-sm text-slate-500 dark:text-slate-400">
            © 2026. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group flex flex-col p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-primary/5 transition-all hover:-translate-y-1">
      <div className="mb-6 inline-flex p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
