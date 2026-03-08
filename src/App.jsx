import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchWidget from './components/SearchWidget';
import { THEMES } from './utils/themes';
import Home from './pages/Home';
import Ranks from './pages/Ranks';
import Badges from './pages/Badges';
import Skills from './pages/Skills';
import Stories from './pages/Stories';
import About from './pages/About';
import Appearance from './pages/Appearance';
import Contact from './pages/Contact';
import Calendar from './pages/Calendar';
import MemberLogin from './pages/MemberLogin';
import ScoutSignup from './pages/ScoutSignup';
import LeaderDashboard from './pages/LeaderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ScoutPrinciples from './pages/ScoutPrinciples';
import NewScout from './pages/NewScout';
import Glossary from './pages/Glossary';
import ScoutDashboard from './pages/ScoutDashboard';
import RankTrackerWizard from './pages/RankTrackerWizard';
import './App.css';

function App() {
  useEffect(() => {
    const userTheme = localStorage.getItem('troopTheme');
    const adminDefault = localStorage.getItem('troopThemeDefault') || 'current';
    const active = userTheme || adminDefault;
    const tokens = THEMES[active]?.tokens || THEMES.current.tokens;
    Object.entries(tokens).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, []);

  return (
    <Router basename="/Troop242/">
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ranks" element={<Ranks />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/scout-principles" element={<ScoutPrinciples />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/about" element={<About />} />
          <Route path="/appearance" element={<Appearance />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/member-login" element={<MemberLogin />} />
          <Route path="/scout-signup" element={<ScoutSignup />} />
          <Route path="/leader-dashboard" element={<LeaderDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/new-scout" element={<NewScout />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/scout-dashboard" element={<ScoutDashboard />} />
          <Route path="/rank-tracker" element={<RankTrackerWizard />} />
        </Routes>
        <Footer />
        <SearchWidget />
      </div>
    </Router>
  );
}

export default App;
