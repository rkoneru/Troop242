import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchWidget from './components/SearchWidget';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
import TroopFinances from './pages/TroopFinances';
import RankTrackerWizard from './pages/RankTrackerWizard';
import MeritTrackerWizard from './pages/MeritTrackerWizard';
import SkillsTrackerWizard from './pages/SkillsTrackerWizard';
import ActivitiesPage from './pages/ActivitiesPage';
import GamesLanding from './pages/GamesLanding';
import ScoutToolsPortal from './pages/ScoutToolsPortal';
import UserProfile from './pages/UserProfile';
import SendInvitations from './pages/SendInvitations';
import RegisterWithInvite from './pages/RegisterWithInvite';
import ReferralLinks from './pages/ReferralLinks';
import './App.css';

/**
 * Protected route wrapper that checks authentication
 */
function ProtectedRoute({ children, allowedRoles = null }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/member-login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
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
      <Route path="/leader-dashboard" element={<><Header /><ProtectedRoute allowedRoles={['leader', 'admin']}><LeaderDashboard /></ProtectedRoute><Footer /></>} />
      <Route path="/admin-dashboard" element={<><Header /><ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute><Footer /></>} />
      <Route path="/new-scout" element={<><Header /><NewScout /><Footer /></>} />
      <Route path="/glossary" element={<><Header /><Glossary /><Footer /></>} />
      <Route path="/scout-dashboard" element={<><Header /><ProtectedRoute allowedRoles={['scout', 'leader', 'admin']}><ScoutDashboard /></ProtectedRoute><Footer /></>} />
      <Route path="/profile" element={<><Header /><ProtectedRoute><UserProfile /></ProtectedRoute><Footer /></>} />
      <Route path="/games" element={<><Header /><GamesLanding /><Footer /></>} />
      <Route path="/troop-finances" element={<TroopFinances />} />
      <Route path="/send-invitations" element={<><Header /><ProtectedRoute allowedRoles={['leader', 'admin']}><SendInvitations /></ProtectedRoute><Footer /></>} />
      <Route path="/referral-links" element={<><Header /><ProtectedRoute allowedRoles={['leader', 'admin']}><ReferralLinks /></ProtectedRoute><Footer /></>} />
      <Route path="/register" element={<><Header /><RegisterWithInvite /><Footer /></>} />

      {/* Wizard pages with custom headers - no global header/footer */}
      <Route path="/rank-tracker" element={<ProtectedRoute allowedRoles={['scout']}><RankTrackerWizard /></ProtectedRoute>} />
      <Route path="/merit-tracker" element={<ProtectedRoute allowedRoles={['scout']}><MeritTrackerWizard /></ProtectedRoute>} />
      <Route path="/skills-tracker" element={<ProtectedRoute allowedRoles={['scout']}><SkillsTrackerWizard /></ProtectedRoute>} />
      <Route path="/activities" element={<ActivitiesPage />} />
      <Route path="/scout-portal" element={<ScoutToolsPortal />} />
    </Routes>
  );
}

function App() {
  useEffect(() => {
    // Apply color theme
    const userTheme = localStorage.getItem('troopTheme');
    const adminDefault = localStorage.getItem('troopThemeDefault') || 'current';
    const active = userTheme || adminDefault;
    const tokens = THEMES[active]?.tokens || THEMES.current.tokens;
    Object.entries(tokens).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });

    // Apply UI framework
    const savedFramework = localStorage.getItem('troopFramework') || 'glass';
    document.body.dataset.framework = savedFramework;
  }, []);

  return (
    <AuthProvider>
      <Router basename="/Troop242/">
        <div className="app">
          <AppRoutes />
          <SearchWidget />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
