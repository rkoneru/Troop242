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
import MeritTrackerWizard from './pages/MeritTrackerWizard';
import SkillsTrackerWizard from './pages/SkillsTrackerWizard';
import ActivitiesPage from './pages/ActivitiesPage';
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
        <Routes>
          {/* Pages with global header/footer */}
          <Route path="/" element={<><Header /><Home /><Footer /></>} />
          <Route path="/ranks" element={<><Header /><Ranks /><Footer /></>} />
          <Route path="/badges" element={<><Header /><Badges /><Footer /></>} />
          <Route path="/skills" element={<><Header /><Skills /><Footer /></>} />
          <Route path="/scout-principles" element={<><Header /><ScoutPrinciples /><Footer /></>} />
          <Route path="/stories" element={<><Header /><Stories /><Footer /></>} />
          <Route path="/about" element={<><Header /><About /><Footer /></>} />
          <Route path="/appearance" element={<><Header /><Appearance /><Footer /></>} />
          <Route path="/calendar" element={<><Header /><Calendar /><Footer /></>} />
          <Route path="/contact" element={<><Header /><Contact /><Footer /></>} />
          <Route path="/member-login" element={<><Header /><MemberLogin /><Footer /></>} />
          <Route path="/scout-signup" element={<><Header /><ScoutSignup /><Footer /></>} />
          <Route path="/leader-dashboard" element={<><Header /><LeaderDashboard /><Footer /></>} />
          <Route path="/admin-dashboard" element={<><Header /><AdminDashboard /><Footer /></>} />
          <Route path="/new-scout" element={<><Header /><NewScout /><Footer /></>} />
          <Route path="/glossary" element={<><Header /><Glossary /><Footer /></>} />
          <Route path="/scout-dashboard" element={<><Header /><ScoutDashboard /><Footer /></>} />

          {/* Wizard pages with custom headers - no global header/footer */}
          <Route path="/rank-tracker" element={<RankTrackerWizard />} />
          <Route path="/merit-tracker" element={<MeritTrackerWizard />} />
          <Route path="/skills-tracker" element={<SkillsTrackerWizard />} />
          <Route path="/activities" element={<ActivitiesPage />} />
        </Routes>
        <SearchWidget />
      </div>
    </Router>
  );
}

export default App;
