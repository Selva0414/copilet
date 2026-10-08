import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import Dashboard from './pages/Dashboard.tsx';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
