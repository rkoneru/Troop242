import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchWidget from './components/SearchWidget';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { THEMES } from './utils/themes';
import { initializeTroopSettings } from './utils/adminData';
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
import Camping from './pages/camping-animation';
import CampingGuide from './pages/CampingGuide';
import ScoutsBSA from './pages/ScoutsBSA';
import MiscAwardsTracker from './pages/MiscAwardsTracker';
import './App.css';

/**
 * Theme manager that applies auth-state-driven theme switching
 */
function ThemeManager({ children }) {
  const { profile } = useAuth();

  useEffect(() => {
    // Initialize troop settings on first load
    initializeTroopSettings();
  }, []);

  useEffect(() => {
    // Color theme: user override > admin default > fallback to 'current'
    const userTheme = localStorage.getItem('troopTheme');
    const adminDefault = localStorage.getItem('troopThemeDefault') || 'current';
    const active = userTheme || adminDefault;
    const tokens = THEMES[active]?.tokens || THEMES.current.tokens;
    Object.entries(tokens).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });

    // UI framework: user override > default to 'glass'
    const userFramework = localStorage.getItem('troopFramework');
    const activeFramework = userFramework || 'glass';
    document.body.setAttribute('data-framework', activeFramework);
  }, [profile]);

  return children;
}

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

  // Check role if specified, but use profile?.role as fallback for incomplete profiles
  if (allowedRoles && profile) {
    if (!allowedRoles.includes(profile.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

/**
 * Global layout wrapper with Header, Footer and Main landmark
 */
function GlobalLayout() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex="-1">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

/**
 * Standalone layout wrapper with Main landmark (for wizards)
 */
function WizardLayout() {
  return (
    <main id="main-content" tabIndex="-1">
      <Outlet />
    </main>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<GlobalLayout />}>
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
        <Route path="/leader-dashboard" element={<ProtectedRoute allowedRoles={['leader', 'admin']}><LeaderDashboard /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/new-scout" element={<NewScout />} />
        <Route path="/scouts-bsa" element={<ScoutsBSA />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/scout-dashboard" element={<ProtectedRoute allowedRoles={['scout', 'leader', 'admin']}><ScoutDashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/games" element={<GamesLanding />} />
        <Route path="/troop-finances" element={<ProtectedRoute allowedRoles={['leader', 'admin']}><TroopFinances /></ProtectedRoute>} />
        <Route path="/send-invitations" element={<ProtectedRoute allowedRoles={['leader', 'admin']}><SendInvitations /></ProtectedRoute>} />
        <Route path="/referral-links" element={<ProtectedRoute allowedRoles={['leader', 'admin']}><ReferralLinks /></ProtectedRoute>} />
        <Route path="/register" element={<RegisterWithInvite />} />
        <Route path="/camping" element={<Camping />} />
        <Route path="/camping-guide" element={<CampingGuide />} />
      </Route>

      <Route element={<WizardLayout />}>
        <Route path="/rank-tracker" element={<ProtectedRoute allowedRoles={['scout']}><RankTrackerWizard /></ProtectedRoute>} />
        <Route path="/merit-tracker" element={<ProtectedRoute allowedRoles={['scout']}><MeritTrackerWizard /></ProtectedRoute>} />
        <Route path="/skills-tracker" element={<ProtectedRoute allowedRoles={['scout']}><SkillsTrackerWizard /></ProtectedRoute>} />
        <Route path="/misc-awards" element={<ProtectedRoute allowedRoles={['scout', 'leader', 'admin']}><MiscAwardsTracker /></ProtectedRoute>} />
        <Route path="/activities" element={<ProtectedRoute allowedRoles={['scout', 'leader', 'admin']}><ActivitiesPage /></ProtectedRoute>} />
        <Route path="/scout-portal" element={<ScoutToolsPortal />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeManager>
          <Router basename="/Troop242/">
            <div className="app">
              <AppRoutes />
              <SearchWidget />
            </div>
          </Router>
        </ThemeManager>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
